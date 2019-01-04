const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', (req,res) => {
	models.event.findAll()
	.then(data => {
		res.status(200).json(data)
	});
});

router.post('/', (req,res) => {
	const data = req.body;
	console.log(req)
	console.log(`Ajout de ${data}`);
	const newEvent = new models.event(data);
	newEvent.save()
		.then(newEvent => {
			// when we received a newContact, we send back a JSON to the client
			res.status(200).json(newEvent)
        })
        .catch(err => {
			console.log(err.message);
        });
});

module.exports = router;