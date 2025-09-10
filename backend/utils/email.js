import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.Email_Username,
        pass: process.env.Email_Password,
    },
    tls: {
        rejectUnauthorized: false,
    }
});

transporter.verify((error) => {
    if (error) {
        console.error("Transporter Error: ", error);
    } else {
        console.log("Server is ready to take messages");
    }
});

export default transporter