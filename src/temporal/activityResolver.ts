import { ActivityOptions, proxyActivities } from "@temporalio/workflow";
import { ActivityDefinition } from "../components/activities/models/acitityConfig";
import { ActivityFunction } from "../components/activities/models/acitivity";

export class TemporalActivityResolver  {
    public getActivity<T extends ActivityFunction>(name: string, config: ActivityDefinition): T {
        const activityOptions: ActivityOptions = {
            startToCloseTimeout: config.config?.timeout,
            scheduleToCloseTimeout: config.config?.timeout,
            retry: {
                initialInterval: config.config?.retryPolicy?.initialInterval,
                maximumAttempts: config.config?.retryPolicy?.maximumAttempts,
                maximumInterval: config.config?.retryPolicy?.maximumInterval,
                nonRetryableErrorTypes: config.config?.retryPolicy?.nonRetryableErrorTypes,
            },
        }
        const proxyActivity = proxyActivities<T>(activityOptions);
        return (proxyActivity as any)[name];
    }
}