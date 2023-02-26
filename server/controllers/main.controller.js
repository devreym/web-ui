
const { 
    caledarAPIURL
} = require('../configs/configs');
const unirest = require('unirest')
const path = require('path');

exports.getEvents = (requestBody, callback) => {
    try {
        unirest('POST', caledarAPIURL + '/api/calendar/event/get')
        .strictSSL(false)
        .headers({ 'Content-Type': 'application/json' })
        .send(requestBody)
        .end(({ error, body }) => {
            if(error) {
                setRM(false, { result: error });
                callback(false);
            } else {
                if(body.success) {
                    setRM(true, { result: body.result });
                    callback(true);
                } else {
                    setRM(false, { result: body.result });
                    callback(false);
                }
            }
        });
    } catch(e) {
        console.log('error ' , e)
        setRM(false, { result: e });
        callback(false);
    }
};

exports.createEvent = (requestBody, callback) => {
    try {
        unirest('POST', caledarAPIURL + '/api/calendar/event/create')
        .strictSSL(false)
        .headers({ 'Content-Type': 'application/json' })
        .send(requestBody)
        .end(({ error, body }) => {
            if(error) {
                setRM(false, { result: error });
                callback(false);
            } else {
                if(body.success) {
                    setRM(true, { result: body.result });
                    callback(true);
                } else {
                    setRM(false, { result: body.result });
                    callback(false);
                }
            }
        });
    } catch(e) {
        console.log('error ' , e)
        setRM(false, { result: e });
        callback(false);
    }
};

