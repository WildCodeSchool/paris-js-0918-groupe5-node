const express = require('express');
const models = require('../models');


const router = express.Router();

router.route('/')
  // create a new event linked to the selected receiver
  .post((req, res) => {
    const newEvent = {
      ...req.body,
    };
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
                res.status(200).json(eventCreated);
              });
          });
      });
  })
  // get the active events linked to the selected receiver
  .get((req, res) => {
    const { selectedReceiverId } = req.caregiver;
    models.Event.findByPk(selectedReceiverId)
      .then((receiver) => {
        receiver.getEvents({ where: { status: true } })
          .then((events) => {
            res.status(200).json(events);
          });
      });
  });

module.exports = router;
