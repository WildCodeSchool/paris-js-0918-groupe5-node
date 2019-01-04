const express = require('express');
const router = express.Router();
const models = require('../models');


router.post('/', (req,res) => {
	const data = req.body;
	console.log("Ajout d'un user");
	const NewUser = new models.user(data);
	NewUser.save()
		.then(NewUser => {
			// when we received a NewUser, we send back a JSON to the client
			res.status(200).json(NewUser)
        })
        .catch(err => {
           console.log(err.message);
        }); //ERREUR A REVOIR
});

module.exports = router;