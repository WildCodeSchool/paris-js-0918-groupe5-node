const express = require('express');
const router = express.Router();
const models = require('../models');

router.post('/', (req,res) => {
	const data = req.body;
	console.log(`Ajout de ${data}`);
	console.log(req.body)
	const newUser = new models.user(data);
	newUser.save()
		.then(newUser => {
			// when we received a newContact, we send back a JSON to the client
			res.status(200).json(newUser)
        })
        .catch(err => {
			res.send(err.message)
			console.log(err.message);
        });
});

router.get('/all', (req,res) => {
	models.user.findAll()
	.then(data => {
		res.status(200).json(data)
	});
});


module.exports = router;
