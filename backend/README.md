# Backend Server

Node.js and Express.js backend server with TypeScript and MySQL.

## Prerequisites

- Node.js
- MySQL Server installed and running

## Installation

```bash
npm install
```

## Database Setup

1. Make sure MySQL is running on your system
2. Create a `.env` file in the root directory (copy from `.env.example`):

```
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=rms_db
```

3. Update the database credentials in `.env` file

## Development

Run the development server with hot reload:

```bash
npm run dev
```

The server will automatically:
- Connect to MySQL database
- Create database and tables if they don't exist
- Insert initial AI tools data

## Build

Build the TypeScript code:

```bash
npm run build
```

## Production

Start the production server:

```bash
npm start
```

## Database Schema

The database will be automatically initialized with:
- `ai_tools` table - Stores AI tools information
- `allocations` table - Stores allocation requests

Initial AI tools data will be inserted automatically on first run.
