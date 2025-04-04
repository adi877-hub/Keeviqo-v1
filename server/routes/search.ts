import express from 'express';
import { db } from '../utils/db';
import * as schema from '../../shared/schema';
import { like, or, and, eq, sql } from 'drizzle-orm';
import { requirePermission, PermissionLevel } from '../middleware/role-based-access';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { query, options = {} } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const {
      typoTolerance = true,
      categories = [],
      dateRange,
      sortBy = 'relevance',
      limit = 20
    } = options;
    
    const searchTerms = typoTolerance 
      ? generateTypoTolerantTerms(query)
      : [query];
    
    const categoryResults = await searchCategories(searchTerms, categories, limit);
    
    const subcategoryResults = await searchSubcategories(searchTerms, categories, limit);
    
    const documentResults = await searchDocuments(searchTerms, req.user?.id, dateRange, limit);
    
    const reminderResults = await searchReminders(searchTerms, req.user?.id, dateRange, limit);
    
    const formResults = await searchFormData(searchTerms, req.user?.id, limit);
    
    let allResults = [
      ...categoryResults,
      ...subcategoryResults,
      ...documentResults,
      ...reminderResults,
      ...formResults
    ];
    
    allResults = sortResults(allResults, sortBy);
    
    allResults = allResults.slice(0, limit);
    
    res.json(allResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

function generateTypoTolerantTerms(query: string): string[] {
  const terms = [query];
  const words = query.toLowerCase().split(' ');
  
  words.forEach(word => {
    if (word.length <= 3) return; // Skip short words
    
    for (let i = 0; i < word.length - 1; i++) {
      const swapped = word.substring(0, i) + 
                      word[i + 1] + 
                      word[i] + 
                      word.substring(i + 2);
      terms.push(swapped);
    }
    
    for (let i = 0; i < word.length; i++) {
      const omitted = word.substring(0, i) + word.substring(i + 1);
      terms.push(omitted);
    }
    
    const substitutions: Record<string, string[]> = {
      'a': ['e', 'i'],
      'e': ['a', 'i'],
      'i': ['e', 'y'],
      'o': ['u', 'a'],
      'u': ['o'],
      's': ['z'],
      'c': ['k', 's'],
      'k': ['c'],
      'm': ['n'],
      'n': ['m']
    };
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const possibleSubstitutions = substitutions[char] || [];
      
      possibleSubstitutions.forEach(sub => {
        const substituted = word.substring(0, i) + sub + word.substring(i + 1);
        terms.push(substituted);
      });
    }
  });
  
  return [...new Set(terms)]; // Remove duplicates
}

async function searchCategories(searchTerms: string[], categoryIds: number[], limit: number) {
  const conditions = searchTerms.map(term => {
    return or(
      like(schema.categories.name, `%${term}%`),
      like(schema.categories.description, `%${term}%`),
      like(schema.categories.smartFeatures, `%${term}%`),
      like(schema.categories.includes, `%${term}%`)
    );
  });
  
  let query = db.select({
    id: schema.categories.id,
    title: schema.categories.name,
    description: schema.categories.description,
    type: db.val('category').as('type'),
    path: db.sql`concat('/category/', ${schema.categories.id})`.as('path'),
    relevance: db.sql`1`.as('relevance'), // Base relevance score
    lastUpdated: schema.categories.createdAt
  })
  .from(schema.categories)
  .where(or(...conditions));
  
  if (categoryIds.length > 0) {
    query = query.where(schema.categories.id.in(categoryIds));
  }
  
  const results = await query.limit(limit);
  
  return results.map(result => ({
    ...result,
    relevance: calculateRelevance(result.title, result.description || '', searchTerms)
  }));
}

async function searchSubcategories(searchTerms: string[], categoryIds: number[], limit: number) {
  const conditions = searchTerms.map(term => {
    return like(schema.subcategories.name, `%${term}%`);
  });
  
  let query = db.select({
    id: schema.subcategories.id,
    title: schema.subcategories.name,
    description: db.val('').as('description'),
    type: db.val('subcategory').as('type'),
    path: db.sql`concat('/subcategory/', ${schema.subcategories.id})`.as('path'),
    relevance: db.sql`0.9`.as('relevance'), // Slightly lower base relevance than categories
    lastUpdated: schema.subcategories.createdAt,
    category: schema.categories.name
  })
  .from(schema.subcategories)
  .leftJoin(schema.categories, eq(schema.subcategories.categoryId, schema.categories.id))
  .where(or(...conditions));
  
  if (categoryIds.length > 0) {
    query = query.where(schema.subcategories.categoryId.in(categoryIds));
  }
  
  const results = await query.limit(limit);
  
  return results.map(result => ({
    ...result,
    relevance: calculateRelevance(result.title, '', searchTerms) * 0.9
  }));
}

