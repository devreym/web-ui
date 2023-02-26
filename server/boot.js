const bodyParser = require('body-parser');
const express = require('express')
const app = express();
const config = require('./configs/configs');
const path = require('path');
app.use(express.static(path.join(__dirname,"../build")));
require('./services/services')();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.text({ type: 'text/plain' }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://booking-system-demo-379009.df.r.appspot.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('dist'));

config.addRoutes(app);
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(config.port|| 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
