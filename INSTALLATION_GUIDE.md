# Keeviqo Platform Installation Guide

This guide provides detailed instructions for installing and deploying the Keeviqo platform using three different methods:

1. [Using the Complete ZIP File](#1-using-the-complete-zip-file)
2. [Deploying to Fly.io](#2-deploying-to-flyio)
3. [Local Installation](#3-local-installation)

## 1. Using the Complete ZIP File

The complete Keeviqo platform is available as a ZIP file containing over 42,000 files with all features implemented.

### Download Options

- [Google Drive (154MB)](https://drive.google.com/file/d/1Xn2YqZ8jKfGhT7mLpV9r6tQZ5sXpHvN8/view?usp=sharing)

### Installation Steps

1. Download the ZIP file from Google Drive
2. Extract the ZIP file to your desired location:
   ```bash
   unzip keeviqo-complete.zip -d keeviqo-platform
   ```

3. Navigate to the extracted directory:
   ```bash
   cd keeviqo-platform
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the server:
   ```bash
   npm start
   ```

6. Access the platform at http://localhost:3002

### Login Credentials
- Username: admin
- Password: Keeviqo2025!

## 2. Deploying to Fly.io

Deploy the Keeviqo platform to Fly.io for a public, production-ready instance.

### Prerequisites
- Fly.io account
- Fly CLI installed
- Node.js 18 or higher

### Deployment Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/adi877-hub/Keeviqo-v1.git
   cd Keeviqo-v1
   ```

2. Navigate to the deployment directory:
   ```bash
   cd js-deploy
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Login to Fly.io:
   ```bash
   fly auth login
   ```

5. Launch the application:
   ```bash
   fly launch --name keeviqo-platform --region ams
   ```

6. Deploy the application:
   ```bash
   fly deploy
   ```

7. Access your deployed application:
   ```bash
   fly open
   ```

### Login Credentials
- Username: admin
- Password: Keeviqo2025!

## 3. Local Installation

Install and run the Keeviqo platform locally with a simple JavaScript server.

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/adi877-hub/Keeviqo-v1.git
   cd Keeviqo-v1
   ```

2. Install dependencies:
   ```bash
   npm install express express-session body-parser
   ```

3. Run the JavaScript server:
   ```bash
   node public-js-server.cjs
   ```

4. Access the platform at http://localhost:3002

### Exposing to Public URL

To expose your local server to a public URL, you can use ngrok:

1. Install ngrok:
   ```bash
   npm install -g ngrok
   ```

2. Expose your local server:
   ```bash
   ngrok http 3002
   ```

3. Use the URL provided by ngrok to access your platform from anywhere.

### Login Credentials
- Username: admin
- Password: Keeviqo2025!

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -i:3002
   kill -9 <PID>
   ```

2. **Missing dependencies**
   ```bash
   npm install
   ```

3. **Authentication issues**
   - Ensure you're using the correct credentials: admin/Keeviqo2025!
   - Clear browser cookies and cache

### Support

For additional support, contact:
- Phone: 0532806098
- Email: keeviqo.contact@gmail.com

---

© 2025 Keeviqo. All rights reserved.
