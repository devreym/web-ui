const { port, production } = require('./configs/configs');
const path = require('path');
const fastify = require('fastify')({ logger: true, bodyLimit: 52428800 });
require('./services/services')();

if(production) {
  fastify.register(require('fastify-static'), {
    root: path.resolve(__dirname, '../build/')
  });

  fastify.register((instance, options, done) => {
    instance.setNotFoundHandler((req, res) => {
      res.sendFile('index.html', path.resolve(__dirname, '../build/'));
    });
    done();
  }, { prefix: '/' });
}

require('./routes/main.routes')(fastify);

fastify.listen(port, '::', (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    
});