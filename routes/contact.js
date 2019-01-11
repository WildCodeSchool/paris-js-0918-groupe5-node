const express = require('express');
const models = require('../models');

const router = express.Router();

router.route('/')
  .post((req, res) => {
    const newContact = {
      ...req.body,
    };
    const { selectedReceiverId } = req.caregiver;
    models.Contact.create(newContact)
    .then((contact) => {
      models.User.findByPk(selectedReceiverId).then((receiver) => {
        receiver.addContact(contact)
          .then(() => {
            res.status(200).json(contact);
          });
      });
    });
  })
  .get((req, res) => {
    const { selectedReceiverId } = req.caregiver;
    models.User.findByPk(selectedReceiverId)
      .then((receiver) => {
        receiver.getContacts()
          .then((contacts) => {
            res.status(200).json(contacts);
          });
      });
  });

// router.get('/:x', (req,res) => {
// models.users.findAll({
// where : {
// firstname : req.params.x
// }
// }).then(data  => {
// res.status(200).json(data)
// })
// })

// router.post('/', (req, res) => {
//   const data = req.body;
//   console.log("Ajout d'un contact");
//   const newContact = new models.Contact(data);
//   newContact.save()
//     .then((contact) => {
//       // when we received a newContact, we send back a JSON to the client
//       res.status(200).json(contact);
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

// router.put('/:id(\\d+)', (req,res) => {
// models.users.findById(req.params.id)
// .then(userFound => {
// if(userFound){
// const data = req.body;
// models.users.update(
// data,
// { where : { id : req.params.id } }
// )
// .then(
// updatedUser => {
// res.status(200).send(`user update at id ${req.params.id}`)
// })
// }
// else {
// return res.status(404).send("User no exist")
// }
// })
// })

module.exports = router;
