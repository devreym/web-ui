const controller = require('../controllers/main.controller');

module.exports = app => {
    app.post('/api/calendar/event/get', (req, res) => {
        console.log('Routes');
        controller.getEvents(req.body, cb => {
            res.send(cb ? successModel : failModel);
        });
    });
};