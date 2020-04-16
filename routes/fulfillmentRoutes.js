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
const Assignments = require('../models/Assignments');

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

            if (events !== null) {

               let responseText=[`The next upcoming event is "${events[0].title}".`,
                                `We have "${events[0].title}" coming next.`,
                                `There is "${events[0].title}" coming.`];

                agent.add(responseText[Math.floor(Math.random() * responseText.length)]);
            }else{

                let responseText=[`Unfortunately, there are no events at the moment.`,
                                `I am sorry, but there are no events coming.`,
                                `No events planned for the moment.`];

                agent.add(responseText[Math.floor(Math.random() * responseText.length)]);

            }
        }

        async function eventDate(agent) {

            let event = await Events.findOne({title : { $in : agent.parameters.specificEvent}});
            if(event !== null && agent.parameters.specificEvent!==''){

                let responseText=[`It is going to take place on ${dateFormat(event.date, "mmmm dS")} at ${dateFormat(event.date, "h:MM TT")}`,
                            `This event will take place on ${dateFormat(event.date, "mmmm dS")} at ${dateFormat(event.date, "h:MM TT")}`,
                            `The event is scheduled for ${dateFormat(event.date, "mmmm dS")} at ${dateFormat(event.date, "h:MM TT")}`]

                agent.add(responseText[Math.floor(Math.random() * responseText.length)]);
            }else{
                let responseText=[`I am not sure that event is happening at all.`,
                            `I don't think this event is planned to happen.`,
                            `Sadly, this event is not scheduled for the future.`];

                agent.add(responseText[Math.floor(Math.random() * responseText.length)]);
            }
        }

        async function findMajor(agent) {

            let Major = await Majors.findOne({name : { $in : agent.parameters.specificMajor}});
            if(Major !== null && agent.parameters.specificMajor !==''){
                let responseText=[`We do offer ${Major.name}. You can learn more about it in the Majors section.`,
                            `There is a major in ${Major.name}. You can check it in the Majors section.`,
                            `${Major.name} is offered by the university. You can find more information in the Majors section.`];

                agent.add(responseText[Math.floor(Math.random() * responseText.length)]);
            }else{
                let responseText=[`I am sorry, but we don't offer this major.`,
                            `Unfortunately, we don't offer this major at the moment.`];

                agent.add(responseText[Math.floor(Math.random() * responseText.length)]);
            }
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

            if(course !== null && agent.parameters.specificCourse!==''){

                let responseText = [`This university offers a great course related to ${course.title.substring(8)}. You can check it in the Course Catalog.`,
                    `Sure, there is a course regarding ${course.title.substring(8)}. More information is available in the Course Catalog.`,
                    `We definitely have course about ${course.title.substring(8)}. You can check more about it in the Course Catalog.`];

                agent.add(responseText[Math.floor(Math.random() * responseText.length)]);

            }else{
                let responseText=[`I am sorry, but we don't offer this course.`,
                    `Unfortunately, we don't offer this course at the moment.`,
                    `This course is not in our catalog at the moment.`];

                agent.add(responseText[Math.floor(Math.random() * responseText.length)]);
            }

        }


        async function majorOfCourse(agent){

            let course = await Courses.findOne({title : { '$regex' : agent.parameters.specificCourse.substr(0,6), '$options' : 'i' }}).select('major -_id');

            let major= await Majors.findOne({_id : { $in : course.major}});

            if(major !== null && agent.parameters.specificCourse !==''){
                let responseText = [`I think it is ${major.name}.`,
                    `It should be ${major.name}.`,
                    `I am pretty sure it has to do with ${major.name}.`];

                agent.add(responseText[Math.floor(Math.random() * responseText.length)]);

            }else{
                agent.add(`I don't think there is a major related with that in our school.`);
            }

        }

        async function checkLogged(){

            const key = [6, 3, 13, 7, 14, 4, 2, 16, 12, 11, 9, 5, 15, 10, 1, 8];
            const key_128_buffer = Buffer.from(key);
            const encryptedBytes = aesjs.utils.hex.toBytes(agent.session.substr(sessionPath.length));
            const aesCtr = new aesjs.ModeOfOperation.ctr(key_128_buffer, new aesjs.Counter(5));
            const decryptedBytes = aesCtr.decrypt(encryptedBytes);
            const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

            if (mongoose.Types.ObjectId.isValid(decryptedText) === false) {

                return agent.add('Sorry, but you need to log in to check your classes.');

            }else{

                return User.findOne({_id: {$in: decryptedText}});
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
                    let assignments = await Assignments.find({class: {$in: user.classes}, dateline: {'$gte': now}}).sort({dateline: 1});

                    agent.add(`You have ${assignments.length} upcoming deadlines.`+
                        ` The closest one is the ${assignments[0].name} at ${dateFormat(assignments[0].dateline, " h:MM TT, mmmm dS")}`);
                }else {
                    let course = await Courses.findOne({
                        title: {
                            '$regex': agent.parameters.specificCourse.substr(0, 7),
                            '$options': 'i'
                        }
                    }).select('title _id');
                    if (course != null){
                        let classes = await Classes.findOne({
                            course: {$in: course._id},
                            _id: {$in: user.classes}
                        }).select('name');
                    if (classes !== null) {
                        let assignments = await Assignments.find({class: {$in: classes._id}, dateline: {'$gte': now}}).sort({dateline: 1});
                        if (assignments.length>1) {
                            agent.add(`You have ${assignments.length} upcoming assignments in ${course.title.substr(8)}.`+
                                ` The closest one is ${assignments[0].name} at ${dateFormat(assignments[0].dateline, " h:MM TT, mmmm dS")}`);
                        } else if(assignments.length===1){
                            agent.add(`You have only one thing scheduled for this this class. It is the ${assignments[0].name} at ${dateFormat(assignments[0].dateline, " h:MM TT, mmmm dS")}`);
                        } else if(assignments.length===0){
                            agent.add(`You don't have any upcoming assignment in ${course.title.substr(8)}.`);
                        }
                    } else {
                        agent.add(`Excuse me, but you can't ask for classes you're not enrolled.`);
                    }
                }else{
                        agent.add(`I don't think we offer a class regarding this subject in the first place.`);
                    }
                }
            }
        }

        async function assignmentGrade(agent) {

            let user = await checkLogged();

            if(user!=null) {

                let course = await Courses.findOne({
                    title: {
                        '$regex': agent.parameters.specificCourse.substr(0, 7),
                        '$options': 'i'
                    }
                }).select('title _id');

                let classes = await Classes.findOne({
                    course: {$in: course._id},
                    _id: {$in: user.classes}
                });

                if (classes !== null) {

                        let assignments = await Assignments.findOne({
                            class: {$in: classes._id},
                            name: {$regex: agent.parameters.specificAssignment, '$options': 'i'}
                        }).sort({dateline: 1});

                        if (assignments !== null) {


                        let marked_grade = '';


                        if (assignments.grades !== undefined && assignments.grades.length !== 0) {
                            assignments.grades.forEach(grade => {
                                if (grade.student.toString() === user._id.toString()) {
                                    marked_grade = grade.value;
                                }
                            });
                            agent.add(`Your grade ${assignments.name} is ${marked_grade}.`);
                        } else {

                            agent.add(`There isn't a grade yet.`);

                        }
                        }else{
                            agent.add(`I can't find this assignment in the ${course.title.substr(8)} class.`)
                        }
                    } else {

                        agent.add(`Excuse me, but you can't ask for classes you're not enrolled.`);
                    }
            }
        }

        async function assignmentDateTime(){
            let user = await checkLogged();

            if(user!=null) {

                let course = await Courses.findOne({
                    title: {
                        '$regex': agent.parameters.specificCourse.substr(0, 7),
                        '$options': 'i'
                    }
                }).select('title _id');

                let classes = await Classes.findOne({
                    course: {$in: course._id},
                    _id: {$in: user.classes}
                });

                if (classes !== null) {

                    let assignments = await Assignments.findOne({
                        class: {$in: classes._id},
                        name: {$regex: agent.parameters.specificAssignment, '$options': 'i'}
                    }).sort({dateline: 1});

                    if (assignments !== null) {

                        agent.add(`${assignments.name} is scheduled at ${dateFormat(assignments.dateline, " h:MM TT, mmmm dS")}.`);

                    }else{
                        agent.add(`I can't find this assignment in the ${course.title.substr(8)} class.`)
                    }
                } else {

                    agent.add(`Excuse me, but you can't ask for classes you're not enrolled.`);
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

        intentMap.set('AssignmentGrade', assignmentGrade);

        intentMap.set('AssignmentDateTime', assignmentDateTime);

        await agent.handleRequest(intentMap);

    });
};