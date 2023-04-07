const express = require('express');
const app = express();
const mongoose = require('mongoose').default;
const cors = require('cors');
const User = require('./models/User');

app.use(express.json());
mongoose.connect('mongodb+srv://test:test@cluster0.kupblld.mongodb.net/?retryWrites=true&w=majority')
    .then(console.log('Baza danych działa.'));


app
    .use(cors())
    .post('/register', async (req, res) => {
        const {username, password} = req.body;
        try {
            const userDoc = await User.create({
                username,
                password,
            });
            res.json(userDoc);
        } catch (e) {
            res.status(400).json(e);
        }
    })

    .listen('3001', () => {
        console.log('Backend działa.');
    });