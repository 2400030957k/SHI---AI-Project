// netlify/functions/recommendations.js
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

// Helper functions
const calculateSize = (measurements) => {
  const { chest, waist } = measurements;
  
  if (chest < 85 && waist < 70) return 'XS';
  if (chest < 90 && waist < 75) return 'S';
  if (chest < 95 && waist < 80) return 'M';
  if (chest < 100 && waist < 85) return 'L';
  if (chest < 105 && waist < 90) return 'XL';
  return 'XXL';
};

const getFitRating = (recommendedSize, availableSizes) => {
  const sizeIndex = availableSizes.indexOf(recommendedSize);
  if (sizeIndex === -1) return 'Good';
  
  const fits = ['Perfect', 'Good', 'Loose'];
  return fits[Math.floor(Math.random() * fits.length)];
};

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

    if (httpMethod === 'POST') {
      const measurements = body;
      
      // Get all clothing items
      const result = await pool.query('SELECT * FROM clothing');
      const clothingData = result.rows;
      
      const recommendedSize = calculateSize(measurements);
      
      // Generate recommendations with fit information
      const recommendations = clothingData.map(item => ({
        ...item,
        recommendedSize,
        fit: getFitRating(recommendedSize, item.sizes)
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, recommendations })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };

  } catch (error) {
    console.error('Recommendations function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Server error' })
    };
  }
};