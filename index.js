'use strict';

const http = require('http');
const { MongoClient } = require('mongodb');

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGO_URL || process.env.DATABASE_URL;

let db = null;

async function connectToMongo() {
  if (!MONGODB_URL) {
    console.warn('No MongoDB connection URL provided. Set the MONGODB_URL environment variable.');
    return;
  }

  try {
    const client = new MongoClient(MONGODB_URL);
    await client.connect();
    db = client.db();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
  }
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    const status = { status: 'ok', mongo: db ? 'connected' : 'disconnected' };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ name: 'Zenith Team Task Manager', version: '1.0.0' }));
});

async function start() {
  await connectToMongo();

  server.listen(PORT, () => {
    console.log(`Zenith Team Task Manager listening on port ${PORT}`);
  });
}

start();
