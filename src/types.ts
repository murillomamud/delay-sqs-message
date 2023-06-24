import type { SQS } from "@aws-sdk/client-sqs";
import type { AWSError, StepFunctions } from "aws-sdk";
import { StartExecutionOutput } from "aws-sdk/clients/stepfunctions";

export type createQueueResponse = {
    queueURL: string | undefined;
    sqsSession: SQS;
}

export type createStateMachineResponse = {
    machineArn: string | undefined;
    stepFunctions: StepFunctions;
}

export type message = {
    [key: string]: string;
}

export type sendMessageToStateMachineResponse = {
    StartExecutionOutput: StartExecutionOutput;
    stepFunctions: StepFunctions;
}