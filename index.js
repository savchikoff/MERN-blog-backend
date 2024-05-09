import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

dotenv.config();


import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation } from './validations.js';
import { UserController, PostController, CommentController } from './controllers/index.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

mongoose.connect(process.env.MONGODB_ADDRESS)
    .then(() => console.log('DB ok'))
    .catch((error) => console.log('DB error', error))

const app = express();

const storage = multer.diskStorage(
    {
        destination: (_, __, cb) => {
            if (!fs.existsSync('uploads')) {
                fs.mkdirSync('uploads');
            }
            cb(null, 'uploads');
        },
        filename: (_, file, cb) => {
            cb(null, file.originalname);
        }
    }
);

const upload = multer({ storage });

app.use(express.json());
app.use(express.static('public'))
app.use(cors());
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
})

app.get('/about', (req, res) => {
    res.json({
        message: "Про меня!"
    })
})

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});

app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);

app.get('/posts/:id', PostController.getOne);
app.get('/posts/withTags/:tag', PostController.getPostsWithTag);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.post('/comments', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.addComment);
app.get('/comments', CommentController.getAllComments);
app.get('/comments/:postId', CommentController.getCommentsByPostId)



app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK!');
});