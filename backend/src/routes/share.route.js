const express = require('express');
const router = express.Router();

//const receive = require("../controllers/post/receive.controller")
const createShareFood = require("../controllers/share/createShare.controller")
//const updatePost = require("../controllers/post/updatePost.controller")
//const deletePost = require("../controllers/post/deletePost.controller")

router.post('/:userId/:foodId', createShareFood);
//router.post('/:userId', createPost);
//router.put('/:userId/:postId', updatePost);
//router.delete('/:userId/:postId', deletePost);

module.exports = router;