const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const sessionRoutes = require('./routes/sessionRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const areaRoutes = require('./routes/areaRoutes');
const roomRoutes = require('./routes/roomRoutes');
const residenceRegistrationRoutes = require('./routes/residenceRegistrationRoutes');
const { initializeSessionCleanup } = require('./helpers/sessionCleanup');

const app = express();
const port = 3000;

app.get("/", (_, response) => {
    response.send("running");
});

app.use(express.json());
app.use(cookieParser());

app.use('/sessions', sessionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/residence-registrations', residenceRegistrationRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

initializeSessionCleanup();