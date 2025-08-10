var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express11 from "express";
import path3 from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import { fileURLToPath as fileURLToPath2 } from "url";

// server/routes/categories.ts
import express from "express";

// server/utils/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  auditLogs: () => auditLogs,
  categories: () => categories,
  categoriesRelations: () => categoriesRelations,
  documents: () => documents,
  emergencyContacts: () => emergencyContacts,
  emergencyContactsRelations: () => emergencyContactsRelations,
  encryptionKeys: () => encryptionKeys,
  features: () => features,
  featuresRelations: () => featuresRelations,
  formData: () => formData,
  governmentPartners: () => governmentPartners,
  governmentPartnersRelations: () => governmentPartnersRelations,
  governmentServices: () => governmentServices,
  governmentServicesRelations: () => governmentServicesRelations,
  otpCodes: () => otpCodes,
  reminders: () => reminders,
  subcategories: () => subcategories,
  subcategoriesRelations: () => subcategoriesRelations,
  updatedUserRelations: () => updatedUserRelations,
  userRelations: () => userRelations,
  userServiceAuthorizations: () => userServiceAuthorizations,
  userServiceAuthorizationsRelations: () => userServiceAuthorizationsRelations,
  users: () => users
});
import { pgTable, serial, varchar, text, timestamp, integer, boolean, json, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
var encryptionKeys = pgTable("encryption_keys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  publicKey: text("public_key"),
  encryptedPrivateKey: text("encrypted_private_key"),
  iv: varchar("iv", { length: 32 }),
  salt: varchar("salt", { length: 32 }),
  algorithm: varchar("algorithm", { length: 50 }).default("AES-256-GCM"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  active: boolean("active").default(true)
});
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }),
  passwordSalt: varchar("password_salt", { length: 64 }),
  role: varchar("role", { length: 20 }).default("user"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: varchar("two_factor_secret", { length: 255 }),
  lastLogin: timestamp("last_login"),
  loginAttempts: integer("login_attempts").default(0),
  lockedUntil: timestamp("locked_until"),
  emailVerified: boolean("email_verified").default(false),
  phoneNumber: varchar("phone_number", { length: 20 }),
  phoneVerified: boolean("phone_verified").default(false),
  preferredLanguage: varchar("preferred_language", { length: 10 }).default("he"),
  country: varchar("country", { length: 100 }).default("Israel"),
  region: varchar("region", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  active: boolean("active").default(true),
  dataEncryptionKeyId: integer("data_encryption_key_id").references(() => encryptionKeys.id)
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  icon: varchar("icon", { length: 100 }),
  description: text("description"),
  smartFeatures: text("smart_features"),
  includes: text("includes"),
  parentId: integer("parent_id"),
  // Self-reference handled in relations
  parentId: integer("parent_id"),
  // Will be handled in relations
  createdAt: timestamp("created_at").defaultNow()
});
var subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  categoryId: integer("category_id").references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow()
});
var features = pgTable("features", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }),
  label: varchar("label", { length: 255 }),
  url: varchar("url", { length: 255 }),
  subcategoryId: integer("subcategory_id").references(() => subcategories.id),
  createdAt: timestamp("created_at").defaultNow()
});
var documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  path: varchar("path", { length: 255 }),
  mimeType: varchar("mime_type", { length: 100 }),
  size: integer("size"),
  userId: integer("user_id").references(() => users.id),
  featureId: integer("feature_id").references(() => features.id),
  metadata: json("metadata"),
  verificationStatus: varchar("verification_status", { length: 50 }),
  verificationDetails: json("verification_details"),
  verifiedBy: integer("verified_by"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  frequency: varchar("frequency", { length: 20 }),
  // daily, weekly, monthly
  date: timestamp("date"),
  userId: integer("user_id").references(() => users.id),
  featureId: integer("feature_id").references(() => features.id),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var formData = pgTable("form_data", {
  id: serial("id").primaryKey(),
  data: json("data"),
  userId: integer("user_id").references(() => users.id),
  featureId: integer("feature_id").references(() => features.id),
  createdAt: timestamp("created_at").defaultNow()
});
var categoriesRelations = relations(categories, ({ many, one }) => ({
  subcategories: many(subcategories),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "parentCategory"
  })
}));
var subcategoriesRelations = relations(subcategories, ({ many, one }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
    relationName: "categoryToSubcategory"
  }),
  features: many(features)
}));
var featuresRelations = relations(features, ({ many, one }) => ({
  subcategory: one(subcategories, {
    fields: [features.subcategoryId],
    references: [subcategories.id],
    relationName: "subcategoryToFeature"
  }),
  documents: many(documents),
  reminders: many(reminders),
  formData: many(formData)
}));
var emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  relationship: varchar("relationship", { length: 100 }),
  accessLevel: varchar("access_level", { length: 20 }).default("basic"),
  createdAt: timestamp("created_at").defaultNow()
});
var userRelations = relations(users, ({ many }) => ({
  documents: many(documents, { relationName: "userDocuments" }),
  reminders: many(reminders, { relationName: "userReminders" }),
  formData: many(formData, { relationName: "userFormData" }),
  emergencyContacts: many(emergencyContacts, { relationName: "userEmergencyContacts" })
}));
var emergencyContactsRelations = relations(emergencyContacts, ({ one }) => ({
  user: one(users, {
    fields: [emergencyContacts.userId],
    references: [users.id],
    relationName: "emergencyContactUser"
  })
}));
var governmentPartners = pgTable("government_partners", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  type: varchar("type", { length: 100 }),
  // national, municipal, healthcare, etc.
  country: varchar("country", { length: 100 }),
  region: varchar("region", { length: 100 }),
  apiKey: varchar("api_key", { length: 255 }).notNull().default(""),
  // Make apiKey not null with default value
  apiSecret: varchar("api_secret", { length: 255 }),
  accessLevel: varchar("access_level", { length: 50 }).default("basic"),
  status: varchar("status", { length: 20 }).default("pending"),
  // pending, active, suspended
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  website: varchar("website", { length: 255 }),
  encryptionKeyId: integer("encryption_key_id").references(() => encryptionKeys.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  active: boolean("active").default(true),
  createdBy: integer("created_by")
});
var governmentServices = pgTable("government_services", {
  id: serial("id").primaryKey(),
  partnerId: integer("partner_id").references(() => governmentPartners.id),
  name: varchar("name", { length: 255 }),
  description: text("description"),
  apiEndpoint: varchar("api_endpoint", { length: 255 }),
  endpoint: varchar("endpoint", { length: 255 }),
  method: varchar("method", { length: 10 }).default("GET"),
  requiredParams: json("required_params"),
  optionalParams: json("optional_params"),
  responseFormat: json("response_format"),
  requiredScopes: json("required_scopes"),
  dataFields: json("data_fields"),
  category: varchar("category", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  active: boolean("active").default(true),
  createdBy: integer("created_by")
});
var userServiceAuthorizations = pgTable("user_service_authorizations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  serviceId: integer("service_id").references(() => governmentServices.id),
  authorizationToken: varchar("authorization_token", { length: 255 }),
  refreshToken: varchar("refresh_token", { length: 255 }),
  expiresAt: timestamp("expires_at"),
  scopes: json("scopes"),
  scope: varchar("scope", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  active: boolean("active").default(true),
  revokedAt: timestamp("revoked_at")
});
var auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }),
  resourceType: varchar("resource_type", { length: 100 }),
  resourceId: varchar("resource_id", { length: 100 }),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: varchar("user_agent", { length: 255 }),
  details: json("details"),
  timestamp: timestamp("timestamp").defaultNow(),
  severity: varchar("severity", { length: 20 }).default("info")
});
var otpCodes = pgTable("otp_codes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  code: varchar("code", { length: 10 }),
  type: varchar("type", { length: 20 }),
  // email, sms, app
  purpose: varchar("purpose", { length: 50 }),
  // login, verification, password_reset
  expiresAt: timestamp("expires_at"),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var governmentPartnersRelations = relations(governmentPartners, ({ many }) => ({
  services: many(governmentServices)
}));
var governmentServicesRelations = relations(governmentServices, ({ one, many }) => ({
  partner: one(governmentPartners, {
    fields: [governmentServices.partnerId],
    references: [governmentPartners.id]
  }),
  authorizations: many(userServiceAuthorizations)
}));
var userServiceAuthorizationsRelations = relations(userServiceAuthorizations, ({ one }) => ({
  user: one(users, {
    fields: [userServiceAuthorizations.userId],
    references: [users.id]
  }),
  service: one(governmentServices, {
    fields: [userServiceAuthorizations.serviceId],
    references: [governmentServices.id]
  })
}));
var updatedUserRelations = relations(users, ({ many, one }) => ({
  documents: many(documents),
  reminders: many(reminders),
  formData: many(formData),
  emergencyContacts: many(emergencyContacts),
  serviceAuthorizations: many(userServiceAuthorizations),
  auditLogs: many(auditLogs),
  otpCodes: many(otpCodes),
  encryptionKey: one(encryptionKeys, {
    fields: [users.dataEncryptionKeyId],
    references: [encryptionKeys.id]
  })
}));

// server/utils/db.ts
var { Pool } = pkg;
var pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/keeviqo"
});
var db = drizzle(pool, { schema: schema_exports });

