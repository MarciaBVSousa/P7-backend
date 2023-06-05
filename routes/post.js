const express = require('express');

const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getUserPosts);
router.post('/', auth, multer, postCtrl.createPost);
router.delete('/:id', auth, postCtrl.removePost);
router.put('/:id', auth, postCtrl.updateSeenBy);

module.exports = router;