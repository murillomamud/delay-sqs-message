const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const policie = require('./policie.json');

const logger = console;

dotenv.config();

async function createRole() {
  logger.log('creating role');
  const iam = new AWS.IAM({
    apiVersion: '2010-05-08', endpoint: process.env.ENDPOINT, sslEnabled: false, region: 'us-east-1',
  });
  const params = {
    AssumeRolePolicyDocument: JSON.stringify(policie),
    RoleName: 'state-machine-role',
  };

  const result = await iam.createRole(params).promise();
  logger.log(`Role Created: ${JSON.stringify(result.Role.Arn)}`);
  return result.Role.Arn;
}

module.exports = {
  createRole,
};
