import nodemailer from 'nodemailer';

const sendMail = async (req, res) => {
    const { email, subject, message } = req.body;

    try {
        // Configure Nodemailer transport
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'arhamsaif66@gmail.com',
                pass: 'tahi tebw nsnp ezhd',
            },
        });

        // Email options
        const mailOptions = {
            from: 'Health Care',
            to: email,
            subject: subject,
            text: message,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
}

export {sendMail};