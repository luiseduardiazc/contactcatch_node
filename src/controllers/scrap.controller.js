const { publishToQueue } = require('../services/MQPublisher');

const scrap = async (req, res, next) => {
  const { url } = req.body;
  if (!url) {
    return res.status(404).send({
      status: false,
      error: {
        reason: 'Parameter url not found or empty',
        code: 404
      }
    });
  }

  const queueName = 'job_scraping';
  const payload = { url: url };
  const taskId = await publishToQueue(queueName, payload);

  res.status(200).send(JSON.stringify({
    message: 'Job in progress',
    task_id: taskId
  }));
};

module.exports = {
  scrap
};
