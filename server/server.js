import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection configuration for Railway
const pool = new Pool({
  connectionString: "postgresql://postgres:pcQliBXpOVNtOgVjokTyijOqOTIrRkUT@metro.proxy.rlwy.net:43516/railway",
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Alternative configuration if using individual env vars
// const pool = new Pool({
//   host: process.env.PGHOST,
//   port: process.env.PGPORT || 5432,
//   database: process.env.PGDATABASE,
//   user: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
// });

// Database initialization
const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log('Connected to PostgreSQL successfully!');
    console.log(`Database: ${process.env.PGDATABASE || 'Railway PostgreSQL'}`);

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
      console.log('Sample clothing data inserted');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
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
  
  // Simple fit logic
  const fits = ['Perfect', 'Good', 'Loose'];
  return fits[Math.floor(Math.random() * fits.length)];
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE token = $1', [token]);
    if (result.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({ success: false, message: 'Invalid token' });
  }
};

// Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.json({ success: false, message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const token = uuidv4();
    
    // Create user
    await pool.query(
      'INSERT INTO users (id, username, email, password, token) VALUES ($1, $2, $3, $4, $5)',
      [userId, username, email, hashedPassword, token]
    );
    
    res.json({
      success: true,
      token: token,
      user: { id: userId, username, email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
    
    res.json({
      success: true,
      token: user.token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Measurements routes
app.post('/api/measurements', authenticateToken, async (req, res) => {
  try {
    const { chest, waist, hips, shoulders, neck, sleeve_length, inseam } = req.body;
    const measurementId = uuidv4();
    
    await pool.query(
      `INSERT INTO measurements (id, user_id, chest, waist, hips, shoulders, neck, sleeve_length, inseam) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [measurementId, req.user.id, chest, waist, hips, shoulders, neck, sleeve_length, inseam]
    );
    
    const result = await pool.query('SELECT * FROM measurements WHERE id = $1', [measurementId]);
    
    res.json({ success: true, measurement: result.rows[0] });
  } catch (error) {
    console.error('Measurements save error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/measurements', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM measurements WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    
    res.json({ success: true, measurements: result.rows });
  } catch (error) {
    console.error('Measurements fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Recommendations route
app.post('/api/recommendations', authenticateToken, async (req, res) => {
  try {
    const measurements = req.body;
    
    const result = await pool.query('SELECT * FROM clothing');
    const clothingData = result.rows;
    
    const recommendedSize = calculateSize(measurements);
    
    // Generate recommendations with fit information
    const recommendations = clothingData.map(item => ({
      ...item,
      recommendedSize,
      fit: getFitRating(recommendedSize, item.sizes)
    }));
    
    res.json({ success: true, recommendations });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all clothing items
app.get('/api/clothing', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clothing ORDER BY name');
    res.json({ success: true, clothing: result.rows });
  } catch (error) {
    console.error('Clothing fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ success: true, message: 'Server and database are running' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Database connection error' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Connected to Railway PostgreSQL database');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();