const controller = require('./main');

module.exports = function(http){
    var io = require('socket.io')(http);

    io.on('connection', function(socket){
        console.log('[socket.js] a user connected');
        controller.saveSocket({'socket': socket.id}, function(result){
            console.log('[socket.js] data saved')
        })
    });

    console.log('socket connection started');
};
