const express = require('express');
const router = express.Router();

const {
  receive,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/post/post.controller');

router.post('/receive/:userId', receive);
router.post('/:userId', createPost);
router.put('/:userId/:postId', updatePost);
router.delete('/:userId/:postId', deletePost);

module.exports = router;
