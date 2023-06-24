import { AWSError, StepFunctions } from 'aws-sdk';
import { StartExecutionOutput } from 'aws-sdk/clients/stepfunctions';
import { createStateMachineResponse, message, sendMessageToStateMachineResponse } from './types';

const dotenv = require('dotenv');
const stateMachine = require('./state-machine.json');

const logger = console;

dotenv.config();

export async function createStateMachine(roleArn: string): Promise<createStateMachineResponse | null> {
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

  const resultCreateStateMachine = await stepFunctions.createStateMachine(paramsCreateStateMachine).promise();
  logger.log(`State Machine Created: ${resultCreateStateMachine}`);

  return { machineArn: resultCreateStateMachine.stateMachineArn, stepFunctions };
}

export async function sendMessageToStateMachine(machineArn: string, message: message, stepFunctions: StepFunctions): Promise<sendMessageToStateMachineResponse> {
  logger.log('sending message to state machine');

  const paramsMessageStateMachine = {
    stateMachineArn: machineArn,
    input: JSON.stringify({ message }),
  };

  const resultStepFunction = await stepFunctions.startExecution(paramsMessageStateMachine).promise() as StartExecutionOutput;

  logger.log(resultStepFunction);

  return {StartExecutionOutput: resultStepFunction, stepFunctions};
}


