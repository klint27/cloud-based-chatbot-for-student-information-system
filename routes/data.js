const Majors = require('../models/Majors');
const Courses = require('../models/Courses');
const Classes = require('../models/Classes');
const Assignments = require('../models/Assignments');
const Events = require('../models/Events');

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

};