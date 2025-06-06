import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb://localhost:27017'; // Update if your MongoDB URI is different

async function getMovies(req, res) {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('tickettap');
        const movies = await db.collection('movies').find({}).toArray();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    } finally {
        await client.close();
    }
}

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('tickettap');
        // Check if user already exists
        const existing = await db.collection('users').findOne({ email });
        if (existing) {
            return res.status(409).json({ error: 'User already exists' });
        }
        // Store user (password is stored as plain text for demo; hash in production)
        await db.collection('users').insertOne({ email, password });
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(500).json({ error: 'Signup failed' });
    } finally {
        await client.close();
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('tickettap');
        const user = await db.collection('users').findOne({ email, password });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    } finally {
        await client.close();
    }
});

// Delete movie endpoint
app.delete('/api/movies/:id', async (req, res) => {
    const { id } = req.params;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('tickettap');
        const result = await db.collection('movies').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
            res.status(200).json({ message: 'Movie deleted' });
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete movie' });
    } finally {
        await client.close();
    }
});

// Book seats endpoint
app.patch('/api/movies/:id/book-seats', async (req, res) => {
    const { id } = req.params;
    const { seats } = req.body;
    if (!Array.isArray(seats) || seats.length === 0) {
        return res.status(400).json({ error: 'No seats provided' });
    }
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('tickettap');
        const movies = db.collection('movies');
        // Find the movie
        const movie = await movies.findOne({ _id: new ObjectId(id) });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        // Prepare new arrays
        const availableSeats = Array.isArray(movie.availableSeats) ? movie.availableSeats : [];
        const bookedSeats = Array.isArray(movie.bookedSeats) ? movie.bookedSeats : [];
        // Only book seats that are actually available
        const seatsToBook = seats.filter(seat => availableSeats.includes(seat) && !bookedSeats.includes(seat));
        if (seatsToBook.length === 0) {
            return res.status(400).json({ error: 'No valid seats to book' });
        }
        // Update arrays
        const newAvailableSeats = availableSeats.filter(seat => !seatsToBook.includes(seat));
        const newBookedSeats = [...bookedSeats, ...seatsToBook];
        // Update in DB
        await movies.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    availableSeats: newAvailableSeats,
                    bookedSeats: newBookedSeats
                }
            }
        );
        res.status(200).json({ message: 'Seats booked', bookedSeats: newBookedSeats, availableSeats: newAvailableSeats });
    } catch (err) {
        res.status(500).json({ error: 'Failed to book seats' });
    } finally {
        await client.close();
    }
});

// Add new movie
app.post('/api/movies', async (req, res) => {
    const movie = req.body;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('tickettap');
        const result = await db.collection('movies').insertOne(movie);
        res.status(201).json({ message: 'Movie added', id: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add movie' });
    } finally {
        await client.close();
    }
});

// Update movie
app.put('/api/movies/:id', async (req, res) => {
    const { id } = req.params;
    const movie = req.body;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('tickettap');
        await db.collection('movies').updateOne(
            { _id: new ObjectId(id) },
            { $set: movie }
        );
        res.status(200).json({ message: 'Movie updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update movie' });
    } finally {
        await client.close();
    }
});

// Store a booking
app.post('/api/bookings', async (req, res) => {
    const booking = req.body;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('tickettap');
        await db.collection('bookings').insertOne(booking);
        res.status(201).json({ message: 'Booking saved' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save booking' });
    } finally {
        await client.close();
    }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('tickettap');
        const bookings = await db.collection('bookings').find({}).toArray();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    } finally {
        await client.close();
    }
});

// Cancel a booking and update seats in movies collection
app.post('/api/bookings/cancel', async (req, res) => {
    const { bookingId, movieId, seats } = req.body;
    if (!bookingId || !movieId || !Array.isArray(seats) || seats.length === 0) {
        return res.status(400).json({ error: 'Invalid cancellation request' });
    }
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('tickettap');
        // 1. Mark booking as cancelled
        await db.collection('bookings').updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: { status: 'cancelled' } }
        );
        // 2. Move seats from bookedSeats to availableSeats in movies collection
        const movie = await db.collection('movies').findOne({ _id: new ObjectId(movieId) });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        const bookedSeats = Array.isArray(movie.bookedSeats) ? movie.bookedSeats : [];
        const availableSeats = Array.isArray(movie.availableSeats) ? movie.availableSeats : [];
        const newBookedSeats = bookedSeats.filter(seat => !seats.includes(seat));
        const newAvailableSeats = [...availableSeats, ...seats.filter(seat => !availableSeats.includes(seat))];
        await db.collection('movies').updateOne(
            { _id: new ObjectId(movieId) },
            {
                $set: {
                    bookedSeats: newBookedSeats,
                    availableSeats: newAvailableSeats
                }
            }
        );
        res.status(200).json({ message: 'Booking cancelled and seats updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to cancel booking' });
    } finally {
        await client.close();
    }
});

app.get('/api/movies', getMovies);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});