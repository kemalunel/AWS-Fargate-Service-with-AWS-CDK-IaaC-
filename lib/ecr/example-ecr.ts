import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { aws_ecr } from 'aws-cdk-lib';

export class ExampleEcrStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);



const ecr = new aws_ecr.Repository(this,'CutieECR',{
    repositoryName: 'cutie-putie',
});

new CfnOutput(this,'CutieeEcrArn',{
    exportName: "CutieeEcrArn",
    value: ecr.repositoryArn

});

new CfnOutput(this,'CutieEcrName',{
  exportName: "CutieEcrName",
  value: ecr.repositoryName

});

  }
}
