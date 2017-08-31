'use strict';

const MessageModel = require('./models/messages.model');

module.exports = io => {
  io.on('connection', function (socket) {
    socket.emit('connected', 'Yeah');

    socket.join('all');

    socket.on('msg', content => {
      const message = {
        date: Date.now(),
        content: content,
        username: socket.id,
      }
      MessageModel.create(message, err => {
        if (!err) {
          socket.emit('message', message);
          socket.to('all').emit('message', message);
        } else {
          throw new Error(err);
        }
      });
    })

    socket.on('receiveHistory', () => {
      MessageModel
      .find({})
      .sort({date: -1})
      .limit(50)
      .sort({date: 1})
      .lean()
      .exec((err, messages)=>{
        if(!err){
          socket.emit('history', messages);
          //socket.to('all').emit('hitory');//?????
        }
      })
    })
  })
}