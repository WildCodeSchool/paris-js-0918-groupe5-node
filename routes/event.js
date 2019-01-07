const express = require('express');
const models = require('../models');


const router = express.Router();

router.get('/', (req, res) => {
	models.event.findAll()
		.then((data) => {
			res.status(200).json(data);
		});
});

router.post('/', (req, res) => {
	const data = req.body;
	console.log('data => ', req.body);
	// console.log(`Ajout de ${data}`);
	const newEvent = new models.event(data);
	newEvent.save()
		.then(() => {
			res.status(200).json(newEvent);
		})
		.catch((err) => {
			console.log(err.message);
		});
});

module.exports = router;
