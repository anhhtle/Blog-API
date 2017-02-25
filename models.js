const uuid = require('uuid');

// This module provides volatile storage, using a `BlogPost`
// model. We haven't learned about databases yet, so for now
// we're using in-memory storage. This means each time the app stops, our storage
// gets erased.

// Don't worry too much about how BlogPost is implemented.
// Our concern in this example is with how the API layer
// is implemented, and getting it to use an existing model.


function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

const BlogPosts = {
  create: function(author, title, content, publishDate) {
    const post = {
      author: author,
      title: title,
      content: content,
      publishDate: publishDate || Date(),
      id: uuid.v4()
    };
    this.posts.push(post);
    return post;
  },
  get: function(id=null) {
    // if id passed in, retrieve single post,
    // otherwise send all posts.
    if (id !== null) {
        console.log(`getting post ${id}`);
        return this.posts.find(post => post.id === id);
    }
    // return posts sorted (descending) by
    // publish date
    console.log(`getting all posts`);
    return this.posts.sort(function(a, b) {
        return b.publishDate - a.publishDate
    });
  },
  delete: function(id) {
    const postIndex = this.posts.findIndex(post => post.id === id);
    let message;
    let status;
    if (postIndex === -1){
        message = `invalid ID, can't delete`;
        status = 400;
        console.error(message);
        return [status, message];
    }
    this.posts.splice(postIndex, 1);
    message = `deleted post ${id}`
    status = 200;
    console.log(message);
    return [status, message];
  },
  update: function(updatedPost) {
    const {id} = updatedPost;
    const postIndex = this.posts.findIndex(
      post => post.id === updatedPost.id);
    if (postIndex === -1) {
        console.log(`Can't update item \`${id}\` because doesn't exist.`);
        throw StorageException(`Can't update item \`${id}\` because doesn't exist.`);
    }
    this.posts[postIndex] = Object.assign(
      this.posts[postIndex], updatedPost);
    return this.posts[postIndex];
  }
};

function createBlogPostsModel() {
  const storage = Object.create(BlogPosts);
  storage.posts = [];
  return storage;
}

module.exports = {blogPosts: createBlogPostsModel()}