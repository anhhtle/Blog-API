//require
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {blogPosts} = require('./models');

//starting blogs
const message = ("I'm not crying for myself. I'm cryin' for you." +
                " They say that great beasts once roamed this world." +
                " Big as mountains. Yet all that's left of them is bone and amber.");

blogPosts.create('Dolores', 'Westworld', message, 'Feb 25, 2017');

blogPosts.create('Anh Le', 'Joke', 'What do you call a deer with no eyes?... no idea!');

router.get('/', (req, res) => {
    res.status(200).json(blogPosts.get());
});

// use forEach and map... use validate(arr) function
router.post('/', jsonParser, (req, res) => {
    const requiredFields = ['author', 'title', 'content'];
    for (let i=0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    
    // edit: use obj destructuring
    const newBlog = blogPosts.create(
        req.body.author, req.body.title,req.body.content, req.body.publishDate || Date()
    );
    console.log('created new post');
    res.status(201).json(newBlog);
});

router.delete('/:id', (req, res) => {
    console.log(`attempting to delete ${req.params.id}`);
    const deletedPost = blogPosts.delete(req.params.id);
    res.status(deletedPost[0]).send(deletedPost[1]);
});

router.put('/:id', jsonParser, (req, res) => {
    const requiredFields = ['author', 'title', 'content', 'id'];
    for (let i = 0; i < requiredFields.length; i++){
        const field = requiredFields[i];
        if(!(field in req.body)){
            console.error(`Missing \`${field}\` in request body`);
            return res.status(400).send(`Missing \`${field}\` in request body`);
        }
    }
    if(req.params.id != req.body.id){
        console.log(`params id and request id don't match`);
        return res.status(400).send(`params id and request id don't match`);
    }

    //use obj destructuring
    const updatedPost = blogPosts.update({
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        publishDate: req.body.publishDate || Date(),
        id: req.body.id
    });
    console.log('updated post');
    res.status(200).json(updatedPost);
});

module.exports = router;