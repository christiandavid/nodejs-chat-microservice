const amqplib = require('amqplib');

const queue = 'botParse';
const queueReply = 'botReply';

class Queue {
  constructor({ log }, nsp) {
    this.log = log();
    this.nsp = nsp;
    this.msgBroker = false;
  }

  init() {
    if (this.msgBroker === false) {
      this.msgBroker = amqplib
        .connect(process.env.RABBITMQ_HOST)
        .then(conn => conn.createChannel())
        .catch(err => this.log.fatal(err));
    }
    return this.msgBroker;
  }

  send(user, room, message) {
    this.init()
      .then(channel =>
        channel.assertQueue(queue).then(() => {
          const qmsg = JSON.stringify({ user, room, message });
          channel.sendToQueue(queue, Buffer.from(qmsg, 'utf8'));
          this.log.debug(`Message Sent ${qmsg}`);
        })
      )
      .catch(err => this.log.fatal(err));
  }

  check() {
    this.init()
      .then(channel =>
        channel.assertQueue(queueReply).then(() =>
          channel.consume(queueReply, msg => {
            if (msg !== null) {
              this.log.debug(`Got reply ${msg.content.toString()}`);
              const qm = JSON.parse(msg.content.toString());
              const { status, user, room, message } = qm;

              let emitTo = '';
              switch (status) {
                case 500:
                  emitTo = 'botnotcommand';
                  break;
                case 404:
                  emitTo = 'botnotfound';
                  break;
                default:
                  emitTo = 'botreply';
                  break;
              }
              this.nsp.in(room).emit(emitTo, { username: user, message });
              channel.ack(msg);
              setTimeout(() => {
                this.check();
              }, 1e3);
            }
          })
        )
      )
      .catch(err => this.log.fatal(err));
  }
}

module.exports = Queue;
