require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const getToken = require('../helpers/getToken');
const jwtSecret = require('../helpers/jwtSecret');
const models = require('../models');
const properNoun = require('../helpers/properNoun');

const passwordMail = process.env.PASSWORD_MAIL;

const router = express.Router();

router.post('/signup', (req, res) => { // caregiver creation
  const newUser = { // we set the first letter of firstName and lastName into uppercases
    ...req.body,
    firstName: properNoun(req.body.firstName),
    lastName: properNoun(req.body.lastName),
  };

  models.User.create(newUser)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/signin', (req, res) => { // caregiver connection
  const { email, password } = req.body;
  // find in the db an user which have the same email than the one entered by the user
  models.User.findOne({
    where: {
      email,
    },
  })
  .then((user) => {
    bcrypt.compare(password, user.password, (err, match) => { // bcrypt is going to compare the password in database with the one written by the user
      if (match) {
        const tokenInfo = {
          email,
          id: user.id,
        };
        // creation of the token with the tokenInfo
        // we use the jwtSecret to create it (and decrypt it later)
        const token = jwt.sign(tokenInfo, jwtSecret, { expiresIn: '1d' });
        // creation of a header 'Access-Control...' with the name 'x-access-token'
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

router.post('/forgotPassword', (req, res) => { // to reset password of a caregiver
  const { email } = req.body;
  models.User.findOne({ // we get the caregiver whose email is the one in req.body
    where: {
      email,
    },
  })
  .then((user) => {
    if (user) {
      // user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      const tokenInfo = {
        id: user.id,
        expiresIn: '6h', // jwt expires the token in 6h if not used
      };

      const token = jwt.sign(tokenInfo, jwtSecret); // we create a new token
      res.header('Access-Control-Expose-Headers', 'x-access-token');
      res.set('x-access-token', token);

      const smtpTransport = nodemailer.createTransport({ // we are setting the id and password for the expeditor mail
        service: 'Gmail',
        auth: {
          user: '', // put here karine's mail
          pass: passwordMail,
        },
      });

      const mailOptions = { // mail that will be sent
        to: user.dataValues.email,
        from: `Kalify <${smtpTransport.options.auth.user}>`,
        subject: 'Réinitialisation de votre mot de passe Kalify',
        text: `Bonjour,\n
          Vous recevez cet e-mail suite à une demande de réinitialisation de votre mot de passe sur le site Kalify.\n
          Merci de cliquer sur le lien ci-dessous afin de choisir un nouveau mot de passe:\n
          http://localhost:3000/reset/${token} \n
          Si vous n'êtes pas à l'origine de cette demande, nous vous invitons à ignorer ce mail et votre mot de passe restera inchangé.\n
          Cordialement,\n
          L'équipe Kalify\n`,
      };

      smtpTransport.sendMail(mailOptions, (err) => { // sending the mail
        if (err) { console.log(err); }
        console.log('mail sent');
      });
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: 'user not found in database' });
    }
  });
});

router.put('/reset', async (req, res) => { // route to set a new password
  const token = getToken(req);
  const { password } = req.body;
  const decode = jwt.verify(token, jwtSecret);
  const user = await models.User.findOne({ where: { id: decode.id } }); // we get the caregiver identified with the id in the token
  await user.update({
    password,
  });
  res.sendStatus(201);
});

module.exports = router;
