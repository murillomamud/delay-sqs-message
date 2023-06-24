
const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

async function createRole(){
    console.log('creating role')
    const iam = new AWS.IAM({ apiVersion: '2010-05-08', endpoint: process.env.ENDPOINT, sslEnabled: false, region: 'us-east-1' });
    const params = {
        AssumeRolePolicyDocument: JSON.stringify(require('./policie.json')),
        RoleName: 'state-machine-role',
    };
    
    const result = await iam.createRole(params).promise();
    console.log(`Role Created: ${JSON.stringify(result.Role.Arn)}`);
    return result.Role.Arn;
}

module.exports = {
    createRole,
}