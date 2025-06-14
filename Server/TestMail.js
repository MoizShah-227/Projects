// const nodemailer = require('nodemailer');
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port:587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "syedmoizhassan123@gmail.com", // Your Gmail address
      pass:  "bggq mlei njpw iaev"        // Your Gmail password or app-specific password
    }
  });

  // console.log("value",process.env.HOST)

  const mailOptions = {

    from: "syedmoizhassan123@gmail.com",        // Sender address
    to: 'syedmoizshah227@gmail.com',   // List of recipients
    subject: 'here is your code',       // Subject line
    text: 'This is a test email sent using Nodemailer!',  // Plain text body
    html: '<h1>This is a test email</h1><p>Sent using <b>Nodemailer</b>!</p>' // HTML body (optional)
  
  
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error sending email: ', error);
    }
    console.log('Email sent: ' + info.response);
  });