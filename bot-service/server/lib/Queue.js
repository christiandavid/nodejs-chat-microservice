const amqplib = require('amqplib');

const queue = 'botParse';
const queueReply = 'botReply';

class Queue {
  constructor({ log }, queueProcessing) {
    this.log = log();
    this.queueProcessing = queueProcessing;
    this.msgBroker = false;
  }

  init() {
    if (this.msgBroker === false) {
      this.msgBroker = amqplib
        .connect(process.env.RABBITMQ_HOST)
        .then(conn => conn.createChannel());
    }
    return this.msgBroker;
  }

  send(status, user, room, message) {
    const qmsg = JSON.stringify({
      status,
      user,
      room,
      message,
    });

    this.init()
      .then(channel2 =>
        channel2.assertQueue(queueReply).then(() => {
          channel2.sendToQueue(queueReply, Buffer.from(qmsg, 'utf8'));
          this.log.debug(`Reply: ${message}`);
        })
      )
      .catch(err => this.log.fatal(err));
  }

  check() {
    this.init()
      .then(channel =>
        channel.assertQueue(queue).then(() =>
          channel.consume(queue, msg => {
            if (msg !== null) {
              this.log.debug(`Got message ${msg.content.toString()}`);
              const qm = JSON.parse(msg.content.toString());
              const { user, room, message } = qm;
              this.queueProcessing
                .processQueue(message)
                .then(data => {
                  if (data) {
                    let status = 0;
                    let returnMsg = '';
                    switch (typeof data) {
                      case 'object':
                        // Success
                        status = 200;
                        returnMsg = `${data.Symbol} quote is $${data.Close} per share`;
                        break;
                      case 'string':
                        // Error
                        status = 500;
                        returnMsg = data;
                        break;
                      case 'number':
                        status = 404;
                        returnMsg =
                          "I can't find anything with the specified code";
                        break;
                      default:
                        break;
                    }
                    this.send(status, user, room, returnMsg);
                  }
                })
                .finally(() => {
                  channel.ack(msg);

                  setTimeout(() => {
                    this.check();
                  }, 1e3);
                });
            }
          })
        )
      )
      .catch(err => this.log.fatal(err));
  }
}

module.exports = Queue;
