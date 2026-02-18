import { createPool, Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'rms_db';

// Database configuration without database name (for initial connection)
const dbConfigWithoutDb = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

// Database configuration with database name
const dbConfig = {
    ...dbConfigWithoutDb,
    database: DB_NAME,
};

// Create connection pool
export const pool: Pool = createPool(dbConfig);

// Create database if it doesn't exist
export const createDatabaseIfNotExists = async (): Promise<void> => {
    try {
        // Connect without specifying database
        const tempPool = createPool(dbConfigWithoutDb);
        await tempPool.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
        await tempPool.end();
        console.log(`✅ Database '${DB_NAME}' ready`);
    } catch (error) {
        console.error('❌ Failed to create database:', error);
        throw error;
    }
};

// Test database connection
export const testConnection = async (): Promise<void> => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
};

export default pool;
