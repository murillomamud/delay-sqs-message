const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

async function createStateMachine(roleArn) {

    console.log('creating state machine')
    const stepFunctions = new AWS.StepFunctions({
        endpoint: process.env.ENDPOINT,
        sslEnabled: false,
        region: 'us-east-1',
    });

    const paramsCreateStateMachine = {
        definition: JSON.stringify(require('./state-machine.json')),
        name: 'state-machine',
        roleArn: roleArn,
    };

    const resultCreateStateMachine = await stepFunctions.createStateMachine(paramsCreateStateMachine).promise();
    console.log(`State Machine Created: ${resultCreateStateMachine}`);

    return { machineArn: resultCreateStateMachine.stateMachineArn, stepFunctions }
}

async function sendMessageToStateMachine(machineArn, message, stepFunctions) {
    console.log('sending message to state machine')

    const paramsMessageStateMachine = {
        stateMachineArn: machineArn,
        input: JSON.stringify({ message: message })
    };

    const resultStepFunction = await stepFunctions.startExecution(paramsMessageStateMachine).promise();

    console.log(resultStepFunction);

    return resultStepFunction;
}

module.exports = {
    createStateMachine,
    sendMessageToStateMachine,
}
