const express = require('express');
const app = express();
const mongoose = require('mongoose').default;
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');

const jwtSecret = 'gsdkjgjherkdjgkjrdfhgkljsdjgkldfjglsdg';
app.use(express.json());
mongoose.connect('mongodb+srv://test:test@cluster0.kupblld.mongodb.net/?retryWrites=true&w=majority')
    .then(console.log('Baza danych działa.'));


app
    .use(cors({
        credentials: true, origin: 'http://localhost:3000'}
    ))
    .post('/register', async (req, res) => {
        const {username, password} = req.body;
        try {
            const userDoc = await User.create({
                username,
                password: bcrypt.hashSync(password, salt),
            });
            res.json(userDoc);
        } catch (e) {
            res.status(400).json(e);
        }
    })
    .post('/login', async (req, res) => {
        const {username, password} = req.body;
        const userDoc = await User.findOne({username});
        const pass = bcrypt.compareSync(password, userDoc.password);
        if (pass) {
            jwt.sign({username, id: userDoc._id}, jwtSecret, {}, (e, token) => {
                if (e) throw e;
                res.cookie('token', token).json('ok');
            });
        } else {
            res.status(400).json('Niepoprawny login lub hasło.')
        }

    })

    .listen('3001', () => {
        console.log('Backend działa.');
    });