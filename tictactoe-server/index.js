var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
require('dotenv').config();

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(cors());

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

require('./matches.js')(app);
require('./bot.js')(app);