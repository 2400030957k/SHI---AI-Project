// netlify/functions/auth.js
import bcrypt from 'bcrypt';
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

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const path = event.path.replace('/.netlify/functions/auth', '');
    const { httpMethod } = event;
    const body = event.body ? JSON.parse(event.body) : {};

    // Register endpoint
    if (path === '/register' && httpMethod === 'POST') {
      const { username, email, password } = body;
      
      if (!username || !email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, message: 'Missing required fields' })
        };
      }

      // Check if user already exists
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: false, message: 'User already exists' })
        };
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      const token = uuidv4();

      await pool.query(
        'INSERT INTO users (id, username, email, password, token) VALUES ($1, $2, $3, $4, $5)',
        [userId, username, email, hashedPassword, token]
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          token,
          user: { id: userId, username, email }
        })
      };
    }

    // Login endpoint
    if (path === '/login' && httpMethod === 'POST') {
      const { email, password } = body;

      if (!email || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, message: 'Missing email or password' })
        };
      }

      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user || !await bcrypt.compare(password, user.password)) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: false, message: 'Invalid credentials' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          token: user.token,
          user: { id: user.id, username: user.username, email: user.email }
        })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: 'Not Found' })
    };

  } catch (error) {
    console.error('Auth function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Server error' })
    };
  }
};