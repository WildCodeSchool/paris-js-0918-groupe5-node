const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const jwtSecret = require('../helpers/jwtSecret');
const models = require('../models');

const passport = require('passport');
const User = require('../models/').User;
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();

router.post('/signup', (req, res) => { // Caregiver creation
  models.User.create(req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  // find in the db an user which have the same email than the one entered by the user
  models.User.findOne({
    where: {
      email,
    },
  })
  .then((user) => {
    bcrypt.compare(password, user.password, (err, match) => {
      if (match) {
        const tokenInfo = {
          email,
          id: user.id,
        };
        // creation of the token with the tokenInfo
        // we use the jwtSecret to create it (and decrypt it later)
        const token = jwt.sign(tokenInfo, jwtSecret);
        // creation of an header 'Access-Control...' with the name 'x-access-token'
        res.header('Access-Control-Expose-Headers', 'x-access-token');
        // we set the value of the header with the token
        res.set('x-access-token', token);
        res.status(200).send({ id: user.id });
      } else {
        res.sendStatus(403);
      }
    });
  })
  .catch(() => res.sendStatus(404));
});

router.post('/forgotPassword', (req, res) => {
  const { email } = req.body;
  models.User.findOne({
    where: {
      email,
    },
  })
  .then((user) => {
    console.log('+++++++++++++++', user);
    if (user) {
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      const tokenInfo = {
        resetPasswordExpires: user.resetPasswordExpires,
        email: user.email,
      };
      const token = jwt.sign(tokenInfo, jwtSecret);
      res.header('Access-Control-Expose-Headers', 'x-access-token');
      res.set('x-access-token', token);

      console.log('((((((((((((((((((((((((', user.dataValues.resetPasswordExpires);
      const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'widaad.barreto@gmail.com',
          pass: 'ojsehiltpsfuuoxj',
        },
      });
      const mailOptions = {
        to: user.dataValues.email,
        from: 'Kalify',
        subject: 'Réinitialisation de votre mot de passe Kalify',
        text: `Bonjour,\n\n
          Vous recevez cet e-mail suite à une demande de réinitialisation de votre mot de passe sur le site Kalify.\n\n
          Merci de cliquer sur le lien ci-dessous afin de choisir un nouveau mot de passe:\n\n
          http://localhost:3000/reset?token=${token} \n\n
          Si vous n'êtes pas à l'origine de cette demande, nous vous invitons à ignorer ce mail et votre mot de passe restera inchangé.\n\n
          Cordialement,\n\n
          L'équipe Kalify\n\n`,
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        if (err) { throw (err); }
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        // done(err, 'done');
      });
    }
  });
});
// })
// });


// router.post('/forgotPassword', (req, res, next) => {
//   async.waterfall([
//     (done) => {
//       crypto.randomBytes(20, (err, buf) => {
//         const token = buf.toString('hex');
//         done(err, token);
//       });
//     },
//     (token, done) => {
//       models.User.findOne({ where: { email: req.body.email } }, (err, user) => {
//         if (!user) {
//           req.flash('error', 'No account with that email address exists.');
//           // return res.redirect('/forgot');
//         } else {
//         user.resetPasswordToken = token;
//         user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//         console.log('===============', user.resetPasswordToken);

//         user.save((errUser) => {
//           done(errUser, token, user);
//         });
//         }
//       });
//     },
//     (token, user, done) => {
//       const smtpTransport = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//           user: 'mariage.barreto@gmail.com',
//           pass: 'coldouche2',
//         }
//       });
//       const mailOptions = {
//         to: user.email,
//         from: 'Kalify',
//         subject: 'Node.js Password Reset',
//         text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//           'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//           'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//           'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//       };
//       smtpTransport.sendMail(mailOptions, (err) => {
//         console.log('mail sent');
//         req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
//         done(err, 'done');
//       });
//     },
//   ], (err) => {
//     if (err) return next(err);
//     return res.redirect('/forgot');
//   });
// });

module.exports = router;
