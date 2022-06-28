
### for FinalprojectStackECS
cdk synth --app "npx ts-node bin/finalproject-computing.ts" FinalprojectStackECS

cdk deploy --app "npx ts-node bin/finalproject-computing.ts" FinalprojectStackECS

### for FinalprojectStackECR

cdk synth --app "npx ts-node bin/finalproject-computing.ts" FinalprojectStackECR

cdk deploy --app "npx ts-node bin/finalproject-computing.ts" FinalprojectStackECR


### for FinalprojectStackBucket
cdk synth --app "npx ts-node bin/finalproject-computing.ts" FinalprojectStackBucket

cdk deploy --app "npx ts-node bin/finalproject-computing.ts" FinalprojectStackBucket


### for FinalprojectStackFargate
cdk synth --app "npx ts-node bin/finalproject-computing.ts" FinalprojectStackFargate

cdk deploy --app "npx ts-node bin/finalproject-computing.ts" FinalprojectStackFargate


### for FinalprojectExample
cdk synth --app "npx ts-node bin/finalproject-computing.ts" FinalprojectExample

cdk deploy --app "npx ts-node bin/finalproject-computing.ts" FinalprojectExample

### for ExampleEcrStack

cdk deploy --app "npx ts-node bin/finalproject-computing.ts" ExampleEcrStack