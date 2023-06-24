import { IAM } from 'aws-sdk';
import { config } from 'dotenv';

const logger = console;

config();

export async function createRole(): Promise<string> {
  logger.log('creating role');

  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Action: ['sqs:SendMessage'],
        Resource: ['*'],
      },
    ],
  };

  const iam = new IAM({
    apiVersion: '2010-05-08',
    endpoint: process.env.ENDPOINT,
    sslEnabled: false,
    region: 'us-east-1',
  });

  const params = {
    AssumeRolePolicyDocument: JSON.stringify(policy),
    RoleName: 'state-machine-role',
  };

  const result = await iam.createRole(params).promise();
  logger.log(`Role Created: ${JSON.stringify(result.Role.Arn)}`);
  return result.Role.Arn;
}
