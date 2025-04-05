// Enhanced server with subcategory navigation and improved UI
// Will add a shorter version focused on core functionality
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3002;

// Core functionality only - will expand in next iteration
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.json());

// Load categories and serve enhanced UI
// More details to follow in next command
