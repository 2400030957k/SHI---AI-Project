// netlify/functions/clothing.js
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:pcQliBXpOVNtOgVjokTyijOqOTIrRkUT@metro.proxy.rlwy.net:43516/railway",
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { httpMethod } = event;

    if (httpMethod === 'GET') {
      const result = await pool.query('SELECT * FROM clothing ORDER BY name');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, clothing: result.rows })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };

  } catch (error) {
    console.error('Clothing function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Server error' })
    };
  }
};