// server/routes/categories.ts
import { eq } from "drizzle-orm";
var router = express.Router();
router.get("/", async (req, res) => {
  try {
    const categories2 = await db.select().from(categories);
    res.json(categories2);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const category = await db.select().from(categories).where(eq(categories.id, parseInt(req.params.id)));
    if (!category || category.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category[0]);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});
var categories_default = router;

// server/routes/subcategories.ts
import express2 from "express";
import { eq as eq2 } from "drizzle-orm";
var router2 = express2.Router();
router2.get("/", async (req, res) => {
  try {
    const subcategories2 = await db.select().from(subcategories);
    res.json(subcategories2);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
});
router2.get("/category/:id", async (req, res) => {
  try {
    const subcategories2 = await db.select().from(subcategories).where(eq2(subcategories.categoryId, parseInt(req.params.id)));
    res.json(subcategories2);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
});
router2.get("/:id", async (req, res) => {
  try {
    const subcategory = await db.select().from(subcategories).where(eq2(subcategories.id, parseInt(req.params.id)));
    if (!subcategory || subcategory.length === 0) {
      return res.status(404).json({ error: "Subcategory not found" });
    }
    const features2 = await db.select().from(features).where(eq2(features.subcategoryId, parseInt(req.params.id)));
    const result = {
      ...subcategory[0],
      features: features2 || []
    };
    res.json(result);
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    res.status(500).json({ error: "Failed to fetch subcategory" });
  }
});
var subcategories_default = router2;

// server/routes/features.ts
import express3 from "express";
import { eq as eq3 } from "drizzle-orm";
var router3 = express3.Router();
router3.get("/", async (req, res) => {
  try {
    const features2 = await db.select().from(features);
    res.json(features2);
  } catch (error) {
    console.error("Error fetching features:", error);
    res.status(500).json({ error: "Failed to fetch features" });
  }
});
router3.get("/subcategory/:id", async (req, res) => {
  try {
    const features2 = await db.select().from(features).where(eq3(features.subcategoryId, parseInt(req.params.id)));
    res.json(features2);
  } catch (error) {
    console.error("Error fetching features:", error);
    res.status(500).json({ error: "Failed to fetch features" });
  }
});
router3.get("/:id", async (req, res) => {
  try {
    const feature = await db.select().from(features).where(eq3(features.id, parseInt(req.params.id)));
    if (!feature || feature.length === 0) {
      return res.status(404).json({ error: "Feature not found" });
    }
    res.json(feature[0]);
  } catch (error) {
    console.error("Error fetching feature:", error);
    res.status(500).json({ error: "Failed to fetch feature" });
  }
});
var features_default = router3;

// server/routes/uploads.ts
import express4 from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { eq as eq4 } from "drizzle-orm";
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});
var upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
  // 10MB limit
});
var router4 = express4.Router();
router4.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { featureId, metadata } = req.body;
    const userId = 1;
    const document = await db.insert(documents).values({
      name: req.file.originalname,
      path: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      userId,
      featureId: parseInt(featureId),
      metadata: metadata ? JSON.parse(metadata) : {}
    }).returning();
    res.status(201).json(document[0]);
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ error: "Failed to upload document" });
  }
});
router4.get("/feature/:id", async (req, res) => {
  try {
    const documents2 = await db.select().from(documents).where(eq4(documents.featureId, parseInt(req.params.id)));
    res.json(documents2);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});
var uploads_default = router4;

// server/routes/reminders.ts
import express5 from "express";
import { eq as eq5 } from "drizzle-orm";
var router5 = express5.Router();
router5.post("/", async (req, res) => {
  try {
    const { title, description, frequency, date, featureId } = req.body;
    const userId = 1;
    const reminder = await db.insert(reminders).values({
      title,
      description,
      frequency,
      date: new Date(date),
      userId,
      featureId: parseInt(featureId),
      completed: false
    }).returning();
    res.status(201).json(reminder[0]);
  } catch (error) {
    console.error("Error creating reminder:", error);
    res.status(500).json({ error: "Failed to create reminder" });
  }
});
router5.get("/feature/:id", async (req, res) => {
  try {
    const reminders2 = await db.select().from(reminders).where(eq5(reminders.featureId, parseInt(req.params.id)));
    res.json(reminders2);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});
router5.put("/:id", async (req, res) => {
  try {
    const { title, description, frequency, date, completed } = req.body;
    const reminder = await db.update(reminders).set({
      title,
      description,
      frequency,
      date: new Date(date),
      completed
    }).where(eq5(reminders.id, parseInt(req.params.id))).returning();
    if (!reminder || reminder.length === 0) {
      return res.status(404).json({ error: "Reminder not found" });
    }
    res.json(reminder[0]);
  } catch (error) {
    console.error("Error updating reminder:", error);
    res.status(500).json({ error: "Failed to update reminder" });
  }
});
var reminders_default = router5;

// server/routes/forms.ts
import express6 from "express";
import { eq as eq6 } from "drizzle-orm";
var router6 = express6.Router();
router6.post("/", async (req, res) => {
  try {
    const { data, featureId } = req.body;
    const userId = 1;
    const formData2 = await db.insert(formData).values({
      data,
      userId,
      featureId: parseInt(featureId)
    }).returning();
    res.status(201).json(formData2[0]);
  } catch (error) {
    console.error("Error submitting form data:", error);
    res.status(500).json({ error: "Failed to submit form data" });
  }
});
router6.get("/feature/:id", async (req, res) => {
  try {
    const formData2 = await db.select().from(formData).where(eq6(formData.featureId, parseInt(req.params.id)));
    res.json(formData2);
  } catch (error) {
    console.error("Error fetching form data:", error);
    res.status(500).json({ error: "Failed to fetch form data" });
  }
});
var forms_default = router6;

// server/routes/qrcode.ts
import express7 from "express";
import QRCode from "qrcode";
import path2 from "path";
import fs2 from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
var router7 = express7.Router();
var __dirname2 = path2.dirname(fileURLToPath(import.meta.url));
var uploadsDir = path2.join(__dirname2, "../../uploads/qrcodes");
if (!fs2.existsSync(uploadsDir)) {
  fs2.mkdirSync(uploadsDir, { recursive: true });
}
router7.post("/generate", async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: "Data is required" });
    }
    const filename = `${uuidv4()}.png`;
    const filePath = path2.join(uploadsDir, filename);
    await QRCode.toFile(filePath, data, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 300
    });
    const qrCodeUrl = `/uploads/qrcodes/${filename}`;
    res.json({ qrCodeUrl });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});
