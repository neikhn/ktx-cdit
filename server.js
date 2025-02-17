const express = require('express');
const sessionRoutes = require('./routes/sessionRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const sql = require('mssql');
const dbConfig = require('./dbConfig');
require('dotenv').config();

const app = express();
const port = 3000;

app.get("/", (request, response) => {
  response.send("running");
});

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use('/sessions', sessionRoutes);
app.use('/users', userRoutes);

app.listen(3000, () => {
  console.log(`SERVER RUNNING ON: ${port}`);
  console.log(`http://localhost:${port}`);
});
