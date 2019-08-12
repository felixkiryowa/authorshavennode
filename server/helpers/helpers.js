import  nodemailer from 'nodemailer';

export const  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'daddyfelix56@gmail.com',
        pass: 'kiryowa22'
    }
});

export const  mailOptions = {
    from: 'youremail@gmail.com',
    to: 'myfriend@yahoo.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};
