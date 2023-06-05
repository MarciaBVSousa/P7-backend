const express = require('express');

const profileCtrl = require('../controllers/profile');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

router.get('/:id', auth, profileCtrl.getProfile);
router.put('/:id', auth, multer, profileCtrl.modifyProfile);
router.delete('/:id', auth, profileCtrl.removeProfile);

module.exports = router;