const { SQS } = require('@aws-sdk/client-sqs');
const dotenv = require('dotenv');

const logger = console;

dotenv.config();

async function createQueue() {
  logger.log('creating SQS');
  const sqsSession = new SQS({ apiVersion: '2012-11-05', endpoint: process.env.AWS_SQS_ENDPOINT || 'http://localstack:4566' });
  const sqsName = 'test-queue';

  const queueURL = await sqsSession.createQueue({ QueueName: sqsName }).then((data) => data.QueueUrl);
  logger.log(`SQS Created: ${queueURL}`);
  return { queueURL, sqsSession };
}

async function receiveMessage(status, queueURL, sqs) {
  if (status === 'SUCCEEDED') {
    const paramsReceiveMessage = {
      QueueUrl: queueURL,
      MaxNumberOfMessages: 1,
      VisibilityTimeout: 0,
      WaitTimeSeconds: 0,
    };

    const resultReceiveMessage = await sqs.receiveMessage(paramsReceiveMessage);
    return resultReceiveMessage;
  }

  return null;
}

module.exports = {
  createQueue,
  receiveMessage,
};
