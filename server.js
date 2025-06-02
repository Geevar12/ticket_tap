import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const uri = 'mongodb://localhost:27017'; // Update if your MongoDB URI is different
const client = new MongoClient(uri);

async function getMovies(req, res) {
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

app.get('/api/movies', getMovies);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});