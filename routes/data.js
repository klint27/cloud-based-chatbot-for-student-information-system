const mongoose = require('mongoose');
const Majors = require('../models/Majors');
const Courses = require('../models/Courses');
const Classes = require('../models/Classes');
const Assignments = require('../models/Assignments');
const Events = require('../models/Events');
const User = require('../models/User');


module.exports = app => {

    /*
    app.post('/api/eventupdate', async (req, res) => {
        Events.update({"title": {$regex: "MAT"}}, {$set: {"image": ''}})
            .then(course => {
                if (!course) {
                    return res.status(404).json({coursenotfound: "course not found"});
                }
                res.json(course);
            });
    });
     */

/*
    const newCourse = new event({
        image: {
            data : fs.readFileSync(__dirname+ "\\Banner_Stipendien.jpg"),
            contentType : 'image/jpeg'
        },
        title: "AUBG MegaReunion 2020",
        description: "25 years ago, the first AUBG class graduated the place that would become the one to meet friends, party wild, sometimes study, drink like crazy, have fun and build memories for 24 more classes to come until this year we can celebrate the BIG 25! It is going to be huge…, no, scratch that, it is going to be MASSIVE! 25 years of classes coming back to AUBG! There will be a rich and exclusive program for all AUBG Alumni: More-Honors, Alumni Challenge, Musical Performances, Underground parties, Outdoor activities and more! All these packed into only four days",
        date: new Date("2020-05-25T15:00:00.000Z"),
        location: ''
    });
    newCourse.save().then(user => res.json(user));
*/

    /*
                    const title= req.body.title;
                    event.findOne({title:"European Forum Alpbach Scholarship Opportunity"}).then(course => {
                        if (!course) {
                            return res.status(404).json({coursenotfound: "course not found"});
                        }
                       res.json(course);
                    });

          });
    */

    app.post('/api/majors', async (req, res) => {
        const select=req.body.select;
        Majors.find().select(select).then( major =>{
            if (!major) {
                return res.status(404).json({majornotfound: "major not found"});
            }
            res.json(major);
        });
    });

    app.post('/api/courses', async (req, res) => {
        Courses.find().then( course =>{
            if (!course) {
                return res.status(404).json({coursenotfound: "course not found"});
            }
            res.json(course);
        });
    });

    app.post('/api/events', async (req, res) => {
        const now = new Date();
        const select=req.body.select;
        const limit=parseInt(req.body.limit);
        Events.find(
            {
                date: {
                    $gte: now
                }
            }
        ).select(select).sort({date: -1}).limit(limit).then( event =>{
            if (!event) {
                return res.status(404).json({eventnotfound: "event not found"});
            }
            res.json(event);
        });
    });

    app.post('/api/classes&assignments', async (req, res) => {

        const user_id=req.body.user_id;

        let user_classes= [];
        User.find({
            _id : mongoose.Types.ObjectId(user_id)
        }).then( user => {
            user[0].classes.forEach(element =>
                user_classes.push(
                    element
                )
            );

            Classes.find(
                {
                    _id : { $in : user_classes}
                }
            ).then( classes =>{
                if (!classes) {
                    return res.status(404).json({classnotfound: "class not found"});
                }

                let classes_id=[];

                classes.forEach(element =>
                    classes_id.push(
                        element._id
                    )
                );

                Assignments.find({
                    class : { $in : classes_id }
                }).then( assignment =>{
                    if (!assignment) {
                        return res.status(404).json({assignmentnotfound: "assignment not found"});
                    }
                    res.json({classes: classes, assignments: assignment});
                });

                /*
                classes.forEach(element =>
                console.log(element._id)
                );
                 */
            });
        });
    });

    app.post('/api/class', async (req, res) => {

        const class_name = req.body.className;


        Classes.find(
            {
                name : { $in : class_name}
            }
        ).then( classes => {
            if (!classes) {
                return res.status(404).json({classnotfound: "class not found"});
            }
            Courses.find(
                {
                    _id : { $in : classes[0].course}

                }
            ).select('description -_id').then( course =>{
                if (!course) {
                    return res.status(404).json({coursenotfound: "course not found"});
                }
                course
            });

            res.json({class: classes, course: course});

        })
    })

};