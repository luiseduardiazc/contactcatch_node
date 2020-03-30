const amqp = require('amqplib');
const uuid = require('uuid-random');

const CONN_URL = 'amqp://csrotcjc:orE5mCMIUgnSSPP4eBe2Moi4kb-mG05G@beaver.rmq.cloudamqp.com/csrotcjc';

let ch = null;

async function connect () {
  try {
    const connection = await amqp.connect(CONN_URL);
    const channel = await connection.createChannel();
    return channel;
  } catch (error) {
    console.log(error);
  }
}

async function publishToQueue (queueName, data) {
  //if (!ch) { ch = await connect(); }
  ch = await connect()
  data.task_id = uuid();
  ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  ch.close()
  return data.task_id;
}

process.on('exit', (code) => {
  if (ch) { ch.close(); }
  console.log('Closing rabbitmq channel publisher');
});

process.on('error', (code) => {
  if (ch) {ch.close(); }
  console.log('On error closing rabbitmq channel publisher')
})

module.exports = {
  publishToQueue
};
