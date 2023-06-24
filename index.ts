import { createRole } from './src/iam';
import { createQueue, receiveMessage } from './src/sqs';
import { createStateMachine, sendMessageToStateMachine } from './src/state-machine';
import type { createQueueResponse, createStateMachineResponse } from './src/types';
import type { ReceiveMessageCommandOutput, SQS } from '@aws-sdk/client-sqs';
import { StepFunctions } from 'aws-sdk';

const Chance = require('chance');
const { expect } = require('expect');



const logger = console;
const chance = new Chance();

async function main() {
  let status = '';

  const reponseFromQueue = await createQueue() as createQueueResponse;
  const roleArn = await createRole();
  const responseFromCreateStateMachine = await createStateMachine(roleArn) as createStateMachineResponse;

  const message = {
    [chance.word()]: chance.animal(),
    [chance.word()]: chance.animal(),
    [chance.word()]: chance.animal(),
  };

  const resultStepFunction = await sendMessageToStateMachine(responseFromCreateStateMachine.machineArn as string, message, responseFromCreateStateMachine.stepFunctions as StepFunctions);

  // check the status of the execution until it is finished
  const paramsExec = {
    executionArn: resultStepFunction.StartExecutionOutput.executionArn,
  };

  do {
    // eslint-disable-next-line no-await-in-loop
    const resultDescribeExecution = await resultStepFunction.stepFunctions.describeExecution(paramsExec).promise();
    status = resultDescribeExecution.status;
    logger.log(resultDescribeExecution);

    // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 10000));
  } while (status !== 'SUCCEEDED' && status !== 'FAILED');

  const resultReceiveMessage = await receiveMessage(status, reponseFromQueue) as ReceiveMessageCommandOutput;

  const messageResponse = resultReceiveMessage?.Messages[0]?.Body as string;
  const msgBody = ?.Body?.toString() as string;

  expect(JSON.parse(msgBody).message).toEqual(message);
}

main();
