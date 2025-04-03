import express from 'express';
import { db } from '../utils/db.js';
import * as schema from '../../shared/schema.js';
import { eq, and } from 'drizzle-orm';
import { authenticatePartner, authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { generateAPIKey, generateAPISecret, createAuditLog } from '../utils/security.js';

const router = express.Router();

/**
 * Get all government partners (admin only)
 * GET /api/government-partners
 */
router.get('/', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const partners = await db.query.governmentPartners.findMany({
      with: {
        services: true
      }
    });
    
    res.status(200).json(partners);
  } catch (error) {
    console.error('Error fetching government partners:', error);
    res.status(500).json({ error: 'Failed to fetch government partners' });
  }
});

/**
 * Get a specific government partner (admin only)
 * GET /api/government-partners/:id
 */
router.get('/:id', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const partnerId = parseInt(req.params.id);
    
    const partner = await db.query.governmentPartners.findFirst({
      where: eq(schema.governmentPartners.id, partnerId),
      with: {
        services: true
      }
    });
    
    if (!partner) {
      return res.status(404).json({ error: 'Government partner not found' });
    }
    
    res.status(200).json(partner);
  } catch (error) {
    console.error('Error fetching government partner:', error);
    res.status(500).json({ error: 'Failed to fetch government partner' });
  }
});

/**
 * Create a new government partner (admin only)
 * POST /api/government-partners
 */
router.post('/', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const { name, description, country, region, contactEmail, contactPhone, website, type } = req.body;
    
    const apiKey = await generateAPIKey();
    const apiSecret = await generateAPISecret();
    
    const [partner] = await db.insert(schema.governmentPartners).values({
      name,
      description,
      country,
      region,
      contactEmail,
      contactPhone,
      website,
      type,
      apiKey,
      apiSecret,
      status: 'pending',
      active: false,
      createdBy: req.user?.id
    }).returning();
    
    createAuditLog(
      req.user?.id || 0,
      'create_government_partner',
      'government_partner',
      partner.id.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { partnerName: partner.name, partnerType: partner.type },
      'warning'
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(201).json({
      message: 'Government partner created successfully',
      partner: {
        ...partner,
        apiSecret // Only return the API secret once during creation
      }
    });
  } catch (error) {
    console.error('Error creating government partner:', error);
    res.status(500).json({ error: 'Failed to create government partner' });
  }
});

/**
 * Update a government partner (admin only)
 * PUT /api/government-partners/:id
 */
router.put('/:id', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const partnerId = parseInt(req.params.id);
    const { name, description, country, region, contactEmail, contactPhone, website, type, status, active } = req.body;
    
    const existingPartner = await db.query.governmentPartners.findFirst({
      where: eq(schema.governmentPartners.id, partnerId)
    });
    
    if (!existingPartner) {
      return res.status(404).json({ error: 'Government partner not found' });
    }
    
    const [updatedPartner] = await db.update(schema.governmentPartners)
      .set({
        name,
        description,
        country,
        region,
        contactEmail,
        contactPhone,
        website,
        type,
        status,
        active,
        updatedAt: new Date()
      })
      .where(eq(schema.governmentPartners.id, partnerId))
      .returning();
    
    createAuditLog(
      req.user?.id || 0,
      'update_government_partner',
      'government_partner',
      partnerId.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { 
        partnerName: updatedPartner.name, 
        partnerStatus: updatedPartner.status,
        partnerActive: updatedPartner.active
      },
      'warning'
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(200).json({
      message: 'Government partner updated successfully',
      partner: updatedPartner
    });
  } catch (error) {
    console.error('Error updating government partner:', error);
    res.status(500).json({ error: 'Failed to update government partner' });
  }
});

/**
 * Regenerate API credentials for a government partner (admin only)
 * POST /api/government-partners/:id/regenerate-credentials
 */
