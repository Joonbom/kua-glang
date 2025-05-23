const express = require('express');
const router = express.Router();

const createShareFood = require("../controllers/share/createShare.controller")
const deleteShare = require("../controllers/share/deleteShare.controller")
const updateShare = require("../controllers/share/updateShare.controller")
const  getShareInterest  = require("../controllers/share/interestedShare.controller");

router.get('/:shareId/interest/:userId', getShareInterest);
router.post('/:userId/:foodId', createShareFood);
router.delete('/:shareId', deleteShare);
router.put('/:userId/:foodId/:shareId', updateShare);


module.exports = router;