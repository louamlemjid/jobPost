const { Client } = require('pg');
const dotenv=require('dotenv')
dotenv.config()
const config = {
  user: import .meta.env.VITE_ADMIN,
  password: import.meta.env.VITE_PASSWORD,
  host: import.meta.env.VITE_HOST,
  port: 12897,
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: true,
    ca: import.meta.env.VITE_AIVEN_SECRET,
  },
};

const client = new Client(config);

// Function to handle errors
client.on('error', (err) => {
  console.error('PostgreSQL client error:', err.message);
});

// Connect to the PostgreSQL server
client.connect()
  .then(() => console.log('Connected to the PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

export  {client}
