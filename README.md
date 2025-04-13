# StreamStep - Video Progress Tracker

A MERN stack application that accurately tracks and stores a user's real progress while watching videos, ensuring unique segment tracking and progress persistence.

## Features

- Real-time video progress tracking
- Unique segment detection (no double-counting)
- Progress persistence across sessions
- User authentication
- Resume from last unwatched position
- Clean and intuitive UI

## Technical Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Project Structure

```
streamstep/
├── client/                 # React frontend
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── utils/              # Utility functions
└── README.md
```

## Core Logic

### Progress Tracking
- Tracks video watching intervals (start and end times)
- Merges overlapping or adjacent intervals
- Calculates unique watched segments
- Converts to percentage based on total video length

### Data Structure
```javascript
{
  userId: String,
  videoId: String,
  watchedIntervals: [
    {
      start: Number,  // timestamp in seconds
      end: Number     // timestamp in seconds
    }
  ],
  lastWatchedTime: Number,
  progress: Number    // percentage (0-100)
}
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create `.env` file in server directory
   - Add MongoDB connection string and JWT secret

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend development server
   cd client
   npm start
   ```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/progress/:videoId` - Get video progress
- `POST /api/progress/:videoId` - Update video progress
- `GET /api/progress` - Get all user progress

## Progress Calculation Logic

1. **Interval Tracking**:
   - Record start and end times of watched segments
   - Store intervals in chronological order

2. **Interval Merging**:
   - Sort intervals by start time
   - Merge overlapping or adjacent intervals
   - Remove duplicate segments

3. **Progress Calculation**:
   - Sum total unique seconds watched
   - Divide by total video length
   - Multiply by 100 for percentage

## License

MIT 