const express = require('express');
const ejs = require('ejs');
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const adminEmail = process.env.ADMIN_TO_EMAIL;
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgun = new Mailgun(formData);
const client = mailgun.client({username: 'api', key: MAILGUN_API_KEY});
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  const {senderName, senderEmail, senderPhone, senderMessage} = req.body;

  const messageData = {
    from: senderEmail,
    to: adminEmail,
    subject: 'A new portfolio inquiry!',
    text: 'Name: ' + senderName + '\nPhone: ' + senderPhone + '\nMessage: ' + senderMessage
  };

  client.messages.create(DOMAIN, messageData)
    .then((res) => {
      console.log('Success');
    })
    .catch((err) => {
      console.log('Oh no, something went wrong.');
    });

  res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});
