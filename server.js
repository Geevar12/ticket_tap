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

app.get('/api/movies', getMovies);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});