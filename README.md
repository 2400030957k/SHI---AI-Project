# AI-Based Clothing Measurement App

A full-stack web application that uses AI-powered computer vision to capture body measurements and provide personalized clothing recommendations.

## Features

### Frontend (React + TypeScript)
- **Homepage**: Beautiful landing page with call-to-action
- **Authentication**: User registration and login system
- **Camera Interface**: Simulated AI measurement capture with visual feedback
- **Dashboard**: User profile and measurement history
- **Recommendations**: Personalized clothing suggestions based on measurements
- **Responsive Design**: Optimized for mobile and desktop devices

### Backend (Node.js + Express)
- **RESTful API**: Complete API for authentication, measurements, and recommendations
- **Data Persistence**: JSON file-based storage for users, measurements, and clothing inventory
- **Authentication**: Token-based authentication system
- **Measurement Processing**: AI simulation for body measurement analysis
- **Recommendation Engine**: Size calculation and clothing matching algorithm

### Key Technologies
- **Frontend**: React, TypeScript, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express.js, bcrypt for password hashing
- **Camera**: MediaDevices API for camera access
- **Styling**: Modern glassmorphism design with gradients and animations

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser with camera access

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the backend server**:
   ```bash
   node server/server.js
   ```
   The server will run on `http://localhost:3001`

3. **Start the frontend development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Usage

1. **Register/Login**: Create a new account or sign in with existing credentials
2. **Take Measurements**: Click "Start Camera" to capture your body measurements using the AI simulator
3. **View Recommendations**: Get personalized clothing suggestions based on your measurements
4. **Dashboard**: Track your measurement history and view statistics

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Measurements
- `POST /api/measurements` - Save new measurements
- `GET /api/measurements` - Get user's measurement history

### Recommendations
- `POST /api/recommendations` - Get clothing recommendations based on measurements

### Health Check
- `GET /api/health` - Server health status

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── Camera.tsx
│   └── Recommendations.tsx
├── pages/
│   ├── Home.tsx
│   └── Dashboard.tsx
├── utils/
│   ├── api.ts
│   └── measurementSimulator.ts
└── App.tsx

server/
├── data/
│   ├── users.json
│   ├── measurements.json
│   └── clothing.json
└── server.js
```

## Features in Detail

### AI Measurement Simulation
The app simulates AI-powered body measurement capture using computer vision. In a production environment, this would integrate with actual AI/ML models for body measurement analysis.

### Personalized Recommendations
The recommendation engine analyzes your measurements to suggest perfectly fitting clothing items from a curated inventory of brands and styles.

### Responsive Design
The application features a modern, mobile-first design with glassmorphism effects, smooth animations, and intuitive user experience.

### Security
- Password hashing using bcrypt
- Token-based authentication
- Protected API routes
- Input validation and sanitization

## Future Enhancements

- **Real AI Integration**: Connect with actual computer vision APIs
- **3D/AR Visualization**: Display clothes on user's virtual avatar
- **Social Features**: Share measurements and recommendations
- **Shopping Integration**: Direct checkout with partner retailers
- **Mobile App**: Native iOS and Android applications
- **Advanced Analytics**: Detailed fit analysis and size predictions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.