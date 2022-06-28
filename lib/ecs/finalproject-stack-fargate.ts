import { CfnOutput, Fn, Stack, StackProps, aws_cloud9} from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import {
    aws_ecs,
    aws_ec2,
    aws_s3,
    aws_iam,
    aws_ecr,
    aws_ssm,
    aws_elasticloadbalancingv2
} from 'aws-cdk-lib';
import { getConfig } from '../config';
import { SsmAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Repository } from 'aws-cdk-lib/aws-ecr';


export class FinalprojectStackFargate extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const conf = getConfig(scope);

        const vpc = aws_ec2.Vpc.fromVpcAttributes(this, 'FinalProjectECSVPC', {
            vpcId: conf.vpcId,
            availabilityZones: conf.availabilityZones,
            publicSubnetIds: conf.publicSubnetIds
        });

        const clusterSG = aws_ec2.SecurityGroup.fromSecurityGroupId(this,'FinalprojectECSClusterSgId',Fn.importValue('FinalprojectECSClusterSgId'));

        const cluster = aws_ecs.Cluster.fromClusterAttributes(this,'FinalprojectECSCluster',{
            clusterArn: Fn.importValue('ECSClusterARN'),
            clusterName: Fn.importValue('ECSClusterName'),
            vpc,
            securityGroups: [clusterSG]
        });

        const envBucket = aws_s3.Bucket.fromBucketAttributes(this, 'FinalprojectBucket', {
            bucketArn: Fn.importValue('FinalprojectBucketARN'),
            bucketName: Fn.importValue('FinalprojectBucketName')
        });

       
        const executionRole = new aws_iam.Role(this, 'TaskDefinitionRole', {
            roleName: 'TaskDefinitionRole',
            assumedBy: new aws_iam.ServicePrincipal('ecs-tasks.amazonaws.com')
        });

        executionRole.addToPolicy(new aws_iam.PolicyStatement({
            effect: aws_iam.Effect.ALLOW,
            resources: ['*'],
            actions: [
                's3:*'
            ]
        }));

        const taskdef = new aws_ecs.FargateTaskDefinition(this, 'TaskDefinitionforFargate', {
            family: 'TaskDefinitionforFargate',
            cpu: 512,
            memoryLimitMiB: 1024,
            executionRole
        });

               //const awsrepo = aws_ecr.Repository.fromRepositoryArn(this, 'FinalprojectECRARN', 'FinalECRARN');

               const awsrepo = aws_ecr.Repository.fromRepositoryAttributes(this,'FinalRepoECR',{
                repositoryArn: Fn.importValue('CutieeEcrArn'),
                repositoryName: Fn.importValue('CutieEcrName')
            });

            taskdef.addContainer('FinalProjectContainer', {
                containerName: 'FinalProject-Backend-Service',
                image: aws_ecs.ContainerImage.fromEcrRepository(awsrepo),
                memoryReservationMiB: 512,
                portMappings:[
                    {containerPort: 8080}
                ]
            });

       const dbpass = new aws_ssm.StringParameter(this,'DB_PASSWORD',{
        parameterName: '/app/DB_PASSWORD',
        stringValue: '12345'
           });


        const fargateserviceSG = new aws_ec2.SecurityGroup(this,'FargateServiceSG',{
            vpc,
            allowAllOutbound: true,
            securityGroupName: 'Fargate-Service-SG'
        });
        
        const fargateservice = new aws_ecs.FargateService(this, 'FinalprojectFargateService', {
            serviceName: 'FinalProjectService',
            desiredCount: 1,
            cluster,
            taskDefinition: taskdef,
            securityGroups:[fargateserviceSG],
            assignPublicIp: true, 
        });

       const autoscale =  fargateservice.autoScaleTaskCount({
            minCapacity: 1,
            maxCapacity: 6
        });


        const appsg = new aws_ec2.SecurityGroup(this,'AppSG',{
            vpc,
            allowAllOutbound: true,
            securityGroupName: 'APP-Security-Group'
        });

        appsg.addIngressRule(aws_ec2.Peer.anyIpv4(), aws_ec2.Port.tcp(80),'Allow access to http port');
        appsg.addIngressRule(aws_ec2.Peer.anyIpv4(), aws_ec2.Port.tcp(443),'Allow access to https port');

        fargateserviceSG.addIngressRule(appsg,aws_ec2.Port.tcpRange(49153, 65535),'Allow access container port from alb');

        const servicealb = new aws_elasticloadbalancingv2.ApplicationLoadBalancer(this, 'FinalProjectLoadBalancer', {
            loadBalancerName: 'FinalProjectAppLoadBalancer',
            vpc,
            internetFacing: true,
            deletionProtection: true,
            securityGroup: appsg,
        });

        const fargateservicetg = new aws_elasticloadbalancingv2.ApplicationTargetGroup(this,'ServiceTargetGroup',{
            healthCheck:{
                enabled: true,
                path: '/',
                port: '8080',
                protocol: aws_elasticloadbalancingv2.Protocol.HTTP,
                healthyHttpCodes: '200',
            },
            port: 80,
            protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
            targetGroupName: 'FinalProjectService-tg',
            targetType: aws_elasticloadbalancingv2.TargetType.IP,
            targets: [fargateservice],
            vpc,
        });


        servicealb.addListener('HttpListener', {
            port: 80,
            protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
            defaultTargetGroups: [fargateservicetg],
        });

    }
}
