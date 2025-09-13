// netlify/functions/init-db.js
import { v4 as uuidv4 } from 'uuid';
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:pcQliBXpOVNtOgVjokTyijOqOTIrRkUT@metro.proxy.rlwy.net:43516/railway",
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  const client = await pool.connect();
  try {
    console.log('Initializing database...');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        token UUID NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create measurements table
    await client.query(`
      CREATE TABLE IF NOT EXISTS measurements (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        chest DECIMAL(5,2),
        waist DECIMAL(5,2),
        hips DECIMAL(5,2),
        shoulders DECIMAL(5,2),
        neck DECIMAL(5,2),
        sleeve_length DECIMAL(5,2),
        inseam DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create clothing table
    await client.query(`
      CREATE TABLE IF NOT EXISTS clothing (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image VARCHAR(500),
        rating DECIMAL(2,1),
        brand VARCHAR(255),
        sizes TEXT[] NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if clothing table has data, if not, insert sample data
    const clothingCount = await client.query('SELECT COUNT(*) FROM clothing');
    if (parseInt(clothingCount.rows[0].count) === 0) {
      const clothingData = [
        {
          id: uuidv4(),
          name: 'Classic Cotton T-Shirt',
          category: 'T-Shirts',
          price: 29.99,
          image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.5,
          brand: 'ComfortWear',
          sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        },
        {
          id: uuidv4(),
          name: 'Slim Fit Jeans',
          category: 'Jeans',
          price: 89.99,
          image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.7,
          brand: 'DenimCo',
          sizes: ['28', '30', '32', '34', '36', '38']
        },
        {
          id: uuidv4(),
          name: 'Business Casual Shirt',
          category: 'Shirts',
          price: 59.99,
          image: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.3,
          brand: 'ProStyle',
          sizes: ['S', 'M', 'L', 'XL', 'XXL']
        },
        {
          id: uuidv4(),
          name: 'Casual Hoodie',
          category: 'Hoodies',
          price: 49.99,
          image: 'https://images.pexels.com/photos/4066043/pexels-photo-4066043.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.6,
          brand: 'StreetWear',
          sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
        },
        {
          id: uuidv4(),
          name: 'Summer Dress',
          category: 'Dresses',
          price: 79.99,
          image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.8,
          brand: 'ElegantStyle',
          sizes: ['XS', 'S', 'M', 'L', 'XL']
        },
        {
          id: uuidv4(),
          name: 'Athletic Shorts',
          category: 'Shorts',
          price: 34.99,
          image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
          rating: 4.4,
          brand: 'SportsFit',
          sizes: ['S', 'M', 'L', 'XL', 'XXL']
        }
      ];

      for (const item of clothingData) {
        await client.query(
          'INSERT INTO clothing (id, name, category, price, image, rating, brand, sizes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [item.id, item.name, item.category, item.price, item.image, item.rating, item.brand, item.sizes]
        );
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Database initialized successfully',
        tablesCreated: ['users', 'measurements', 'clothing'],
        sampleDataInserted: parseInt(clothingCount.rows[0].count) === 0
      })
    };

  } catch (error) {
    console.error('Database initialization error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Database initialization failed',
        error: error.message 
      })
    };
  } finally {
    client.release();
  }
};