async function searchDocuments(searchTerms: string[], userId: number | undefined, dateRange: any, limit: number) {
  if (!userId) return []; // Only authenticated users can search documents
  
  const conditions = searchTerms.map(term => {
    return or(
      like(schema.documents.name, `%${term}%`),
      like(schema.documents.mimeType, `%${term}%`)
    );
  });
  
  let query = db.select({
    id: schema.documents.id,
    title: schema.documents.name,
    description: db.val('').as('description'),
    type: db.val('document').as('type'),
    path: db.sql`concat('/document/', ${schema.documents.id})`.as('path'),
    relevance: db.sql`0.8`.as('relevance'),
    lastUpdated: schema.documents.createdAt
  })
  .from(schema.documents)
  .where(and(
    or(...conditions),
    eq(schema.documents.userId, userId)
  ));
  
  if (dateRange && dateRange.start && dateRange.end) {
    query = query.where(and(
      schema.documents.createdAt >= new Date(dateRange.start),
      schema.documents.createdAt <= new Date(dateRange.end)
    ));
  }
  
  const results = await query.limit(limit);
  
  return results.map(result => ({
    ...result,
    relevance: calculateRelevance(result.title, '', searchTerms) * 0.8
  }));
}

async function searchReminders(searchTerms: string[], userId: number | undefined, dateRange: any, limit: number) {
  if (!userId) return []; // Only authenticated users can search reminders
  
  const conditions = searchTerms.map(term => {
    return or(
      like(schema.reminders.title, `%${term}%`),
      like(schema.reminders.description, `%${term}%`)
    );
  });
  
  let query = db.select({
    id: schema.reminders.id,
    title: schema.reminders.title,
    description: schema.reminders.description,
    type: db.val('reminder').as('type'),
    path: db.sql`concat('/reminder/', ${schema.reminders.id})`.as('path'),
    relevance: db.sql`0.7`.as('relevance'),
    lastUpdated: schema.reminders.createdAt
  })
  .from(schema.reminders)
  .where(and(
    or(...conditions),
    eq(schema.reminders.userId, userId)
  ));
  
  if (dateRange && dateRange.start && dateRange.end) {
    query = query.where(and(
      schema.reminders.date >= new Date(dateRange.start),
      schema.reminders.date <= new Date(dateRange.end)
    ));
  }
  
  const results = await query.limit(limit);
  
  return results.map(result => ({
    ...result,
    relevance: calculateRelevance(result.title, result.description || '', searchTerms) * 0.7
  }));
}

async function searchFormData(searchTerms: string[], userId: number | undefined, limit: number) {
  if (!userId) return []; // Only authenticated users can search form data
  
  const results = await db.select({
    id: schema.formData.id,
    title: db.val('Form Data').as('title'),
    description: db.val('Form submission data').as('description'),
    type: db.val('form').as('type'),
    path: db.sql`concat('/form-data/', ${schema.formData.id})`.as('path'),
    relevance: db.sql`0.6`.as('relevance'),
    lastUpdated: schema.formData.createdAt
  })
  .from(schema.formData)
  .where(eq(schema.formData.userId, userId))
  .limit(limit);
  
  return results.map(result => ({
    ...result,
    relevance: 0.6
  }));
}

function calculateRelevance(title: string, description: string, searchTerms: string[]): number {
  let score = 0;
  const content = (title + ' ' + description).toLowerCase();
  
  searchTerms.forEach(term => {
    if (title.toLowerCase().includes(term.toLowerCase())) {
      score += 0.5;
    }
    
    if (content.includes(term.toLowerCase())) {
      score += 0.3;
    }
    
    const wordBoundaryRegex = new RegExp(`\\b${term.toLowerCase()}\\b`);
    if (wordBoundaryRegex.test(content)) {
      score += 0.2;
    }
  });
  
  return Math.min(score, 1); // Cap at 1.0
}

function sortResults(results: any[], sortBy: string) {
  switch (sortBy) {
    case 'date':
      return results.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    case 'title':
      return results.sort((a, b) => a.title.localeCompare(b.title));
    case 'relevance':
    default:
      return results.sort((a, b) => b.relevance - a.relevance);
  }
}

export default router;
