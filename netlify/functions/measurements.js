// netlify/functions/measurements.js
import { v4 as uuidv4 } from 'uuid';
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

// Authentication helper
const authenticateToken = async (token) => {
  if (!token) return null;
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE token = $1', [token]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { httpMethod } = event;
    const body = event.body ? JSON.parse(event.body) : {};
    
    // Get token from headers
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    const user = await authenticateToken(token);
    if (!user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, message: 'Access token required' })
      };
    }

    // Save measurements (POST)
    if (httpMethod === 'POST') {
      const { chest, waist, hips, shoulders, neck, sleeve_length, inseam } = body;
      const measurementId = uuidv4();

      await pool.query(
        `INSERT INTO measurements (id, user_id, chest, waist, hips, shoulders, neck, sleeve_length, inseam) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [measurementId, user.id, chest, waist, hips, shoulders, neck, sleeve_length, inseam]
      );

      const result = await pool.query('SELECT * FROM measurements WHERE id = $1', [measurementId]);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, measurement: result.rows[0] })
      };
    }

    // Get measurements (GET)
    if (httpMethod === 'GET') {
      const result = await pool.query(
        'SELECT * FROM measurements WHERE user_id = $1 ORDER BY created_at DESC',
        [user.id]
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, measurements: result.rows })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };

  } catch (error) {
    console.error('Measurements function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Server error' })
    };
  }
};