var qrcode_default = router7;

// server/routes/emergency.ts
import express8 from "express";
import { eq as eq7 } from "drizzle-orm";
var router8 = express8.Router();
router8.get("/", async (req, res) => {
  try {
    const userId = 1;
    const contacts = await db.select().from(emergencyContacts).where(eq7(emergencyContacts.userId, userId));
    res.json(contacts);
  } catch (error) {
    console.error("Error fetching emergency contacts:", error);
    res.status(500).json({ error: "Failed to fetch emergency contacts" });
  }
});
router8.post("/", async (req, res) => {
  try {
    const { contacts } = req.body;
    if (!Array.isArray(contacts)) {
      return res.status(400).json({ error: "Invalid contacts data" });
    }
    const userId = 1;
    await db.delete(emergencyContacts).where(eq7(emergencyContacts.userId, userId));
    const savedContacts = [];
    for (const contact of contacts) {
      const [savedContact] = await db.insert(emergencyContacts).values({
        userId,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        relationship: contact.relationship,
        accessLevel: contact.accessLevel
      }).returning();
      savedContacts.push(savedContact);
    }
    res.status(201).json(savedContacts);
  } catch (error) {
    console.error("Error saving emergency contacts:", error);
    res.status(500).json({ error: "Failed to save emergency contacts" });
  }
});
var emergency_default = router8;

