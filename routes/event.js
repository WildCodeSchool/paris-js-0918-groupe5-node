const express = require('express');
const moment = require('moment');
const models = require('../models');

class MegaClassLaClass {
  constructor(allInfo, i) {
    this.title = allInfo.title;
    this.address = allInfo.address;
    // this.startingDate = moment(allInfo.startingDate).add(i, 'days').toISOString();
    this.startingDate = moment(allInfo.startingDate).add(i, 'days').toString();
    this.endingDate = allInfo.endingDate;
    this.frequency = allInfo.frequency;
    this.daysSelected = allInfo.daysSelected;
    this.contact = allInfo.contact;
    this.category = allInfo.category;
  }
}

// const promise1 = Promise.resolve(3);
// const promise2 = 42;
// const promise3 = new Promise(resolve => setTimeout(resolve, 100, 'foo'));

// Promise.all([promise1, promise2, promise3]).then(values => console.log(values));

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
    // console.log(newEvent);
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
      const daynum1 = moment(newEvent.startingDate).date();
      const daynum2 = moment(newEvent.endingDate).date();
      const periodeOfTime = daynum2 - daynum1;
      const arrayOfPromice = [];

      for (let i = 0; i < periodeOfTime + 1; i += 1) {
        // arrayOfPromice.push(Promise.resolve(models.Event.create(new MegaClassLaClass(newEvent, i))));
        arrayOfPromice.push(new Promise((resolve, reject) => {
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
                        // .then(() => {
                        //   res.status(200).json(eventCreated);
                        //   // console.log(eventCreated.dataValues);
                        // });
                      });
                      } else {
                        // res.sen(200).json(eventCreated);
                        res.sendStatus(200);
                        console.log('esle.........');
                      }
                    });
                });
            });
        }));
        console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
        // models.Event.create(new MegaClassLaClass(newEvent, i))
        // console.log(new MegaClassLaClass(newEvent, i));
      }
      Promise
      .all(arrayOfPromice)
      .then(() => res.sendStatus(200))
      // .then(() => res.sen(200).json(eventCreated))
      .catch(err => console.log(err));

    //   return Promise.all([ 'task1', 'task2', 'task3' ]).then(arrayOfResults => {
    //     // Do something with all results
    // });

        // models.Event.create(newEvent)
        // .then((eventCreated) => {
        //   // we get the selected receiver
        //   models.User.findByPk(selectedReceiverId)
        //     .then((receiver) => {
        //       // link the event to the receiver
        //       receiver.addEvent(eventCreated)
        //         .then(() => {
        //           if (idContact !== 0) {
        //           models.Contact.findByPk(idContact).then((contact) => {
        //             contact.addEvent(eventCreated).then(() => {
        //               res.status(200).json(eventCreated);
        //               // console.log(eventCreated.dataValues);
        //             });
        //           });
        //           } else {
        //             res.status(200).json(eventCreated);
        //             console.log('esle.........');
        //           }
        //         });
        //     });
        // });
    } else console.log('saluts les cppains');
  });

router.route('/')
  // get the active events linked to the selected receiver
  .get((req, res) => {
    const { selectedReceiverId } = req.caregiver;
    models.User.findByPk(selectedReceiverId)
      .then((receiver) => {
        // console.log(receiver.prototype);
        receiver.getEvents({ where: { status: true } })
          .then((events) => {
            res.status(200).json(events);
          });
      });
  });

module.exports = router;
