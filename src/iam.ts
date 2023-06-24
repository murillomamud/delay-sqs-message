import { IAM } from 'aws-sdk';
import { config } from 'dotenv';

const policie = require('./policie.json');

const logger = console;

config();

export async function createRole(): Promise<string> {
  logger.log('creating role');

  const iam = new IAM({
    apiVersion: '2010-05-08',
    endpoint: process.env.ENDPOINT,
    sslEnabled: false,
    region: 'us-east-1'
  });

  const params = {
    AssumeRolePolicyDocument: JSON.stringify(policie),
    RoleName: 'state-machine-role',
  };

  const result = await iam.createRole(params).promise();
  logger.log(`Role Created: ${JSON.stringify(result.Role.Arn)}`);
  return result.Role.Arn;
}