// server/routes/emergency-data.ts
import express9 from "express";
var router9 = express9.Router();
router9.get("/", async (req, res) => {
  try {
    const emergencyData = {
      user: {
        name: "\u05D3\u05D5\u05D3 \u05DB\u05D4\u05DF",
        id: "123456789",
        dateOfBirth: "1985-05-15",
        address: "\u05E8\u05D7\u05D5\u05D1 \u05D4\u05E8\u05E6\u05DC 123, \u05EA\u05DC \u05D0\u05D1\u05D9\u05D1",
        phone: "052-1234567"
      },
      medicalInfo: {
        bloodType: "A+",
        allergies: ["\u05E4\u05E0\u05D9\u05E6\u05D9\u05DC\u05D9\u05DF", "\u05D0\u05D2\u05D5\u05D6\u05D9\u05DD", "\u05DC\u05E7\u05D8\u05D5\u05D6"],
        medications: ["\u05D0\u05D5\u05DE\u05E4\u05E8\u05D6\u05D5\u05DC 20mg", "\u05E1\u05D9\u05DE\u05D1\u05E1\u05D8\u05D8\u05D9\u05DF 10mg"],
        conditions: ["\u05D0\u05E1\u05EA\u05DE\u05D4", "\u05DC\u05D7\u05E5 \u05D3\u05DD \u05D2\u05D1\u05D5\u05D4"],
        doctorName: '\u05D3"\u05E8 \u05E9\u05E8\u05D4 \u05DC\u05D5\u05D9',
        doctorPhone: "03-7654321",
        insuranceProvider: "\u05DB\u05DC\u05DC\u05D9\u05EA",
        insuranceNumber: "987654321"
      },
      documents: [
        {
          id: 1,
          name: "\u05DB\u05E8\u05D8\u05D9\u05E1 \u05D7\u05D1\u05E8 \u05E7\u05D5\u05E4\u05EA \u05D7\u05D5\u05DC\u05D9\u05DD",
          type: "PDF",
          url: "/uploads/health_card.pdf"
        },
        {
          id: 2,
          name: "\u05DE\u05E8\u05E9\u05DE\u05D9\u05DD \u05E7\u05D1\u05D5\u05E2\u05D9\u05DD",
          type: "PDF",
          url: "/uploads/prescriptions.pdf"
        },
        {
          id: 3,
          name: "\u05E1\u05D9\u05DB\u05D5\u05DD \u05D1\u05D9\u05E7\u05D5\u05E8 \u05D0\u05D7\u05E8\u05D5\u05DF",
          type: "PDF",
          url: "/uploads/last_visit.pdf"
        }
      ]
    };
    res.json(emergencyData);
  } catch (error) {
    console.error("Error fetching emergency data:", error);
    res.status(500).json({ error: "Failed to fetch emergency data" });
  }
});
router9.put("/", async (req, res) => {
  try {
    const { data } = req.body;
    res.json(data);
  } catch (error) {
    console.error("Error updating emergency data:", error);
    res.status(500).json({ error: "Failed to update emergency data" });
  }
});
var emergency_data_default = router9;

