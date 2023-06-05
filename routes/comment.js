const express = require('express');

const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/:id', auth, commentCtrl.getAllComments);
router.post('/', auth, commentCtrl.createComment);
router.delete('/:id', auth, commentCtrl.removeComment);


module.exports = router;