const express = require('express');
const models = require('../models');


const router = express.Router();

router.route('/:idContact')
  // create a new event linked to the selected receiver and a contact
  .post((req, res) => {
    const newEvent = {
      ...req.body,
    };
    const { idContact } = req.params;
    const { selectedReceiverId } = req.caregiver;
    // creation of a new event in the Event table
    models.Event.create(newEvent)
      .then((eventCreated) => {
        // we get the selected receiver
        models.User.findByPk(selectedReceiverId)
          .then((receiver) => {
            // link the event to the receiver
            receiver.addEvent(eventCreated)
              .then(() => {
                if (idContact !== 0) {
                models.Contact.findByPk(idContact).then((contact) => {
                  contact.addEvent(eventCreated).then(() => {
                    res.status(200).json(eventCreated);
                  });
                });
                } else {
                  res.status(200).json(eventCreated);
                }
              });
          });
      });
  })

router.route('/')
  // get the active events linked to the selected receiver
  .get((req, res) => {
    const { selectedReceiverId } = req.caregiver;
    models.User.findByPk(selectedReceiverId)
      .then((receiver) => {
        console.log(receiver.prototype);
        receiver.getEvents({ where: { status: true } })
          .then((events) => {
            res.status(200).json(events);
          });
      });
  });

module.exports = router;
