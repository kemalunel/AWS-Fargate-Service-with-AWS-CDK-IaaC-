# Welcome to My CDK TypeScript project

This is a AWS ECS Fargate project for CDK development with TypeScript.
All service seperated one by one from each other. They are inside the lib file.

Following Sercices, which are include in the lib file:
- VPC
- ECR
- SSM
- ECS
- FARGATE
- CLOUDWATCH

PS. Some files have high construct on their code.

## Architecture both of AWS ECS Fargate and Project

<img width="802" alt="image" src="https://user-images.githubusercontent.com/35941394/176315524-c2689dc0-c741-4acc-a6c4-74ea1af85259.png">

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template


