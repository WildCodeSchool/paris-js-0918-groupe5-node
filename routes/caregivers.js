const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', (req, res) => {
    models.user.findAll()
    .then(data => {
        res.status(200).json(data)
    });
})

router.post('/', (req,res) => {
    const data = req.body;
    const newCaregivers = new models.user(data);
    newCaregivers.save()
        .then(newCargivers => {
            res.status(200).json(newCargivers)
        })
        .catch(err => {
            console.log(err.message);
        });
})

module.exports = router; 