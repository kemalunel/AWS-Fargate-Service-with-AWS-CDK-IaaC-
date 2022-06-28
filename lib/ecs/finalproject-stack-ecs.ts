import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { 
    aws_ecs,
    aws_ec2
} from 'aws-cdk-lib';
import { getConfig } from '../config';
import { CfnClusterSubnetGroup } from 'aws-cdk-lib/aws-redshift';

export class FinalprojectStackECS extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const conf = getConfig(scope);

    const vpc = aws_ec2.Vpc.fromVpcAttributes(this,'FinalProjectECSVPC',{
        vpcId: conf.vpcId,
        availabilityZones: conf.availabilityZones,
        publicSubnetIds: conf.publicSubnetIds
    });

    const cluster = new aws_ecs.Cluster(this,'FinalprojectStackECSCluster', {
        clusterName: 'FinalProjectCluster',
        vpc,
    });

    const clustersg = new aws_ec2.SecurityGroup(this,'FinalprojectECSClusterSG',{
      vpc,
      allowAllOutbound: true,
      securityGroupName: 'FinalProjectECSSG'
    });

    clustersg.addIngressRule(aws_ec2.Peer.anyIpv4(), aws_ec2.Port.tcp(80),'allow access to http port');
    clustersg.addIngressRule(aws_ec2.Peer.anyIpv4(), aws_ec2.Port.tcp(443),'allow access to https port');

    cluster.connections.addSecurityGroup();
    

    new CfnOutput(this,'FinalprojectECSClusterARN',{
      exportName: 'ECSClusterARN',
      value: cluster.clusterArn
    });

    new CfnOutput(this,'FinalprojectECSClusterName',{
      exportName: 'ECSClusterName',
      value: cluster.clusterName
    });

    new CfnOutput(this,'FinalprojectECSClusterSgId',{
      exportName: 'FinalprojectECSClusterSgId',
      value: clustersg.securityGroupId
    });

  }
}
