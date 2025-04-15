import { activitiesConfig } from "../../activities/annotations/activity";

interface WorkflowConfig {
    name: string;
    timeoutSeconds?: number;
    retryPolicy?: {
      maxAttempts?: number;
      delaySeconds?: number;
    };
  }
  
  const workflowRegistry = new Map<string, { workflowClass: any; config: WorkflowConfig }>();
  
  export function Workflow(config: WorkflowConfig): ClassDecorator {
    return (target: Function) => {  
      const name = config.name ?? target.name; 
      workflowRegistry.set(name, { workflowClass: target, config });
    };
  }
  
  export function getRegisteredWorkflows() {
    return workflowRegistry;
  }