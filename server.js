var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.set('port',process.env.PORT || 5454);
app.locals.title = 'Health 4 life';



app.get('/', (req, res) => {
    res.send('Health 4 Life API');
});

// define routes
app.use('/api/user',require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/areas', require('./routes/area'));
app.use('/api/sites', require('./routes/sites'));
app.use('/api/districts', require('./routes/district'));
app.use('/api/surveys', require('./routes/surveys'));


app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});