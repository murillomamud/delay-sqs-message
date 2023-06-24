import type { SQS } from '@aws-sdk/client-sqs';
import type { StepFunctions } from 'aws-sdk';
import { StartExecutionOutput } from 'aws-sdk/clients/stepfunctions';

export type CreateQueueResponse = {
  queueURL: string | undefined;
  sqsSession: SQS;
};

export type CreateStateMachineResponse = {
  machineArn: string | undefined;
  stepFunctions: StepFunctions;
};

export type Message = {
  [key: string]: string;
};

export type SendMessageToStateMachineResponse = {
  StartExecutionOutput: StartExecutionOutput;
  stepFunctions: StepFunctions;
};

export type MessageBody = {
  message: Message;
};
