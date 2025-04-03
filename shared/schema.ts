import { pgTable, serial, varchar, text, timestamp, integer, boolean, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
  role: varchar('role', { length: 20 }).default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  icon: varchar('icon', { length: 100 }),
  description: text('description'),
  smartFeatures: text('smart_features'),
  includes: text('includes'),
  parentId: integer('parent_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const subcategories = pgTable('subcategories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  categoryId: integer('category_id').references(() => categories.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const features = pgTable('features', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }),
  label: varchar('label', { length: 255 }),
  url: varchar('url', { length: 255 }),
  subcategoryId: integer('subcategory_id').references(() => subcategories.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  path: varchar('path', { length: 255 }),
  mimeType: varchar('mime_type', { length: 100 }),
  size: integer('size'),
  userId: integer('user_id').references(() => users.id),
  featureId: integer('feature_id').references(() => features.id),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reminders = pgTable('reminders', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  description: text('description'),
  frequency: varchar('frequency', { length: 20 }), // daily, weekly, monthly
  date: timestamp('date'),
  userId: integer('user_id').references(() => users.id),
  featureId: integer('feature_id').references(() => features.id),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const formData = pgTable('form_data', {
  id: serial('id').primaryKey(),
  data: json('data'),
  userId: integer('user_id').references(() => users.id),
  featureId: integer('feature_id').references(() => features.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  subcategories: many(subcategories),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
}));

export const subcategoriesRelations = relations(subcategories, ({ many, one }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
  features: many(features),
}));

export const featuresRelations = relations(features, ({ many, one }) => ({
  subcategory: one(subcategories, {
    fields: [features.subcategoryId],
    references: [subcategories.id],
  }),
  documents: many(documents),
  reminders: many(reminders),
  formData: many(formData),
}));

export const emergencyContacts = pgTable('emergency_contacts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  relationship: varchar('relationship', { length: 100 }),
  accessLevel: varchar('access_level', { length: 20 }).default('basic'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  documents: many(documents),
  reminders: many(reminders),
  formData: many(formData),
  emergencyContacts: many(emergencyContacts),
}));

export const emergencyContactsRelations = relations(emergencyContacts, ({ one }) => ({
  user: one(users, {
    fields: [emergencyContacts.userId],
    references: [users.id],
  }),
}));
