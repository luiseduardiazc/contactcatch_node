const amqp = require('amqplib');
const facebookScraping = require('../utilities/scrapFacebook');
const exportToCsv = require('../utilities/exportToCsv')

const CONN_URL = 'amqp://csrotcjc:orE5mCMIUgnSSPP4eBe2Moi4kb-mG05G@beaver.rmq.cloudamqp.com/csrotcjc';

async function connect() {
    try {
        const connection = await amqp.connect(CONN_URL || 'amqp://localhost:5672');
        const channel = await connection.createChannel();
        await channel.assertQueue('job_scraping');

        channel.consume('job_scraping', async message => {
            const input = JSON.parse(message.content.toString());
            console.log('task id: ' + input.task_id);
            const response = await facebookScraping.doScraping(input.url);
            let fileName = null
            if (response.status === "OK")
                fileName = await exportToCsv.createFile(input.url, response.data)
            console.log(fileName)
            // dequeue
            channel.ack(message);
        });
        console.log('RabbitMQ Waiting for messages ...');
    } catch (error) {
        console.log('MQConsumer error: ' + error);
    }
}


module.exports = {
    connect
};
