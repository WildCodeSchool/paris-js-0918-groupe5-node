const express = require('express');
const moment = require('moment');
const models = require('../models');

class EventEveryDays {
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
    // this.events = allInfo.events;
    this.visibleEvent = allInfo.visibleEvent;
    this.followedVisit = allInfo.followedVisit;
    this.reminder = allInfo.reminder;
    this.immediateNotif = allInfo.immediateNotif;
  }
}

class EventOneDays {
  constructor(allInfo) {
    this.title = allInfo.title;
    this.OtherAddressChecked = allInfo.OtherAddressChecked;
    this.address = allInfo.address;
    this.startingDate = moment(allInfo.startingDate).toString();
    this.endingDate = moment(allInfo.startingDate).toString();
    this.frequency = allInfo.frequency;
    this.contact = allInfo.contact;
    this.category = allInfo.category;
    // this.events = allInfo.events;
    this.visibleEvent = allInfo.visibleEvent;
    this.followedVisit = allInfo.followedVisit;
    this.reminder = allInfo.reminder;
    this.immediateNotif = allInfo.immediateNotif;
  }
}

const router = express.Router();

router.route('/:idContact')
  .post((req, res) => {
    const newEvent = req.body;
    const { idContact } = req.params;
    const { selectedReceiverId } = req.caregiver;
    // creation of a new event in the Event table
    console.log('body', req.body);
    if (newEvent.frequency === '' || newEvent.frequency === 'once') {
      models.Event.create(new EventOneDays(newEvent))
      .then((eventCreated) => {
        models.User.findByPk(selectedReceiverId)
          .then((receiver) => {
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
                  console.log('esle.........');
                }
              });
          });
      });
    } else if (newEvent.frequency === 'everyday') {
      const responseToSend = [];
      const firstDay = moment(newEvent.startingDate);
      const lastDay = moment(newEvent.endingDate);
      const periodeOfTime = lastDay.diff(firstDay, 'days');
      const arrayOfPromice = [];
      for (let i = 0; i < periodeOfTime + 1; i += 1) {
        arrayOfPromice.push(new Promise((resolve) => {
          models.Event.create(new EventEveryDays(newEvent, i))
            .then((eventCreated) => {
              models.User.findByPk(selectedReceiverId)
                .then((receiver) => {
                  receiver.addEvent(eventCreated)
                    .then(() => {
                      if (idContact !== 0) {
                      models.Contact.findByPk(idContact).then((contact) => {
                        contact.addEvent(eventCreated);
                        resolve(eventCreated);
                        responseToSend.push(eventCreated.dataValues);
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
      .then(() => res.status(200).json(responseToSend))
      .catch(err => console.log(err));
    } else if (newEvent.frequency === 'everyWeekDay') {
      const responseToSend = [];
      const firstDay = moment(newEvent.startingDate);
      const lastDay = moment(newEvent.endingDate);
      const periodeOfTime = lastDay.diff(firstDay, 'days');
      const arrayOfPromice = [];
      for (let i = 0; i < periodeOfTime + 1; i += 1) {
        if (moment(new EventEveryDays(newEvent, i).startingDate).day() !== 6 && moment(new EventEveryDays(newEvent, i).startingDate).day() !== 0) {
          arrayOfPromice.push(new Promise((resolve) => {
            models.Event.create(new EventEveryDays(newEvent, i))
              .then((eventCreated) => {
                models.User.findByPk(selectedReceiverId)
                  .then((receiver) => {
                    receiver.addEvent(eventCreated)
                      .then(() => {
                        if (idContact !== 0) {
                        models.Contact.findByPk(idContact).then((contact) => {
                          contact.addEvent(eventCreated);
                          resolve(eventCreated);
                          responseToSend.push(eventCreated.dataValues);
                        });
                        } else {
                          res.sendStatus(500);
                          console.log('esle.........');
                        }
                      });
                  });
              });
          }));
        }
      }
      Promise
      .all(arrayOfPromice)
      .then(() => res.status(200).json(responseToSend))
      .catch(err => console.log(err));
    } else if (newEvent.frequency === 'specificDays') {
      const firstDay = moment(newEvent.startingDate);
      const lastDay = moment(newEvent.endingDate);
      const periodeOfTime = lastDay.diff(firstDay, 'days');
      const listOfGoodDaysArray = newEvent.daysSelected.split(',');
      console.log('listOfGoodDaysArray', listOfGoodDaysArray);
      const arrayOfPromice = [];
      const responseToSend = [];
      listOfGoodDaysArray.map((selectedDay) => {
        for (let i = 0; i < periodeOfTime + 1; i += 1) {
          console.log('========', typeof new EventEveryDays(newEvent, i).startingDate);
          const dayInRange = moment(new EventEveryDays(newEvent, i).startingDate).day();
          if (dayInRange === parseInt(selectedDay, 10)) {
            arrayOfPromice.push(new Promise((resolve) => {
              models.Event.create(new EventEveryDays(newEvent, i))
                .then((eventCreated) => {
                  models.User.findByPk(selectedReceiverId)
                    .then((receiver) => {
                      receiver.addEvent(eventCreated)
                        .then(() => {
                          if (idContact !== 0) {
                          models.Contact.findByPk(idContact).then((contact) => {
                            contact.addEvent(eventCreated);
                            resolve(eventCreated);
                            responseToSend.push(eventCreated.dataValues);
                          });
                          } else {
                            res.sendStatus(500);
                            console.log('esle.........');
                          }
                        });
                    });
                });
            }));
          }
        }
        return selectedDay;
      });
      Promise
      .all(arrayOfPromice)
      .then(() => res.status(200).json(responseToSend))
      .catch(err => console.log(err));
    } else console.log('saluts les copains');
});


router.route('/')
  .get((req, res) => {
    const { selectedReceiverId } = req.caregiver;
    // return res.json(req.caregiver);
    models.User.findByPk(selectedReceiverId)
      .then((receiver) => {
        // console.log(receiver.prototype);
        if (receiver) {
          receiver.getEvents({ where: { status: true } })
            .then((events) => {
              res.status(200).json(events);
            });
        } else {
          res.status(404).json({ error: 'no user' });
        }
      });
  });

module.exports = router;