// server/routes/external-systems.ts
import express10 from "express";
var router10 = express10.Router();
router10.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;
    let links = [];
    switch (category.toLowerCase()) {
      case "health":
        links = [
          "https://www.health.gov.il/",
          "https://www.clalit.co.il/",
          "https://www.maccabi4u.co.il/",
          "https://www.meuhedet.co.il/",
          "https://www.leumit.co.il/"
        ];
        break;
      case "government":
        links = [
          "https://www.gov.il/he",
          "https://www.misrad-hapnim.gov.il/",
          "https://www.btl.gov.il/",
          "https://www.gov.il/he/departments/ministry_of_justice",
          "https://www.gov.il/he/departments/ministry_of_finance"
        ];
        break;
      case "education":
        links = [
          "https://edu.gov.il/",
          "https://www.campus.gov.il/",
          "https://www.universities-colleges.org.il/",
          "https://www.openu.ac.il/",
          "https://www.tau.ac.il/"
        ];
        break;
      case "finance":
        links = [
          "https://www.bankisrael.org.il/",
          "https://www.taxes.gov.il/",
          "https://www.btl.gov.il/benefits/Pages/default.aspx",
          "https://www.gov.il/he/departments/israel_tax_authority",
          "https://www.gov.il/he/departments/ministry_of_finance"
        ];
        break;
      case "transportation":
        links = [
          "https://www.gov.il/he/departments/ministry_of_transport",
          "https://www.rail.co.il/",
          "https://www.egged.co.il/",
          "https://www.dan.co.il/",
          "https://www.metropoline.com/"
        ];
        break;
      case "legal":
        links = [
          "https://www.gov.il/he/departments/ministry_of_justice",
          "https://www.israelbar.org.il/",
          "https://www.court.gov.il/",
          "https://www.nevo.co.il/",
          "https://www.takdin.co.il/"
        ];
        break;
      default:
        links = [
          "https://www.gov.il/he",
          "https://www.btl.gov.il/",
          "https://www.health.gov.il/",
          "https://edu.gov.il/",
          "https://www.taxes.gov.il/"
        ];
    }
    res.json(links);
  } catch (error) {
    console.error("Error fetching external system links:", error);
    res.status(500).json({ error: "Failed to fetch external system links" });
  }
});
var external_systems_default = router10;

// server/index.ts
dotenv.config();
var app = express11();
var port = process.env.PORT || 3e3;
var __dirname3 = path3.dirname(fileURLToPath2(import.meta.url));
app.use(cors());
app.use(express11.json());
app.use(express11.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "keeviqo-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use("/api/categories", categories_default);
app.use("/api/subcategories", subcategories_default);
app.use("/api/features", features_default);
app.use("/api/uploads", uploads_default);
app.use("/api/reminders", reminders_default);
app.use("/api/forms", forms_default);
app.use("/api/qr", qrcode_default);
app.use("/api/user/emergency-contacts", emergency_default);
app.use("/api/user/emergency-data", emergency_data_default);
app.use("/api/external-systems", external_systems_default);
app.use("/uploads", express11.static(path3.join(__dirname3, "../uploads")));
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use(express11.static(path3.join(__dirname3, "../dist")));
app.get("*", (req, res) => {
  res.sendFile(path3.join(__dirname3, "../dist/index.html"));
});
app.listen(port, () => {
  console.log(`Keeviqo running at http://localhost:${port}`);
});
var index_default = app;
export {
  index_default as default
};
