import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { aws_ecr } from 'aws-cdk-lib';

export class FinalprojectStackECR extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);



const ecr = new aws_ecr.Repository(this,'FinalprojectStackECR',{
    repositoryName: 'my-lovely-repo',
});

new CfnOutput(this,'FinalECRARN',{
    exportName: "FinalECRARN",
    value: ecr.repositoryArn

});

new CfnOutput(this,'FinalECRNAME',{
  exportName: "FinalECRNAME",
  value: ecr.repositoryName

});

  }
}
