import { ActivityResolver } from "../../activities/activityResolver";
import { activitiesConfig } from "../../activities/annotations/activity";
import { getRegisteredWorkflows } from "../annotations/workflow";
import { BaseWorkflow } from "./baseWorkflow";

export class WorkflowBuilder {
    private activityResolver: ActivityResolver;

    public constructor(activityResolver: ActivityResolver) {
        this.activityResolver = activityResolver;
    }

    public build(name: string ): BaseWorkflow {
        const activities = activitiesConfig;
        const workflowClass = getRegisteredWorkflows().get(name)?.workflowClass;
        if (!workflowClass) {
            throw new Error(`Workflow with name ${name} not found`);
        }
        return new workflowClass(this.activityResolver, activities);
    }
}