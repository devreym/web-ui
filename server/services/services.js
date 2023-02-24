const { psURL } = require('../configs/configs');
const url = require('url');
const unirest = require('unirest');

module.exports = () => {
    global.verifyToken = (xat, returnURL) => new Promise((resolve, reject) => {
        unirest('POST', psURL + '/token/verify')
        .headers({ 'Content-Type': 'application/json' })
        .send(JSON.stringify({ xat, returnURL }))
        .end(result => {
            resolve(result);
        });
    });

    global.appMiddleware = {
        preHandler: async (req, res) => {
            let { xat, referer } = req.headers;
            let returnURL = url.parse(referer);
            returnURL.search = '';
            returnURL.query = '';
            returnURL.pathname = returnURL.pathname.replace(/\/\//g, '/');
            delete returnURL.href;
            delete returnURL.path;
            
            let { error, body } = await verifyToken(xat, url.format(returnURL));
            if(error) {
                setRM(false, {
                    message: 'We\'re unable to process your request this time.'
                }, model => {
                    res.send(model);
                });
            } else {
                body.auth = body.success;
                if(body.success) {
                    res.header('xat', body.result.xat);
                    return;
                } else {
                    setRM(false, body, model => {
                        res.send(model);
                    });
                }
            }
        }
    };

    global.successModel = {
        success: true,
        message: 'Successfully processed the request.',
        result: {}
    };

    global.failModel = {
        success: false,
        message: 'Error encountered while processing request.',
        result: {}
    };

    global.setRM = (success, data = {}, cb) => {
        let responseModel = {
            success,
            message: success ? 'Successfully processed the request.' : 'Error encountered while processing request.',
            result: {},
            ...data
        };

        success ? successModel = responseModel : failModel = responseModel;
        cb && cb(responseModel);
    };
};