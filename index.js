const express = require('express');
const app = express();
const mongoose = require('mongoose').default;
const cors = require('cors');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const jwtSecret = 'gsdkjgjherkdjgkjrdfhgkljsdjgkldfjglsdg';
const multer = require('multer');
const fs = require("fs");
const upload = multer({dest: 'uploads/'});

mongoose.connect('mongodb+srv://test:test@cluster0.kupblld.mongodb.net/?retryWrites=true&w=majority')
    .then(console.log('Baza danych działa.'));


app
    .use(express.json())
    .use(cookieParser())
    .use(cors({
            credentials: true,
            origin: 'http://localhost:3000',
        }
    ))
    .use('/uploads', express.static(__dirname + '/uploads'))

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
                res.cookie('token', token).json({
                    id: userDoc._id,
                    username,
                });
            });
        } else {
            res.status(400).json('Niepoprawny login lub hasło.')
        }

    })
    .get('/account', (req, res) => {
        const {token} = req.cookies;
        jwt.verify(token, jwtSecret, {}, (e, info) => {
            if (e) throw e;
            res.json(info);
        })
    })
    .post('/logout', (req, res) => {
        res.cookie('token', '').json('ok');
    })
    .post('/post', upload.single('file'), async (req, res) => {
        const {originalname, path} = req.file;
        const part = originalname.split('.');
        const ext = part[part.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        const {title, content} = req.body;

        const post = await Post.create({
            title,
            content,
            cover: newPath,
        })

        res.json(post)


    })
    .get('/post', async (req, res) => {
        const post = await Post.find();
        res.json(post);
    })

    .get('/post/:id', async (req, res) => {
        const {id} = req.params;
        const findPost = await Post.findById(id);
        res.json(findPost);

    })


    .listen('3001', () => {
        console.log('Backend działa.');
    });



