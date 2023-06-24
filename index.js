const Chance = require('chance');
const { expect } = require('expect');
const { createQueue, receiveMessage } = require('./src/sqs');
const { createRole } = require('./src/iam');
const { createStateMachine, sendMessageToStateMachine } = require('./src/state-machine');

const chance = new Chance();

async function main() {
    let status = '';

    const { queueURL, sqsSession } = await createQueue();
    const roleArn = await createRole();
    const { machineArn, stepFunctions } = await createStateMachine(roleArn);

    const message = {
        [chance.word()]: chance.animal(),
        [chance.word()]: chance.animal(),
        [chance.word()]: chance.animal(),
    }

    const resultStepFunction = await sendMessageToStateMachine(machineArn, message, stepFunctions);

    //check the status of the execution until it is finished
    const paramsExec = {
        executionArn: resultStepFunction.executionArn
    }

    do {
        const resultDescribeExecution = await stepFunctions.describeExecution(paramsExec).promise();
        status = resultDescribeExecution.status;
        console.log(resultDescribeExecution);

        await new Promise((resolve) => setTimeout(resolve, 10000));

    } while (status !== 'SUCCEEDED' && status !== 'FAILED');    

    const resultReceiveMessage = await receiveMessage(status, queueURL, sqsSession);

    expect(JSON.parse(resultReceiveMessage.Messages[0].Body).message).toEqual(message);

}

main();