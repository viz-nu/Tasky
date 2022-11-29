import nodemailer from "nodemailer";
import config from "config";
let { HOST, AUTH } = config.get("EMAIL_SMTP");
async function sendMail(emailData) {
    try {
        let transporter = nodemailer.createTransport({
            host: HOST,
            port: 465,
            secure: true,
            auth: {
                user: AUTH["USER"],
                pass: AUTH["PASS"],
            },
        });
        let info = await transporter.sendMail({
            from: '"Viznu.tech" <viznu@viznu.dev>', // sender address
            to: emailData.to, // list of receivers
            subject: emailData.subject, // Subject line
            html: emailData.body, // html body
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error(error);
    }
}
export default sendMail;