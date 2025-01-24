const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: 'bhatsuhail9267@gmail.com',
        pass: 'ddqu jamk ekad mqyh',
    },
});

const sendEmail = (to, text) => {
    const mailOptions = {
        from: 'bhatsuhail9267@gmail.com',
        to: to,
        subject: 'You’ve Been Assigned a New Comment!',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">Comment Assignment Notification</h2>
                <p>Dear ${to},</p>
                <p>You have been assigned a new comment. Please find the details below:</p>
                <div style="border: 1px solid #ddd; padding: 10px; background-color: #f9f9f9;">
                    <p><strong>Comment:</strong> ${text}</p>
                    <p><strong>Deadline:</strong> <i>Please check your dashboard</i></p>
                </div>
                <p>Kindly login to the portal to view and manage your tasks.</p>
                <p>Best regards,<br><strong>StealthAI</strong></p>
            </div>
        `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error occurred:', err);
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });
};

module.exports = { sendEmail };
