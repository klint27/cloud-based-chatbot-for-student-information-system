const {WebhookClient} = require('dialogflow-fulfillment');
const dialogflow = require('dialogflow');
const config = require('../config/keys');
const mongoose = require('mongoose');
const aesjs = require('aes-js');

const Events = require('../models/Events');
const Majors = require('../models/Majors');
const Courses = require('../models/Courses');
const Classes = require('../models/Classes');
const User = require('../models/User');
const Assignments = require('../models/Assignments')

const dateFormat = require('dateformat');

const credentials = {
    client_email: config.googleClientEmail,
    private_key: config.googlePrivateKey
};

const sessionClient = new dialogflow.SessionsClient({projectId: config.googleProjectID, credentials});

const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID);

module.exports = app => {

        app.post('/', async (req, res) => {

        const agent = new WebhookClient({ request: req, response: res });

        async function showEvents(agent) {


            const now = new Date();

            let events = await Events.find({date: {$gte: now}}).sort({date: 1});

            if (events != null) {

               let responseText=[`The next upcoming event is "${events[0].title}".`,
                                `We have "${events[0].title}" coming next.`];

                agent.add(responseText[Math.floor(Math.random() * responseText.length)]);
            }else{

                let responseText=`Unfortunately, there are no events at the moment.`;

                agent.add(responseText);

            }
        }

        async function eventDate(agent) {

            let responseText='';

            let event = await Events.findOne({title : { $in : agent.parameters.specificEvent}});
            if(event !== null){

                responseText=`It is going to take place on ${dateFormat(event.date, "mmmm dS")} at ${dateFormat(event.date, "h:MM TT")}`
            }else{
                responseText=`I am not sure that event is happening at all.`;
            }
            agent.add(responseText);
        }

        async function findMajor(agent) {

            let responseText = '';

            let Major = await Majors.findOne({name : { $in : agent.parameters.specificMajor}});
            if(Major !== null){
                responseText=`We do offer ${Major.name}`
            }else{
                responseText=`I am sorry, but we don't offer this major.`;
            }
            agent.add(responseText);
        }

        async function majorNumber(agent){

            let number= await Majors.find().estimatedDocumentCount();

            let responseText=[`For the moment we offer a variety of ${number} majors.`,
                            `Only ${number} majors are offered in this university for the moment.`,
                            `Currently, there are ${number} majors offered.`,
                            `The university offers ${number} majors for now.`];

            agent.add(responseText[Math.floor(Math.random() * responseText.length)]);

        }

        async function showMajors(agent){
            let majors = await Majors.find().select('name -_id');

            let majorslist = '';

            for (let i = 0; i < majors.length; i++) {
                if (i === majors.length - 1) {
                    majorslist += majors[i].name;
                } else {
                    majorslist += majors[i].name+ ', ';
                }
            }

            let responseText = [`This university offers only ${majorslist}.`,
                `The university provide the following majors: ${majorslist}.`,
                `The majors provided in this university are ${majorslist}.`];

            agent.add(responseText[Math.floor(Math.random() * responseText.length)]);
        }

        async function courseOffered(agent) {

            let course = await Courses.findOne({title : { '$regex' :agent.parameters.specificCourse.substr(0,7), '$options' : 'i' }}).select('title -_id');

            if(course !== null){

                let responseText = [`This university offers a great course related to ${course.title.substring(8)}.`,
                    `Sure, there is a course regarding ${course.title.substring(8)}.`,
                    `We definitely have course about ${course.title.substring(8)}.`];

                agent.add(responseText[Math.floor(Math.random() * responseText.length)]);

            }else{
                agent.add(`I am sorry, but we don't offer such course.`);
            }

        }


        async function majorOfCourse(agent){

            if(agent.parameters.specificCourse===''){
                agent.add(`I don't think there is a major related to that.`);
            }
            else{
            let course = await Courses.findOne({title : { '$regex' : agent.parameters.specificCourse.substr(0,6), '$options' : 'i' }}).select('major -_id');

            let major= await Majors.findOne({_id : { $in : course.major}});

                console.log(course);
                console.log(major);

            if(course !== null){
                let responseText = [`It might be ${major.name}.`,
                    `It should be ${major.name}.`,
                    `I am pretty sure it has to do with ${major.name}.`];

                agent.add(responseText[Math.floor(Math.random() * responseText.length)]);

            }else{
                agent.add(`I don't think there is a major related to that.`);
            }}

        }

        async function checkLogged(){

            const key = [6, 3, 13, 7, 14, 4, 2, 16, 12, 11, 9, 5, 15, 10, 1, 8];
            const encryptedBytes = aesjs.utils.hex.toBytes(agent.session.substr(sessionPath.length));
            const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
            const decryptedBytes = aesCtr.decrypt(encryptedBytes);
            const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

            if (mongoose.Types.ObjectId.isValid(decryptedText) === false) {

                return agent.add('Sorry, but you need to log in to check your classes.');

            }else{

                let user = await User.findOne({_id: {$in: decryptedText}});

                return user;
            }
        }

        async function classesNumber(agent) {

            let user = await checkLogged();

            if(user!=null) {

                let classes =await Classes.find({_id: {$in: user.classes}}).select('name -_id');

                agent.add(`You are currently enrolled in ${classes.length} courses.`);
            }
        }

        async function openAssignments(agent){

            let user = await checkLogged();

            if(user!=null) {

                let now = new Date();

                if(agent.parameters.specificCourse==='')
                {
                    let assignments = await Assignments.find({class: {$in: user.classes}, dateline: {'$gte': now}});
                    agent.add(`You have ${assignments.length} upcoming deadlines.`);
                }else{
                    let course = await Courses.findOne({title : { '$regex' :agent.parameters.specificCourse.substr(0,7), '$options' : 'i' }}).select('title _id');
                    let classes =await Classes.findOne({course: {$in: course._id}}).select('name');
                    if(classes!=null){
                        let assignments = await Assignments.find({class: {$in: classes._id}, dateline: {'$gte': now}});
                        if(assignments.length !== 0) {
                            agent.add(`You have ${assignments.length} upcoming deadlines in ${course.title.substr(9)}.`);
                        }else{
                            agent.add(`You don't have any upcoming deadlines in ${course.title.substr(9)}.`);
                        }
                    }else{
                        agent.add(`Excuse me, but you can't ask for classes you're not enrolled.`);
                    }
                }
            }

        }



        let intentMap = new Map();

        intentMap.set('ShowEvents', showEvents);

        intentMap.set('EventDate', eventDate);

        intentMap.set('FindMajor', findMajor);

        intentMap.set('MajorNumber', majorNumber);

        intentMap.set('ShowMajors', showMajors);

        intentMap.set('CourseOffered', courseOffered);

        intentMap.set('MajorOfCourse', majorOfCourse);

        intentMap.set('ClassesNumber', classesNumber);

        intentMap.set('OpenAssignments', openAssignments);


            await agent.handleRequest(intentMap);
    });
};