const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./database');
const notesRoutes = require('./routes/noteRoutes');
const Notes = require('./schema/Notes');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors({
 origin: 'https://frontend-notes-dot-g-43-491016.as.r.appspot.com',
 methods: ['GET', 'POST', 'PUT', 'DELETE'],
 allowedHeaders: ['Content-Type']
}))
app.use(express.json());
app.use(express.static('public'));

// Routes API
app.use('/api/notes', notesRoutes);

// Sync database dan jalankan server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Koneksi database berhasil.');
        
        await sequelize.sync({ alter: false });
        console.log('Database synchronized.');
        
        app.listen(port, () => {
            console.log(`Server berjalan pada http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Gagal terhubung ke database:', error);
        process.exit(1);
    }
};

startServer();
