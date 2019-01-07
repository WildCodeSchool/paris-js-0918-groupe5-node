const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', (req,res) => {
	models.contact.findAll()
	.then(data => {
		res.status(200).json(data)
	});
});

// router.get('/:x', (req,res) => {
// 	models.users.findAll({
// 		where : {
// 			firstname : req.params.x
// 		}
// 	}).then(data  => {
// 		res.status(200).json(data)
// 	})
// }) 

router.post('/', (req,res) => {
	const data = req.body;
	console.log("Ajout d'un contact");
	const newContact = new models.contact(data);
	newContact.save()
		.then(newContact => {
			// when we received a newContact, we send back a JSON to the client
			res.status(200).json(newContact)
        })
        .catch(err => {
           console.log(err.message);
        });
});

router.delete('/:contactID', (req,res) => {
	const data = req.body;
	const contactID = req.params;
	console.log("Suppression d'un contact");
	const newContact = new models.contact(data);
	newContact.save()
		.then(newContact => {
			// when we received a newContact, we send back a JSON to the client
			res.status(200).json(newContact)
        })
        .catch(err => {
           console.log(err.message);
        });
});

// router.put('/:id(\\d+)', (req,res) => {
// 	models.users.findById(req.params.id)
// 	.then(userFound => {
// 		if(userFound){
// 			const data = req.body;
// 			models.users.update(
// 				data,
// 				{ where : { id : req.params.id } }
// 			)
// 			.then(
// 				updatedUser => {
// 					res.status(200).send(`user update at id ${req.params.id}`)
// 				})
// 		}
// 		else {
// 			return res.status(404).send("User no exist")
// 		}
// 	})
// })

module.exports = router;