import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));



console.log("MONGO_URI loaded:", process.env.MONGO_URI);
console.log("PORT loaded:", process.env.PORT);



// Connect to DB

mongoose.connect(process.env.MONGO_URI)

const CONNECTION = mongoose.connection
CONNECTION.on('error', console.error.bind(console, 'MongoDB connection error: \n'))
CONNECTION.once('open', () => {
  console.log('MongoDB database connection established successfully')
})


// Test route - to make sure server is running

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Routes

// V1 routes
import routes from './routes/v1/routes.js'

app.use('/api/v1', routes)



// Start server

app.listen(process.env.PORT || 3000)
console.log(`Server running at http://localhost:${process.env.PORT}/`)
