const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const stateMachine = require('./state-machine.json');

const logger = console;

dotenv.config();

async function createStateMachine(roleArn) {
  logger.log('creating state machine');
  const stepFunctions = new AWS.StepFunctions({
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

async function sendMessageToStateMachine(machineArn, message, stepFunctions) {
  logger.log('sending message to state machine');

  const paramsMessageStateMachine = {
    stateMachineArn: machineArn,
    input: JSON.stringify({ message }),
  };

  const resultStepFunction = await stepFunctions.startExecution(paramsMessageStateMachine).promise();

  logger.log(resultStepFunction);

  return resultStepFunction;
}

module.exports = {
  createStateMachine,
  sendMessageToStateMachine,
};
