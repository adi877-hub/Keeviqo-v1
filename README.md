# Keeviqo Platform

Keeviqo is a comprehensive personal information management platform that helps users organize their life across 72 different categories.

## Features

- **72 Life Categories**: Comprehensive organization system for all aspects of life
- **Smart Features**: Each category includes specialized features like uploads, reminders, forms, and external links
- **RTL Support**: Full Hebrew language support with right-to-left text direction
- **Responsive Design**: Works on desktop and mobile devices
- **Secure Storage**: Safe storage for your important documents and information

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Internationalization**: i18next for multilingual support

## Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/adi877-hub/Keeviqo-v1.git
   cd Keeviqo-v1
   ```

2. Run the setup script:
   ```
   ./setup-keeviqo.sh
   ```

   This will:
   - Install all dependencies
   - Create a `.env` file if it doesn't exist
   - Set up the database schema
   - Seed the database with initial data

### Running the Application

```
./run-keeviqo.sh
```

This will start both the backend server and frontend development server.

## Project Structure

```
Keeviqo-v1/
├── client/             # Frontend code
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── utils/      # Utility functions
│   │   ├── locales/    # Internationalization files
│   │   └── ...
├── server/             # Backend code
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── ...
├── shared/             # Shared code between frontend and backend
│   └── schema.ts       # Database schema
├── drizzle/            # Database migrations
└── ...
```

## API Endpoints

- `/api/categories` - Get all categories
- `/api/categories/:id` - Get a specific category
- `/api/subcategories/:id` - Get a specific subcategory
- `/api/features/:id` - Get a specific feature
- `/api/uploads` - Upload documents
- `/api/reminders` - Manage reminders
- `/api/forms` - Submit and retrieve form data
