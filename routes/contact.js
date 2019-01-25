const express = require('express');
const models = require('../models');
const properNoun = require('../helpers/properNoun');

const router = express.Router();

router.route('/')

  .get((req, res) => { // get the active contacts of the selected receiver
    const { selectedReceiverId } = req.caregiver;
    models.User.findByPk(selectedReceiverId)
      .then((receiver) => {
        receiver.getContacts({
          where: {
            status: true,
          },
        })
          .then((contacts) => {
            res.status(200).json(contacts);
          });
      });
  })

  .post((req, res) => { // create a new contact linked to the selected receiver
    const newContact = { // we set the first letter of firstName and lastName into uppercases
      ...req.body,
      firstName: properNoun(req.body.firstName),
      lastName: properNoun(req.body.lastName),
    };

    const { selectedReceiverId } = req.caregiver; // we get the id of the caregiver connected
    models.Contact.create(newContact) // we create a new contact
    .then((contact) => {
      models.User.findByPk(selectedReceiverId) // we get the receiver with the caregiver table
      .then((receiver) => {
        receiver.addContact(contact) // we link the contact's receiver to the caregiver connectd
          .then(() => {
            res.status(200).json(contact);
          });
      });
    });
  });

router.route('/:idContact')
  .put((req, res) => { // update a contact
    const { idContact } = req.params;

    const updatedContact = { // we set the first letter of firstName and lastName into uppercases
      ...req.body,
      firstName: properNoun(req.body.firstName),
      lastName: properNoun(req.body.lastName),
    };

    models.Contact.findByPk(idContact)
    .then((contact) => {
      contact.update({
        ...updatedContact,
      }).then(() => {
        res.status(200).json(contact);
      });
    });
  })

  .delete((req, res) => { // delete a contact (change his status to false)
    const { idContact } = req.params;
    models.Contact.findByPk(idContact)
    .then((contact) => {
      contact.update({
        status: false,
      }).then(() => {
        res.sendStatus(200);
      });
    });
  });

module.exports = router;
