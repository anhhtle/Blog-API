// require
const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(morgan('common'));

const blogRouter = require('./blogRouter');
//API

app.get('/', (req, res) => {
    res.status(200).send('a ok');
});

app.use('/blog-posts', blogRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log(`your app is listening on port ${process.env.PORT || 8080}`);
});