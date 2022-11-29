import { scheduleJob } from "node-schedule";
import sendMail from "./sendmail.js";
import sendSMS from "./sendSMS.js";

function fire(data){

        data.reminders.forEach((reminder,i)=>{
            scheduleJob(`${data.taskid}-${i}`,reminder,()=>{
                if(data.notificationType == "email"){
                    sendMail({
                        to: data.email,
                        subject: "Task Reminder",
                        body: `Hello ${data.fname} This email is reminder number ${i+1} for your task : ${data.taskName} 
                       <br/>
                       <br/> 
                        Thank you <br /><br />
                        Regards <br />
                        <b> Team Viz</b>`
                    });
                
                }
                else if(data.notificationType == "sms"){
                    sendSMS({
                        to: data.phone,
                        body: `Hello ${data.fname} This message is reminder number ${i+1} for your task : ${data.taskName}`
                    });
                }
                else{
                    sendMail({
                        to: data.email,
                        subject: "Task Reminder",
                        body: `Hello ${data.fname} This email is reminder number ${i+1} for your task : ${data.taskName}
                       <br/><br/> 
                        Thank you <br /><br />
                        Regards <br />
                        <b> Team Viz </b>`
                    });
    
                    sendSMS({
                        to: data.phone,
                        body: `Hello ${data.fname} This message is reminder number ${i+1} for your task : ${data.taskName}`
                    });
                }
            })
        })
       
    
}
 export {fire} ;


