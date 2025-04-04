import { pgTable, serial, varchar, text, timestamp, integer, boolean, json, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const encryptionKeys = pgTable('encryption_keys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id'),
  publicKey: text('public_key'),
  encryptedPrivateKey: text('encrypted_private_key'),
  iv: varchar('iv', { length: 32 }),
  salt: varchar('salt', { length: 32 }),
  algorithm: varchar('algorithm', { length: 50 }).default('AES-256-GCM'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  active: boolean('active').default(true),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull().unique(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  password: varchar('password', { length: 255 }),
  passwordSalt: varchar('password_salt', { length: 64 }),
  role: varchar('role', { length: 20 }).default('user'),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  twoFactorSecret: varchar('two_factor_secret', { length: 255 }),
  lastLogin: timestamp('last_login'),
  loginAttempts: integer('login_attempts').default(0),
  lockedUntil: timestamp('locked_until'),
  emailVerified: boolean('email_verified').default(false),
  phoneNumber: varchar('phone_number', { length: 20 }),
  phoneVerified: boolean('phone_verified').default(false),
  preferredLanguage: varchar('preferred_language', { length: 10 }).default('he'),
  country: varchar('country', { length: 100 }).default('Israel'),
  region: varchar('region', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  active: boolean('active').default(true),
  dataEncryptionKeyId: integer('data_encryption_key_id').references(() => encryptionKeys.id),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  icon: varchar('icon', { length: 100 }),
  description: text('description'),
  smartFeatures: text('smart_features'),
  includes: text('includes'),

  parentId: integer('parent_id'), // Self-reference handled in relations

  parentId: integer('parent_id'), // Will be handled in relations

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
  verificationStatus: varchar('verification_status', { length: 50 }),
  verificationDetails: json('verification_details'),
  verifiedBy: integer('verified_by'),
  verifiedAt: timestamp('verified_at'),
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
    relationName: 'parentCategory',
  }),
}));

export const subcategoriesRelations = relations(subcategories, ({ many, one }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
    relationName: 'categoryToSubcategory',
  }),
  features: many(features),
}));

export const featuresRelations = relations(features, ({ many, one }) => ({
  subcategory: one(subcategories, {
    fields: [features.subcategoryId],
    references: [subcategories.id],
    relationName: 'subcategoryToFeature',
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
  documents: many(documents, { relationName: 'userDocuments' }),
  reminders: many(reminders, { relationName: 'userReminders' }),
  formData: many(formData, { relationName: 'userFormData' }),
  emergencyContacts: many(emergencyContacts, { relationName: 'userEmergencyContacts' }),
}));

export const emergencyContactsRelations = relations(emergencyContacts, ({ one }) => ({
  user: one(users, {
    fields: [emergencyContacts.userId],
    references: [users.id],
    relationName: 'emergencyContactUser',
  }),
}));

export const governmentPartners = pgTable('government_partners', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  description: text('description'),
  type: varchar('type', { length: 100 }), // national, municipal, healthcare, etc.
  country: varchar('country', { length: 100 }),
  region: varchar('region', { length: 100 }),
  apiKey: varchar('api_key', { length: 255 }).notNull().default(''), // Make apiKey not null with default value
  apiSecret: varchar('api_secret', { length: 255 }),
  accessLevel: varchar('access_level', { length: 50 }).default('basic'),
  status: varchar('status', { length: 20 }).default('pending'), // pending, active, suspended
  contactEmail: varchar('contact_email', { length: 255 }),
  contactPhone: varchar('contact_phone', { length: 50 }),
  website: varchar('website', { length: 255 }),
  encryptionKeyId: integer('encryption_key_id').references(() => encryptionKeys.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  active: boolean('active').default(true),
  createdBy: integer('created_by'),
});

export const governmentServices = pgTable('government_services', {
  id: serial('id').primaryKey(),
  partnerId: integer('partner_id').references(() => governmentPartners.id),
  name: varchar('name', { length: 255 }),
  description: text('description'),
  apiEndpoint: varchar('api_endpoint', { length: 255 }),
  endpoint: varchar('endpoint', { length: 255 }),
  method: varchar('method', { length: 10 }).default('GET'),
  requiredParams: json('required_params'),
  optionalParams: json('optional_params'),
  responseFormat: json('response_format'),
  requiredScopes: json('required_scopes'),
  dataFields: json('data_fields'),
  category: varchar('category', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  active: boolean('active').default(true),
  createdBy: integer('created_by'),
});

export const userServiceAuthorizations = pgTable('user_service_authorizations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  serviceId: integer('service_id').references(() => governmentServices.id),
  authorizationToken: varchar('authorization_token', { length: 255 }),
  refreshToken: varchar('refresh_token', { length: 255 }),
  expiresAt: timestamp('expires_at'),
  scopes: json('scopes'),
  scope: varchar('scope', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  active: boolean('active').default(true),
  revokedAt: timestamp('revoked_at'),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }),
  resourceType: varchar('resource_type', { length: 100 }),
  resourceId: varchar('resource_id', { length: 100 }),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: varchar('user_agent', { length: 255 }),
  details: json('details'),
  timestamp: timestamp('timestamp').defaultNow(),
  severity: varchar('severity', { length: 20 }).default('info'),
});

export const otpCodes = pgTable('otp_codes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  code: varchar('code', { length: 10 }),
  type: varchar('type', { length: 20 }), // email, sms, app
  purpose: varchar('purpose', { length: 50 }), // login, verification, password_reset
  expiresAt: timestamp('expires_at'),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const governmentPartnersRelations = relations(governmentPartners, ({ many }) => ({
  services: many(governmentServices),
}));

export const governmentServicesRelations = relations(governmentServices, ({ one, many }) => ({
  partner: one(governmentPartners, {
    fields: [governmentServices.partnerId],
    references: [governmentPartners.id],
  }),
  authorizations: many(userServiceAuthorizations),
}));

export const userServiceAuthorizationsRelations = relations(userServiceAuthorizations, ({ one }) => ({
  user: one(users, {
    fields: [userServiceAuthorizations.userId],
    references: [users.id],
  }),
  service: one(governmentServices, {
    fields: [userServiceAuthorizations.serviceId],
    references: [governmentServices.id],
  }),
}));

export const updatedUserRelations = relations(users, ({ many, one }) => ({
  documents: many(documents),
  reminders: many(reminders),
  formData: many(formData),
  emergencyContacts: many(emergencyContacts),
  serviceAuthorizations: many(userServiceAuthorizations),
  auditLogs: many(auditLogs),
  otpCodes: many(otpCodes),
  encryptionKey: one(encryptionKeys, {
    fields: [users.dataEncryptionKeyId],
    references: [encryptionKeys.id],
  }),
}));
