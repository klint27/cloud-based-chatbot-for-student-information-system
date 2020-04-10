const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/keys');
const mongoose = require('mongoose');
//Required for login
const passport = require("passport");

const app = express();

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

//Connect to database
mongoose.connect(config.mongoURI, {useUnifiedTopology: true, useNewUrlParser: true}).then(() => console.log("MongoDB successfully connected"));

//Connection to dialogFlow
require('./routes/dialogFlowRoutes')(app);

//Connection to fulfillment
require('./routes/fulfillmentRoutes')(app);

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes to user authentication
require("./routes/users")(app);

//Routes to data access
require("./routes/data")(app);

//Values change between development and production
if (process.env.NODE_ENV === 'production') {
    // js and css files
    app.use(express.static('client/build'));

    // index.html for all page routes
    const path = require('path');

    app.get('*', (req, res) => {

        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
