const express = require('express');
const sessionRoutes = require('./routes/sessionRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const sql = require('mssql');
const dbConfig = require('./dbConfig');
require('dotenv').config();
const { initializeSessionCleanup } = require('./helpers/sessionCleanup');

const app = express();
const port = 3000;

app.get("/", (request, response) => {
    response.send("running");
});

app.use(express.json());
app.use(cookieParser());

app.use('/sessions', sessionRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

initializeSessionCleanup();