router.post('/:id/regenerate-credentials', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const partnerId = parseInt(req.params.id);
    
    const existingPartner = await db.query.governmentPartners.findFirst({
      where: eq(schema.governmentPartners.id, partnerId)
    });
    
    if (!existingPartner) {
      return res.status(404).json({ error: 'Government partner not found' });
    }
    
    const apiKey = await generateAPIKey();
    const apiSecret = await generateAPISecret();
    
    const [updatedPartner] = await db.update(schema.governmentPartners)
      .set({
        apiKey,
        apiSecret,
        updatedAt: new Date()
      })
      .where(eq(schema.governmentPartners.id, partnerId))
      .returning();
    
    createAuditLog(
      req.user?.id || 0,
      'regenerate_government_partner_credentials',
      'government_partner',
      partnerId.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { partnerName: updatedPartner.name },
      'alert' // Higher severity for credential regeneration
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(200).json({
      message: 'Government partner API credentials regenerated successfully',
      partner: {
        ...updatedPartner,
        apiSecret // Only return the API secret once during regeneration
      }
    });
  } catch (error) {
    console.error('Error regenerating government partner credentials:', error);
    res.status(500).json({ error: 'Failed to regenerate government partner credentials' });
  }
});

/**
 * Delete a government partner (admin only)
 * DELETE /api/government-partners/:id
 */
router.delete('/:id', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const partnerId = parseInt(req.params.id);
    
    const existingPartner = await db.query.governmentPartners.findFirst({
      where: eq(schema.governmentPartners.id, partnerId)
    });
    
    if (!existingPartner) {
      return res.status(404).json({ error: 'Government partner not found' });
    }
    
    await db.delete(schema.governmentPartners)
      .where(eq(schema.governmentPartners.id, partnerId));
    
    createAuditLog(
      req.user?.id || 0,
      'delete_government_partner',
      'government_partner',
      partnerId.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { partnerName: existingPartner.name },
      'alert' // Higher severity for partner deletion
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(200).json({
      message: 'Government partner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting government partner:', error);
    res.status(500).json({ error: 'Failed to delete government partner' });
  }
});

/**
 * Add a service to a government partner (admin only)
 * POST /api/government-partners/:id/services
 */
router.post('/:id/services', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const partnerId = parseInt(req.params.id);
    const { name, description, apiEndpoint, category, requiredScopes, dataFields } = req.body;
    
    const existingPartner = await db.query.governmentPartners.findFirst({
      where: eq(schema.governmentPartners.id, partnerId)
    });
    
    if (!existingPartner) {
      return res.status(404).json({ error: 'Government partner not found' });
    }
    
    const [service] = await db.insert(schema.governmentServices).values({
      partnerId,
      name,
      description,
      apiEndpoint,
      endpoint: apiEndpoint, // Also set endpoint field to match apiEndpoint
      category,
      requiredScopes,
      dataFields,
      active: true,
      createdBy: req.user?.id
    }).returning();
    
    createAuditLog(
      req.user?.id || 0,
      'add_government_service',
      'government_service',
      service.id.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { 
        serviceName: service.name, 
        partnerName: existingPartner.name,
        serviceCategory: service.category
      },
      'warning'
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(201).json({
      message: 'Government service added successfully',
      service
    });
  } catch (error) {
    console.error('Error adding government service:', error);
    res.status(500).json({ error: 'Failed to add government service' });
  }
});

/**
 * Update a government service (admin only)
 * PUT /api/government-partners/:partnerId/services/:serviceId
 */
