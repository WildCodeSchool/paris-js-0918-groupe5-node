const express = require('express');
const moment = require('moment');
const models = require('../models');

class MegaClassLaClass {
  constructor(allInfo, i) {
    this.title = allInfo.title;
    this.OtherAddressChecked = allInfo.OtherAddressChecked;
    this.address = allInfo.address;
    this.startingDate = moment(allInfo.startingDate).add(i, 'days').toString();
    this.endingDate = moment(allInfo.startingDate).add(i + 1, 'days').toString();
    this.frequency = allInfo.frequency;
    this.daysSelected = allInfo.daysSelected;
    this.contact = allInfo.contact;
    this.category = allInfo.category;
    this.events = allInfo.events;
    this.visibleEvent = allInfo.visibleEvent;
    this.followedVisit = allInfo.followedVisit;
    this.reminder = allInfo.reminder;
    this.immediateNotif = allInfo.immediateNotif;
  }
}

const router = express.Router();

router.route('/:idContact')
  // create a new event linked to the selected receiver and a contact
  .post((req, res) => {
    const newEvent = req.body;
    const { idContact } = req.params;
    const { selectedReceiverId } = req.caregiver;
    // creation of a new event in the Event table
    console.log('duration');
    if (newEvent.frequency === '' || newEvent.frequency === 'once') {
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
                    // console.log('eventCreated');
                    // console.log(eventCreated);
                    // console.log('eventCreated');
                  });
                });
                } else {
                  res.status(200).json(eventCreated);
                  console.log('esle.........');
                }
              });
          });
      });
    } else if (newEvent.frequency === 'everyday') {
      console.log('everyday');
      const responsed = [];
      const daynum1 = moment(newEvent.startingDate).date();
      const daynum2 = moment(newEvent.endingDate).date();
      const periodeOfTime = daynum2 - daynum1;
      // TEST ON DURATION
      // TEST ON DURATION
      // TEST ON DURATION
      const duration = moment.duration(moment(newEvent.startingDate).diff(moment(newEvent.endingDate), 'd'));
      // const duration = moment(newEvent.startingDate).subtract(moment(newEvent.endingDate)).days();
      // a.subtract(b).days()
      console.log('duration');
      console.log(duration);
      console.log(duration.data);
      // TEST ON DURATION
      // TEST ON DURATION
      // TEST ON DURATION
      const arrayOfPromice = [];
      for (let i = 0; i < periodeOfTime + 1; i += 1) {
        arrayOfPromice.push(new Promise((resolve) => {
          models.Event.create(new MegaClassLaClass(newEvent, i))
            .then((eventCreated) => {
              // we get the selected receiver
              models.User.findByPk(selectedReceiverId)
                .then((receiver) => {
                  // link the event to the receiver
                  receiver.addEvent(eventCreated)
                    .then(() => {
                      if (idContact !== 0) {
                      models.Contact.findByPk(idContact).then((contact) => {
                        contact.addEvent(eventCreated);
                        resolve(eventCreated);
                        responsed.push(eventCreated.dataValues);
                        // .then(() => res.json(eventCreated));
                      });
                      } else {
                        // res.sen(200).json(eventCreated);
                        res.sendStatus(500);
                        console.log('esle.........');
                      }
                    });
                });
            });
        }));
      }
      Promise
      .all(arrayOfPromice)
      .then(() => res.status(200).json(responsed))
      .catch(err => console.log(err));
    } else console.log('saluts les copains');
  });

router.route('/')
  // get the active events linked to the selected receiver
  .get((req, res) => {
    const { selectedReceiverId } = req.caregiver;
    if (selectedReceiverId !== -1) {
      models.User.findByPk(selectedReceiverId)
        .then((receiver) => {
          // console.log(receiver.prototype);
          receiver.getEvents({ where: { status: true } })
            .then((events) => {
              res.status(200).json(events);
            });
        });
    } else {
      res.status(200).json([]);
    }
  });

module.exports = router;
