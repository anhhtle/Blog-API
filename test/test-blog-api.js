const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);


describe('BlogPosts test', function(){

    before(function(){
        runServer();
    });

    after(function(){
        closeServer();
    });

    //*******GET***********/
    it('should return posts on GET', function(){
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.length.should.be.at.least(1);

            const requiredKeys = ['author', 'title', 'content', 'id'];
            res.body.forEach(item => {
                item.should.be.a('object');
                item.should.include.keys(requiredKeys);
            });
        }); // end then
    }) // end GET

    //*********POST***************/
    it('should create new item on POST', function(){

        // test good input
        const newItem = {
            author: 'test author',
            title: 'test title',
            content: 'test content', 
        };

        return chai.request(app)
        .post('/blog-posts')
        .send(newItem)
        .then(function(res){
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');

            newItem.id = res.body.id;
            newItem.publishDate = res.body.publishDate;
            res.body.should.deep.equal(newItem);
        });

        //test bad input
       /* const badItem = {
            author: 'test author',
        }

        return chai.request(app)
        .post('/blog-posts')
        .send(badItem)
        .then(function(res){
            res.should.have.status(400);
        });*/

    }); // end POST

    //*************PUT************/
    it('should update an item on PUT', function(){
        //update item
        const updateItem = {
            author: 'update author',
            title: 'update title',
            content: 'update content'
        };
        //get item id
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res){
            updateItem.id = res.body[0].id;
            return chai.request(app)
            .put(`/blog-posts/${updateItem.id}`)
            .send(updateItem);
        })
        .then(function(res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            updateItem.publishDate = res.body.publishDate;
            res.body.should.deep.equal(updateItem);
        });
    }); // end PUT

    //*************DELETE***********/
    it('should delete an item', function(){
        //get delete item's id
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res){
            return chai.request(app)
            .delete(`/blog-posts/${res.body[0].id}`);
        }) //return [status, message]
        .then(function(res){
            res.should.have.status(200);
        });

    }); // end DELETE


}); // end describe