import { CfnOutput, Stack, StackProps, Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { aws_ecr,aws_ec2,aws_elasticloadbalancingv2,aws_ecs, aws_ecs_patterns, aws_logs } from 'aws-cdk-lib';
import { getConfig } from '../config';

export class FinalprojectExample extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const conf = getConfig(scope);

    const vpc = aws_ec2.Vpc.fromVpcAttributes(this, 'FinalProjectECSVPC', {
        vpcId: conf.vpcId,
        availabilityZones: conf.availabilityZones,
        publicSubnetIds: conf.publicSubnetIds
    });

    const cluster = new aws_ecs.Cluster(this, 'service-cluster', {
        clusterName: 'service-cluster',
        containerInsights: true,
        vpc,
      });

      const awsrepo = aws_ecr.Repository.fromRepositoryAttributes(this,'CutieECR',{
        repositoryArn: Fn.importValue('CutieeEcrArn'),
        repositoryName: Fn.importValue('CutieEcrName')
    });


      const image = aws_ecs.ContainerImage.fromEcrRepository(awsrepo);

     

      new aws_ecs_patterns.ApplicationLoadBalancedFargateService(
  this,
  'amazon-ecs-sample',
  {
    cluster,
    circuitBreaker: {
      rollback: true,
    },
    cpu: 512,
    assignPublicIp: true,
    memoryLimitMiB: 2048,
    desiredCount: 1,
    taskImageOptions: {
      image,
      containerPort: 8080,
      logDriver: aws_ecs.LogDrivers.awsLogs({
        streamPrefix: id,
        logRetention: aws_logs.RetentionDays.ONE_YEAR,
      }),
    },
  }
);

  }
}
