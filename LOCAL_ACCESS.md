# Keeviqo Platform - Local Access Guide

## Overview
This guide provides instructions for accessing and testing the Keeviqo platform locally. The platform includes all 72 categories with their smart features, advanced intelligent features, and comprehensive user management capabilities.

## Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- PostgreSQL database (optional for full functionality)

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/adi877-hub/Keeviqo-v1.git
cd Keeviqo-v1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Copy the example environment file and update it with your settings:
```bash
cp .env.example .env
```

### 4. Start the Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

### 6. Start the Production Server
```bash
node dist/index.js
```

## Accessing the Platform

### Local Access
The platform will be available at:
- Development: http://localhost:5173
- Production: http://localhost:3000

### Default Login Credentials
- Username: admin
- Password: Keeviqo2023!

## Advanced Features

The Keeviqo platform includes the following advanced intelligent features:

### 1. KeeviAI - Intelligent Personal Assistant
- Proactively recognizes user intent before they type
- Provides smart suggestions based on context
- Assists with form completion and document organization

### 2. KeeviMap - Interactive Life Map
- Visually connects all life areas (health, finances, education, etc.)
- Provides smart navigation with links and alerts
- Displays a comprehensive personal life dashboard

### 3. Intuition Layer
- Identifies missing documents or information
- Prompts users about incomplete tasks or submissions
- Suggests relevant actions based on context

### 4. Declutter Mode
- Suggests documents to archive, delete, or update
- Helps avoid data overload with smart organization
- Identifies potential duplicates and unnecessary files

### 5. Real-Time Conversation Logger
- Documents phone calls and meetings
- Auto-generates summaries from recordings or notes
- Categorizes conversations for easy retrieval

### 6. KeeviShare - Secure Selective Sharing
- Allows sharing specific categories or documents
- Provides granular access control for shared content
- Maintains privacy while enabling collaboration

### 7. Smart Recommendations
- Generates suggestions based on user profile
- Identifies potential grants, forms, and actions
- Provides personalized insights and reminders

### 8. Double Notification System
- Sends alerts via both email and WhatsApp
- Provides personalized notification text
- Includes quiet hours and category filtering

## Troubleshooting

### Common Issues

#### Database Connection Errors
Ensure your PostgreSQL database is running and the connection string in `.env` is correct:
```
DATABASE_URL=postgresql://username:password@localhost:5432/keeviqo
```

#### Missing Dependencies
If you encounter missing dependency errors, try:
```bash
npm install --force
```

#### Port Already in Use
If port 3000 is already in use, you can change it in the `.env` file:
```
PORT=3001
```

## Support

For additional support, please contact:
- Email: support@keeviqo.com
- GitHub Issues: https://github.com/adi877-hub/Keeviqo-v1/issues
