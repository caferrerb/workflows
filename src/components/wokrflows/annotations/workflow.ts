import { getActivities } from "../../activities/annotations/activity";

interface WorkflowConfig {
    name: string;
    timeoutSeconds?: number;
    retryPolicy?: {
      maxAttempts?: number;
      delaySeconds?: number;
    };
  }
  
  const workflowRegistry = new Map<string, { instance: any; config: WorkflowConfig }>();
  
  export function Workflow(config: WorkflowConfig): ClassDecorator {
    return (target: Function) => {
      const instance = new (target as any)();
  
      // Inyectar activities si existe la propiedad
      if ('activities' in instance) {
        instance.activities = getActivities();
      }
  
      workflowRegistry.set(config.name, { instance, config });
    };
  }
  
  export function getRegisteredWorkflows() {
    return workflowRegistry;
  }