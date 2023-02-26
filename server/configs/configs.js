
const path = require('path');
const fs = require('fs');
var config = {}
config.port =  process.env.PORT || 8080;
config.caledarAPIURL= process.env.GOOGLE_CALENDAR_API || 'https://rm-booking-system-test.df.r.appspot.com'


config.addRoutes = (app) => {
    var rootFolder = path.dirname(require.main.filename);
    var apiRoutes = [];
    var routePath = path.join(rootFolder, 'routes');
    if(fs.existsSync(routePath)) {
        apiRoutes = fs.readdirSync(routePath);
    }
    apiRoutes.forEach((file) => {
        require('../routes/' + file)(app);
    });
}


module.exports = config;