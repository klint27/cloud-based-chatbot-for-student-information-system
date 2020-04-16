const Majors = require('../models/Majors');
const Courses = require('../models/Courses');
const Classes = require('../models/Classes');
const Assignments = require('../models/Assignments');
const Events = require('../models/Events');
const User = require('../models/User');

module.exports = app => {

    app.post('/api/majors', async (req, res) => {
        const select=req.body.select;
        await Majors.find().select(select).then( major =>{
            if (!major) {
                return res.status(404).json({majornotfound: "major not found"});
            }
            res.json(major);
        });
    });

    app.post('/api/courses', async (req, res) => {
        await Courses.find().then( course =>{
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
        await Events.find(
            {
                date: {
                    $gte: now
                }
            }
        ).select(select).sort({date: 1}).limit(limit).then( event =>{
            if (!event) {
                return res.status(404).json({eventnotfound: "event not found"});
            }
            res.json(event);
        });
    });

    app.post('/api/classes&assignments', async (req, res) => {

        const user_id=req.body.user_id;

        await User.findOne({
            _id : {$in: user_id}
        }).then( user => {

            Classes.find(
                {
                    _id : { $in : user.classes}
                }
            ).then( classes =>{

                if (!classes) {
                    return res.status(404).json({classnotfound: "class not found"});
                }

                Assignments.find({
                    class : { $in : user.classes }
                }).then( assignment =>{

                    if (!assignment) {
                        return res.status(404).json({assignmentnotfound: "assignment not found"});
                    }

                    Majors.find({
                        _id : { $in : user.major}
                    }).select('name').then(majors =>{
                        if (!majors) {
                            return res.status(404).json({majornotfound: "major not found"});
                        }

                        res.json({classes: classes, assignments: assignment, user: user, majors:majors});
                    });
                });
            });
        });
    });

};