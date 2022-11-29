import twilio from 'twilio';
import config from "config";
let {TWILIO_SID,TWILIO_TOKEN,TWILIO_NUMBER}= config.get("SEND_SMS");
const accountSid = TWILIO_SID;
const authToken = TWILIO_TOKEN;
const client = new twilio(accountSid, authToken);
async function sendSMS(smsData) {
    try {
        await client.messages
            .create({
                body: smsData.body,
                from: TWILIO_NUMBER,
                to: smsData.to
            })
        console.log("sent");
    } catch (error) {
        console.error(error);
    }
}

export default sendSMS;