import {CfnOutput, cfnTagToCloudFormation, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import { aws_ec2 } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { VpnConnection } from 'aws-cdk-lib/aws-ec2';


export class FinalprojectStackVPC extends Stack {


/*
    get get availabilityZones(): string[] {
        return['eu-central-1a','eu-cental-1b']
    }

    */
   
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

   // const vpcID = scope.node.tryGetContext('vpcID');

    const vpc = new aws_ec2.Vpc(this,'FinalprojectStackVPC',{
        cidr: '10.0.0.0/16',
        vpcName: 'my-lovely-vpc',
        maxAzs: 2,
        subnetConfiguration: [
            {
                name:'public-subnet',
                subnetType: aws_ec2.SubnetType.PUBLIC,
            },
            {
                name: 'private-subnet-withnat',
                subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED
            },            
        ]

    });

        /*
    const sg = new aws_ec2.SecurityGroup(this, 'SecurityGroup',{
        vpc,
        allowAllOutbound: true,
        securityGroupName: "Name-of-SG",



    });
*/
     // sg.addIngressRule(aws_ec2.Peer.anyIpv4(),aws_ec2.Port.tcp(22), 'allow access to SSH from anywhere');

    new CfnOutput(this,'FinalprojectStackVPCARN',{
        value:vpc.vpcArn,
        exportName: 'FinalprojectStackVPCARN'
    });

  }
}
