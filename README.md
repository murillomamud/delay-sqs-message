# Using AWS Step Functions/State Machines to delay SQS Deliver Messages

Imagine you need to delay a SQS message for more than the 15 minutes allowed by AWS. Using State Machines, you can set the delay you want and then deliver the message to the SQS queue.

## How it works

Your application send a message to the State Machine that will receive the message and then wait for the time you set. After that, it will deliver the message to the SQS queue.

## How to use

```bash
npm run integration
```

### Change the delay

In file `state-machine.ts` change the value of `seconds` property to the time you want in variable stateMachine.