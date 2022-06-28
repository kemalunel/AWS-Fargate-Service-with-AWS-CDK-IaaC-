#!/usr/bin/env node
import 'source-map-support/register';
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { getConfig } from '../lib/config';
import { FinalprojectStackECS } from "../lib/ecs";
import { FinalprojectStackFargate } from '../lib/ecs';
import { FinalprojectStackBucket } from '../lib/s3';
import { FinalprojectStackECR } from '../lib/ecr';
import { FinalprojectExample } from '../lib/ecs';
import { ExampleEcrStack } from '../lib/ecs';


const app = new cdk.App();
const conf = getConfig(app);
const env = { 
  account:conf.account, 
  region: conf.region
};

new FinalprojectStackECS(app,'FinalprojectStackECS',{env});
new FinalprojectStackFargate(app,'FinalprojectStackFargate',{env});
new FinalprojectStackBucket(app,'FinalprojectStackBucket',{env});
new FinalprojectStackECR(app,'FinalprojectStackECR', {env});
new FinalprojectExample(app,'FinalprojectExample',{env});
new ExampleEcrStack(app,'ExampleEcrStack',{env});