
const lambdaLocal = require('lambda-local');

//        var Module = require('module');
/*        var originalRequire = Module.prototype.require;
        Module.prototype.require = function(){
          if (arguments[0] === 'aws-sdk'){
            return AWS;
          } else {
            return originalRequire.apply(this, arguments);
          }
        };        
        var lambda = require('../src/index.js');
        var event = require('./input.json');
        var context = require ('./context.json');
        lambda.handler(event, context);
  */
        var event = require('./input.json');

   lambdaLocal.execute({
    event: event,
    lambdaPath:'src/index.js',
    callback: function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    }
});