import { App } from "aws-cdk-lib";
import { Construct } from "constructs";
import { config, env } from "process";


interface Config {
    account: string;
    env: string;
    region: string;
    vpcId: string;
    availabilityZones: string[];
    publicSubnetIds: string[];
}

function getConfig(scope: App |┬áConstruct){
    const context = scope.node.tryGetContext('infras');

    const conf: Config = {

        account: context.account,
        env: context.env,
        region: context.region,
        vpcId: context.vpcId,
        availabilityZones: context.availabilityZones,
        publicSubnetIds: context.publicSubnetIds
    };
    return conf;
}
export {
    getConfig,
}