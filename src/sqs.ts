import type { createQueueResponse } from './types';
import { SQS } from '@aws-sdk/client-sqs';
import type { ReceiveMessageCommandOutput } from '@aws-sdk/client-sqs';
import { config } from 'dotenv';

const logger = console;

config();

export async function createQueue(): Promise<createQueueResponse | null>  {
  logger.log('creating SQS');
  const sqsSession = new SQS({ 
    apiVersion: '2012-11-05', 
    endpoint: process.env.AWS_SQS_ENDPOINT || 'http://localstack:4566' 
  });
  const sqsName = 'test-queue';

  const queueURL = await sqsSession.createQueue({ QueueName: sqsName }).then((data) => data.QueueUrl);
  logger.log(`SQS Created: ${queueURL}`);
  return { queueURL, sqsSession };
}

export async function receiveMessage(status: string, reponseFromQueue: createQueueResponse): Promise<ReceiveMessageCommandOutput | null> {
  if (status === 'SUCCEEDED') {
    const paramsReceiveMessage = {
      QueueUrl: reponseFromQueue.queueURL,
      MaxNumberOfMessages: 1,
      VisibilityTimeout: 0,
      WaitTimeSeconds: 0,
    };

    const resultReceiveMessage = await reponseFromQueue.sqsSession.receiveMessage(paramsReceiveMessage);
    return resultReceiveMessage;
  }

  return null;
}
