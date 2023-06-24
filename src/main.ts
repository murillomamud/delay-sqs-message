import { Chance } from 'chance';
import { expect } from 'expect';
import { createRole } from './iam';
import { createQueue, receiveMessage } from './sqs';
import { createStateMachine, sendMessageToStateMachine } from './state-machine';
import { MessageBody } from './types';

const logger = console;
const chance = new Chance();

async function main() {
  let status = '';

  const reponseFromQueue = await createQueue();

  if (!reponseFromQueue?.queueURL) {
    throw new Error('Error creating queue');
  }

  const roleArn = await createRole();
  const responseFromCreateStateMachine = await createStateMachine(roleArn);

  if (!responseFromCreateStateMachine?.machineArn) {
    throw new Error('Error creating state machine');
  }

  const message = {
    [chance.word()]: chance.animal(),
    [chance.word()]: chance.animal(),
    [chance.word()]: chance.animal(),
  };

  const resultStepFunction = await sendMessageToStateMachine(
    responseFromCreateStateMachine.machineArn,
    message,
    responseFromCreateStateMachine.stepFunctions,
  );

  const paramsExec = {
    executionArn: resultStepFunction.StartExecutionOutput.executionArn,
  };

  do {
    // eslint-disable-next-line no-await-in-loop
    const resultDescribeExecution = await resultStepFunction
      .stepFunctions
      .describeExecution(paramsExec)
      .promise();

    status = resultDescribeExecution.status;
    logger.log(resultDescribeExecution);

    // eslint-disable-next-line no-await-in-loop, no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 10000));
  } while (status !== 'SUCCEEDED' && status !== 'FAILED');

  const resultReceiveMessage = await receiveMessage(status, reponseFromQueue);

  if (!resultReceiveMessage?.Messages?.[0]) {
    throw new Error('Error receiving message');
  }

  const messageBody = JSON.parse(
    resultReceiveMessage?.Messages?.[0].Body || '{}',
  ) as MessageBody;

  if (!messageBody?.message) {
    throw new Error('Error parsing message body');
  }

  expect(messageBody?.message).toEqual(message);
  expect(status).toEqual('SUCCEEDED');
}

main()
  .then(() => logger.log('done'))
  .catch((error) => logger.error(error));
