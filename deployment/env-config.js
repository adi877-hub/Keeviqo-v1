/**
 * Environment configuration utility for Keeviqo
 * 
 * This script helps manage environment-specific configurations
 * and ensures all required environment variables are set.
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

const requiredVars = {
  development: [
    'PORT',
    'DATABASE_URL',
    'SESSION_SECRET',
  ],
  production: [
    'PORT',
    'DATABASE_URL',
    'SESSION_SECRET',
    'NODE_ENV',
  ],
};

const defaultValues = {
  development: {
    PORT: '3000',
    DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/keeviqo',
    SESSION_SECRET: 'keeviqo-dev-secret',
  },
};

/**
 * Validates that all required environment variables are set
 * @param {string} env - The current environment (development, production)
 * @returns {boolean} - Whether all required variables are set
 */
export function validateEnv(env = globalThis.process.env.NODE_ENV || 'development') {
  const required = requiredVars[env] || requiredVars.development;
  const missing = [];

  for (const variable of required) {
    if (!globalThis.process.env[variable]) {
      missing.push(variable);
    }
  }

  if (missing.length > 0) {
    globalThis.console.error(`Missing required environment variables for ${env} environment: ${missing.join(', ')}`);
    return false;
  }

  return true;
}

/**
 * Gets the current environment configuration
 * @returns {object} - The current environment configuration
 */
export function getConfig() {
  const env = globalThis.process.env.NODE_ENV || 'development';
  
  if (env === 'development') {
    for (const [key, value] of Object.entries(defaultValues.development)) {
      if (!globalThis.process.env[key]) {
        globalThis.process.env[key] = value;
      }
    }
  }
  
  validateEnv(env);
  
  return {
    env,
    port: globalThis.process.env.PORT,
    databaseUrl: globalThis.process.env.DATABASE_URL,
    sessionSecret: globalThis.process.env.SESSION_SECRET,
    isProduction: env === 'production',
    isDevelopment: env === 'development',
  };
}

/**
 * Creates a sample .env file with required variables
 * @param {string} targetPath - Path to create the .env file
 * @param {string} env - The environment to create the file for
 */
export function createEnvFile(targetPath, env = 'development') {
  const required = requiredVars[env] || requiredVars.development;
  const defaults = defaultValues[env] || defaultValues.development;
  
  let content = `# Keeviqo ${env} environment configuration\n\n`;
  
  for (const variable of required) {
    const defaultValue = defaults[variable] || '';
    content += `${variable}=${defaultValue}\n`;
  }
  
  fs.writeFileSync(targetPath, content);
  globalThis.console.log(`Created sample .env file at ${targetPath}`);
}

if (globalThis.process.argv[1] === fileURLToPath(import.meta.url)) {
  const env = globalThis.process.env.NODE_ENV || 'development';
  
  if (validateEnv(env)) {
    globalThis.console.log(`Environment validation successful for ${env} environment.`);
  } else {
    globalThis.console.error(`Environment validation failed for ${env} environment.`);
    globalThis.process.exit(1);
  }
}

export default getConfig();
