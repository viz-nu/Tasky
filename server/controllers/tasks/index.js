import express from "express";

import mongoose from "mongoose";
import User from "../../models/users.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../../middlewares/auth.js"
import { fire } from "../../utils/worker.js";
import { taskValidations, errorMiddleware, taskEditValidations } from "../../middlewares/validations.js";
import { scheduledJobs, cancelJob } from "node-schedule";

const router = express.Router();
/*
    API : /api/task/add
    Desc : Task addition
    Method : POST
    Body : taskname,deadline,notificationtype
    Access : Private
    Validations : valid token
*/

router.post("/add", authMiddleware,
    taskValidations(),
    errorMiddleware,
    async (req, res, next) => {
        try {

            const userData = await User.findById(req.user.user_id);
            let notificationType = req.body.notificationType;
            let taskName = req.body.taskname;
            if (new Date(req.body.deadline) == "Invalid Date") {
                return res.status(400).json({ error: 'Deadline is an invalid' });
            }
            let deadline = new Date(req.body.deadline);
            let current = new Date(); //current UTC0

            let mins = ((deadline - current)) / (1000 * 60); //diff in mins
            let days = ((deadline - current)) / (1000 * 60 * 60 * 24); //diff in days
            if (mins < 5 || days > 30) {
                return res.status(400).json({ error: 'Deadline should not be less than 5mins & more than 30 days or backdated' });
            }
            // getting the reminders array

            //creating reminders array 1/4,1/2,3/4
            let reminders = [];
            let reminder0 = new Date((+current)+ 10000);
            let reminder1 = new Date((+current) + ((mins / 4) * 60 * 1000));
            let reminder2 = new Date((+current) + ((mins / 2) * 60 * 1000));
            let reminder3 = new Date((+current) + ((mins * 0.75) * 60 * 1000));
            reminders.push(reminder0,reminder1, reminder2, reminder3);

            let taskdata = {
                reminders,
                taskname: req.body.taskname,
                deadline,
                notificationType: req.body.notificationType
            }
            // //save into db and schedule jobs
            userData.tasks.push(taskdata);
            let taskid = userData.tasks[userData.tasks.length - 1]._id.toString()
            await userData.save();

            let data = {
                taskid: userData.user_id,
                reminders,
                phone: userData.phone,
                email: userData.email,
                notificationType,
                fname: userData.fname,
                taskName,
                taskid
            }
            fire(data);

            res.status(200).json({ success: "New Task has been scheduled" });

        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });

        }
    });


router.put("/edit/:toDoId", authMiddleware, taskEditValidations(), errorMiddleware, async (req, res, next) => {
    try {
        const userData = await User.findById(req.user.user_id);
        let taskId = req.params.toDoId;
        let notificationType = req.body.notificationType;
        let taskName = req.body.taskname;
        let taskData = userData.tasks.find((task) => task._id == taskId);

        if (!taskData) return res.status(404).json({ error: 'Invalid task id' });
        let index = userData.tasks.findIndex((task) => task._id == taskId);
        if (req.body.isCompleted == true) {
            taskData.reminders.forEach((element, i) => {
                cancelJob(`${taskId}-${i}`);
            });
            userData.tasks[index].isCompleted = true;
            //update the db
            await userData.save();
            res.status(200).json({ success: 'Task status has been updated' });

        }
        else {
            taskData.reminders.forEach((element, i) => {
                cancelJob(`${taskId}-${i}`)
            });
            if (new Date(req.body.deadline) == "Invalid Date") {
                return res.status(400).json({ error: 'Deadline is an invalid' });
            }
            let deadline = new Date(req.body.deadline);
            let current = new Date(); //current UTC0

            let mins = ((deadline - current)) / (1000 * 60); //diff in mins
            let days = ((deadline - current)) / (1000 * 60 * 60 * 24); //diff in days
            if (mins < 30 || days > 30) {
                return res.status(400).json({ error: 'Deadline should not be less than 30mins & more than 30 days or backdated' });
            }
            // getting the reminders array

            //creating reminders array 1/4,1/2,3/4
            let reminders = [];
            let reminder1 = new Date((+current) + ((mins / 4) * 60 * 1000));
            let reminder2 = new Date((+current) + ((mins / 2) * 60 * 1000));
            let reminder3 = new Date((+current) + ((mins * 0.75) * 60 * 1000));
            reminders.push(reminder1, reminder2, reminder3);

            let taskdata = {
                reminders,
                taskname: req.body.taskname,
                deadline,
                isCompleted: req.body.isCompleted,
                notificationType: req.body.notificationType
            }
            //save into db and schedule jobs
            userData.tasks[index] = taskdata;
            let taskid = userData.tasks[userData.tasks.length - 1]._id.toString()
            await userData.save();

            let data = {
                taskid: userData.user_id,
                reminders,
                phone: userData.phone,
                email: userData.email,
                notificationType,
                fname: userData.fname,
                taskName,
                taskid
            }
            fire(data);
            res.status(200).json({ success: 'Task  has been updated' });

        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });

    }
});


/*
    API : /api/task/
    Desc : GET all the tasks of this user
    Method : GET
    Body : taskname, deadline, notificationType
    Access : Private
*/

router.get("/", authMiddleware, errorMiddleware, async (req, res, next) => {
    try {
        const userData = await User.findById(req.user.user_id);

        res.status(200).json({ tasks: userData.tasks });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }


});

/*
    API : /api/task/:taskid
    Desc : GET a particular task
    Method : GET
    Body : taskname, deadline, notificationType
    Access : Private
*/


router.get("/:taskid", authMiddleware, errorMiddleware, async (req, res, next) => {
    try {
        const userData = await User.findById(req.user.user_id);
        let taskId = req.params.taskid;
        let taskData = userData.tasks.find((task) => task._id == taskId);

        if (!taskData) {
            return res.status(404).json({ error: 'Task Id is invalid' });
        }
        return res.status(200).json({ taskData });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }

});


router.delete("/delete/:taskId", authMiddleware, errorMiddleware, async (req, res, next) => {
    try {
        const userData = await User.findById(req.user.user_id);
        let taskId = req.params.taskId;
        let taskData = userData.tasks.find((task) => task._id == taskId);

        if (!taskData) return res.status(404).json({ error: 'Invalid task id' });
        userData.tasks = userData.tasks.filter((ele) => ele._id != taskId);
        await userData.save();
        console.log(scheduledJobs);
        taskData.reminders.forEach((element, i) => {
            cancelJob(`${taskId}-${i}`)
        });
        // console.log(scheduledJobs);
        res.status(200).json({ success: 'Deleted successfully' });
    }

    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


export default router;



