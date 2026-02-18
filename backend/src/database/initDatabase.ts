import pool from '../config/database';

export const initDatabase = async (): Promise<void> => {
    try {
        // Create AI Tools table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS ai_tools (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                monthly_price VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ ai_tools table created/verified');

        // Create Allocations table
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS allocations (
                id VARCHAR(255) PRIMARY KEY,
                employee_id VARCHAR(255) NOT NULL,
                employee_name VARCHAR(255) NOT NULL,
                employee_email VARCHAR(255) NOT NULL,
                employee_department VARCHAR(255) NOT NULL,
                ai_tool_id VARCHAR(255) NOT NULL,
                ai_tool_name VARCHAR(255) NOT NULL,
                monthly_price VARCHAR(50) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                notes TEXT,
                status ENUM('pending_approval', 'approved', 'rejected') NOT NULL DEFAULT 'pending_approval',
                rejection_reason TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (ai_tool_id) REFERENCES ai_tools(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ allocations table created/verified');

        // Insert initial AI Tools data
        await pool.execute(`
            INSERT INTO ai_tools (id, name, monthly_price) VALUES
            ('1', 'ChatGPT Pro', '20'),
            ('2', 'Claude AI', '15'),
            ('3', 'GitHub Copilot', '10'),
            ('4', 'Midjourney', '30'),
            ('5', 'Jasper AI', '49'),
            ('6', 'Copy.ai', '36')
            ON DUPLICATE KEY UPDATE name=VALUES(name), monthly_price=VALUES(monthly_price)
        `);
        console.log('✅ Initial AI tools data inserted');

        console.log('✅ Database tables initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
};
