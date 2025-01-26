const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'bhatsuhail9267@gmail.com',
        pass: 'ddqu jamk ekad mqyh',
    },
});

const sendEmail = async (to, text, name) => {
    const mailOptions = {
        from: 'bhatsuhail9267@gmail.com',
        to: to,
        subject: 'You’ve Been Assigned a New Comment!',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">Comment Assignment Notification</h2>
                <p>Dear ${name},</p>
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
    await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });
    await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });
    });

};

module.exports = { sendEmail };