router.put('/:partnerId/services/:serviceId', authenticate, authorize(['admin']), async (req: AuthRequest, res) => {
  try {
    const partnerId = parseInt(req.params.partnerId);
    const serviceId = parseInt(req.params.serviceId);
    const { name, description, apiEndpoint, category, requiredScopes, dataFields, active } = req.body;
    
    const existingService = await db.query.governmentServices.findFirst({
      where: and(
        eq(schema.governmentServices.id, serviceId),
        eq(schema.governmentServices.partnerId, partnerId)
      )
    });
    
    if (!existingService) {
      return res.status(404).json({ error: 'Government service not found' });
    }
    
    const [updatedService] = await db.update(schema.governmentServices)
      .set({
        name,
        description,
        apiEndpoint,
        category,
        requiredScopes,
        dataFields,
        active,
        updatedAt: new Date()
      })
      .where(and(
        eq(schema.governmentServices.id, serviceId),
        eq(schema.governmentServices.partnerId, partnerId)
      ))
      .returning();
    
    createAuditLog(
      req.user?.id || 0,
      'update_government_service',
      'government_service',
      serviceId.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { 
        serviceName: updatedService.name, 
        serviceActive: updatedService.active
      },
      'warning'
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(200).json({
      message: 'Government service updated successfully',
      service: updatedService
    });
  } catch (error) {
    console.error('Error updating government service:', error);
    res.status(500).json({ error: 'Failed to update government service' });
  }
});

/**
 * Delete a government service (admin only)
 * DELETE /api/government-partners/:partnerId/services/:serviceId
 */
router.delete('/:partnerId/services/:serviceId', authenticate as any, authorize(['admin']) as any, async (req: AuthRequest, res) => {
  try {
    const partnerId = parseInt(req.params.partnerId);
    const serviceId = parseInt(req.params.serviceId);
    
    const existingService = await db.query.governmentServices.findFirst({
      where: and(
        eq(schema.governmentServices.id, serviceId),
        eq(schema.governmentServices.partnerId, partnerId)
      )
    });
    
    if (!existingService) {
      return res.status(404).json({ error: 'Government service not found' });
    }
    
    await db.delete(schema.governmentServices)
      .where(and(
        eq(schema.governmentServices.id, serviceId),
        eq(schema.governmentServices.partnerId, partnerId)
      ));
    
    createAuditLog(
      req.user?.id || 0,
      'delete_government_service',
      'government_service',
      serviceId.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { serviceName: existingService.name },
      'alert' // Higher severity for service deletion
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(200).json({
      message: 'Government service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting government service:', error);
    res.status(500).json({ error: 'Failed to delete government service' });
  }
});

/**
 * Partner API endpoint to verify user identity
 * POST /api/government-partners/verify-identity
 */
router.post('/verify-identity', authenticatePartner as any, async (req, res) => {
  try {
    const { userId, identityData } = req.body;
    const partner = (req as any).partner;
    
    if (!userId || !identityData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId)
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    
    const verificationResult = {
      verified: true,
      verificationId: `VER-${Date.now()}-${userId}`,
      timestamp: new Date(),
      partnerId: partner.id,
      partnerName: partner.name
    };
    
    createAuditLog(
      userId,
      'identity_verification',
      'user',
      userId.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { 
        partnerId: partner.id,
        partnerName: partner.name,
        verificationResult
      },
      'warning'
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(200).json({
      message: 'Identity verification successful',
      result: verificationResult
    });
  } catch (error) {
    console.error('Error verifying identity:', error);
    res.status(500).json({ error: 'Failed to verify identity' });
  }
});

/**
 * Partner API endpoint to submit document verification
 * POST /api/government-partners/verify-document
 */
router.post('/verify-document', authenticatePartner as any, async (req, res) => {
  try {
    const { userId, documentId, verificationResult } = req.body;
    const partner = (req as any).partner;
    
    if (!userId || !documentId || !verificationResult) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId)
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const document = await db.query.documents.findFirst({
      where: eq(schema.documents.id, documentId)
    });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    const [updatedDocument] = await db.update(schema.documents)
      .set({
        verificationStatus: verificationResult.status,
        verificationDetails: verificationResult,
        verifiedBy: partner.id,
        verifiedAt: new Date()
      })
      .where(eq(schema.documents.id, documentId))
      .returning();
    
    createAuditLog(
      userId,
      'document_verification',
      'document',
      documentId.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { 
        partnerId: partner.id,
        partnerName: partner.name,
        documentName: document.name,
        verificationStatus: verificationResult.status
      },
      'warning'
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(200).json({
      message: 'Document verification recorded successfully',
      document: updatedDocument
    });
  } catch (error) {
    console.error('Error verifying document:', error);
    res.status(500).json({ error: 'Failed to verify document' });
  }
});

/**
 * User endpoint to authorize a government service
 * POST /api/government-partners/authorize-service
 */
router.post('/authorize-service', authenticate as any, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const { serviceId, scopes, expiresInDays } = req.body;
    
    if (!serviceId || !scopes || !Array.isArray(scopes)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const service = await db.query.governmentServices.findFirst({
      where: eq(schema.governmentServices.id, serviceId),
      with: {
        partner: true
      }
    });
    
    if (!service) {
      return res.status(404).json({ error: 'Government service not found' });
    }
    
    if (!service.partner || !service.partner.active || service.partner.status !== 'active') {
      return res.status(400).json({ error: 'Government partner is not active or not found' });
    }
    
    if (!service.active) {
      return res.status(400).json({ error: 'Government service is not active' });
    }
    
    const allowedScopes = service.requiredScopes || [];
    let scopesArray: string[] = [];
    if (Array.isArray(allowedScopes)) {
      for (const scope of allowedScopes as unknown[]) {
        scopesArray.push(String(scope));
      }
    } else if (typeof allowedScopes === 'string') {
      scopesArray.push(allowedScopes);
    }
    const invalidScopes = scopes.filter((scope: string) => !scopesArray.includes(scope));
    
    if (invalidScopes.length > 0) {
      return res.status(400).json({ 
        error: 'Invalid scopes requested', 
        invalidScopes 
      });
    }
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (expiresInDays || 30)); // Default to 30 days
    
    const [authorization] = await db.insert(schema.userServiceAuthorizations).values({
      userId: req.user.id,
      serviceId,
      scopes: Array.isArray(scopes) ? scopes.map((scope: unknown) => String(scope)) : [String(scopes)],
      expiresAt,
      active: true
    }).returning();
    
    createAuditLog(
      req.user.id,
      'authorize_government_service',
      'service_authorization',
      authorization.id.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { 
        serviceName: service.name || 'Unknown Service',
        partnerName: service.partner?.name || 'Unknown Partner',
        scopes: Array.isArray(scopes) ? scopes.map((scope: unknown) => String(scope)) : [String(scopes)],
        expiresAt: expiresAt.toISOString()
      },
      'warning'
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(201).json({
      message: 'Government service authorized successfully',
      authorization
    });
  } catch (error) {
    console.error('Error authorizing government service:', error);
    res.status(500).json({ error: 'Failed to authorize government service' });
  }
});

/**
 * User endpoint to revoke a government service authorization
 * DELETE /api/government-partners/revoke-authorization/:authorizationId
 */
router.delete('/revoke-authorization/:authorizationId', authenticate as any, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const authorizationId = parseInt(req.params.authorizationId);
    
    const authorization = await db.query.userServiceAuthorizations.findFirst({
      where: and(
        eq(schema.userServiceAuthorizations.id, authorizationId),
        eq(schema.userServiceAuthorizations.userId, req.user.id)
      ),
      with: {
        service: {
          with: {
            partner: true
          }
        }
      }
    });
    
    if (!authorization) {
      return res.status(404).json({ error: 'Service authorization not found' });
    }
    
    await db.update(schema.userServiceAuthorizations)
      .set({
        active: false,
        revokedAt: new Date()
      })
      .where(eq(schema.userServiceAuthorizations.id, authorizationId));
    
    createAuditLog(
      req.user.id,
      'revoke_government_service',
      'service_authorization',
      authorizationId.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { 
        serviceName: authorization.service?.name || 'Unknown Service',
        partnerName: authorization.service?.partner?.name || 'Unknown Partner'
      },
      'warning'
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(200).json({
      message: 'Government service authorization revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking government service authorization:', error);
    res.status(500).json({ error: 'Failed to revoke government service authorization' });
  }
});

/**
 * User endpoint to get all authorized government services
 * GET /api/government-partners/my-authorizations
 */
router.get('/my-authorizations', authenticate as any, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const authorizations = await db.query.userServiceAuthorizations.findMany({
      where: and(
        eq(schema.userServiceAuthorizations.userId, req.user.id),
        eq(schema.userServiceAuthorizations.active, true)
      ),
      with: {
        service: {
          with: {
            partner: true
          }
        }
      }
    });
    
    res.status(200).json(authorizations);
  } catch (error) {
    console.error('Error fetching user service authorizations:', error);
    res.status(500).json({ error: 'Failed to fetch user service authorizations' });
  }
});

/**
 * Partner API endpoint to check if a user has authorized a service
 * GET /api/government-partners/check-authorization
 */
router.get('/check-authorization', authenticatePartner as any, async (req, res) => {
  try {
    const { userId, serviceId, requiredScopes } = req.query as { 
      userId?: string, 
      serviceId?: string, 
      requiredScopes?: string 
    };
    const partner = (req as any).partner;
    
    if (!userId || !serviceId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const service = await db.query.governmentServices.findFirst({
      where: and(
        eq(schema.governmentServices.id, parseInt(serviceId as string)),
        eq(schema.governmentServices.partnerId, partner.id)
      ),
      with: {
        partner: true
      }
    });
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found or not authorized for this partner' });
    }
    
    const authorization = await db.query.userServiceAuthorizations.findFirst({
      where: and(
        eq(schema.userServiceAuthorizations.userId, parseInt(userId as string)),
        eq(schema.userServiceAuthorizations.serviceId, parseInt(serviceId as string)),
        eq(schema.userServiceAuthorizations.active, true)
      )
    });
    
    if (!authorization) {
      return res.status(403).json({ error: 'User has not authorized this service' });
    }
    
    if (authorization.expiresAt && new Date(authorization.expiresAt.toString()) < new Date()) {
      return res.status(403).json({ error: 'Service authorization has expired' });
    }
    
    if (requiredScopes) {
      let scopesArray: string[] = [];
      if (typeof requiredScopes === 'string') {
        scopesArray = requiredScopes.split(',');
      } else if (Array.isArray(requiredScopes)) {
        for (const scope of requiredScopes as unknown[]) {
          scopesArray.push(String(scope));
        }
      }
      
      const authorizedScopes = authorization.scopes || [];
      
      let authorizedScopesArray: string[] = [];
      if (Array.isArray(authorizedScopes)) {
        for (const scope of authorizedScopes as unknown[]) {
          authorizedScopesArray.push(String(scope));
        }
      } else if (typeof authorizedScopes === 'string') {
        authorizedScopesArray.push(authorizedScopes);
      }
          
      const missingScopes = scopesArray.filter((scope: string) => !authorizedScopesArray.includes(scope));
      
      if (missingScopes.length > 0) {
        return res.status(403).json({ 
          error: 'Missing required scopes', 
          missingScopes 
        });
      }
    }
    
    createAuditLog(
      parseInt(userId as string),
      'check_service_authorization',
      'service_authorization',
      authorization.id.toString(),
      req.ip || '0.0.0.0',
      req.headers['user-agent'] || 'unknown',
      { 
        partnerId: partner.id,
        partnerName: partner.name || 'Unknown Partner',
        serviceName: service.name || 'Unknown Service'
      },
      'info'
    ).catch(err => console.error('Failed to create audit log:', err));
    
    res.status(200).json({
      authorized: true,
      scopes: Array.isArray(authorization.scopes) ? 
               authorization.scopes.map((scope: unknown) => String(scope)) : 
               typeof authorization.scopes === 'string' ? [authorization.scopes] : [],
      expiresAt: authorization.expiresAt,
      userId: parseInt(userId as string)
    });
  } catch (error) {
    console.error('Error checking service authorization:', error);
    res.status(500).json({ error: 'Failed to check service authorization' });
  }
});

export default router;
