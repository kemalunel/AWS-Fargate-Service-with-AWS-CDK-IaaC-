import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { 
    aws_s3
} from 'aws-cdk-lib';
import { getConfig } from '../config';

export class FinalprojectStackBucket extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const conf = getConfig(scope);

    const bucket = new aws_s3.Bucket(this,'FinalprojectBucket',{
        bucketName: `${conf.account}-${conf.region}-finalproject-env-services`,
        blockPublicAccess: {
            blockPublicAcls: true,
            blockPublicPolicy: true,
            ignorePublicAcls: true,
            restrictPublicBuckets: true
        }
    });

    new CfnOutput(this,'FinalprojectBucketARN',{
        exportName: 'FinalprojectBucketARN',
        value: bucket.bucketArn
    });

    new CfnOutput(this,'FinalprojectBucketName',{
        exportName: 'FinalprojectBucketName',
        value: bucket.bucketName
    });

  }
}
