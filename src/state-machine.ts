import { StepFunctions } from 'aws-sdk';
import { StartExecutionOutput } from 'aws-sdk/clients/stepfunctions';
import { config } from 'dotenv';
import {
  CreateStateMachineResponse,
  Message,
  SendMessageToStateMachineResponse,
} from './types';

const stateMachine = {
  Comment: 'A description of my state machine',
  StartAt: 'Wait',
  States: {
    Wait: {
      Type: 'Wait',
      Seconds: 10,
      Next: 'SQS SendMessage',
    },
    'SQS SendMessage': {
      Type: 'Task',
      Resource: 'arn:aws:states:::sqs:sendMessage',
      Parameters: {
        'MessageBody.$': '$',
        QueueUrl: 'https://localhost:4566/000000000000/test-queue',
      },
      End: true,
    },
  },
};

const logger = console;

config();

export async function createStateMachine(
  roleArn: string,
): Promise<CreateStateMachineResponse | null> {
  logger.log('creating state machine');
  const stepFunctions = new StepFunctions({
    endpoint: process.env.ENDPOINT,
    sslEnabled: false,
    region: 'us-east-1',
  });

  const paramsCreateStateMachine = {
    definition: JSON.stringify(stateMachine),
    name: 'state-machine',
    roleArn,
  };

  const resultCreateStateMachine = await stepFunctions
    .createStateMachine(paramsCreateStateMachine)
    .promise();

  logger.log(
    `State Machine Created: ${resultCreateStateMachine.stateMachineArn}`,
  );

  return {
    machineArn: resultCreateStateMachine.stateMachineArn,
    stepFunctions,
  };
}

export async function sendMessageToStateMachine(
  machineArn: string,
  messageToStateMachine: Message,
  stepFunctions: StepFunctions,
): Promise<SendMessageToStateMachineResponse> {
  logger.log('sending message to state machine');

  const paramsMessageStateMachine = {
    stateMachineArn: machineArn,
    input: JSON.stringify({ message: messageToStateMachine }),
  };

  const resultStepFunction = (await stepFunctions
    .startExecution(paramsMessageStateMachine)
    .promise()) as StartExecutionOutput;

  logger.log(resultStepFunction);

  return { StartExecutionOutput: resultStepFunction, stepFunctions };
}
