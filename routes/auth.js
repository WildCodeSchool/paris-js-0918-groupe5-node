require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const getToken = require('../helpers/getToken');
const jwtSecret = require('../helpers/jwtSecret');
const models = require('../models');

const passwordMail = process.env.PASSWORD_MAIL;

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
  console.log('(((((((((((((((((((', passwordMail)
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
    if (user) {
      // user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      const tokenInfo = {
        id: user.id,
        expiresIn: '6h',
      };
      const token = jwt.sign(tokenInfo, jwtSecret);
      res.header('Access-Control-Expose-Headers', 'x-access-token');
      res.set('x-access-token', token);
      const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'widaad.barreto@gmail.com',
          pass: passwordMail,
        },
      });
      const mailOptions = {
        to: user.dataValues.email,
        from: 'Kalify <widaad.barreto@gmail.com>',
        subject: 'Réinitialisation de votre mot de passe Kalify',
        text: `Bonjour,\n
          Vous recevez cet e-mail suite à une demande de réinitialisation de votre mot de passe sur le site Kalify.\n
          Merci de cliquer sur le lien ci-dessous afin de choisir un nouveau mot de passe:\n
          http://localhost:3000/reset/${token} \n
          Si vous n'êtes pas à l'origine de cette demande, nous vous invitons à ignorer ce mail et votre mot de passe restera inchangé.\n
          Cordialement,\n
          L'équipe Kalify\n`,
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        if (err) { console.log(err); }
        console.log('mail sent');
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
});

// router.put('/reset', (req, res) => {
//   const token = getToken(req);
//   const { password } = req.body;
//   const decode = jwt.verify(token, jwtSecret);
//   models.User.findOne({ where: { id: decode.id } })
//     .then((user) => {
//       user.update({
//         password,
//       }).then(() => {
//         res.sendStatus(201);
//       });
//     });
// });

router.put('/reset', async (req, res) => {
  const token = getToken(req);
  const { password } = req.body;
  const decode = jwt.verify(token, jwtSecret);
  const user = await models.User.findOne({ where: { id: decode.id } });
  await user.update({
    password,
  });
  res.sendStatus(201);
});

module.exports = router;
