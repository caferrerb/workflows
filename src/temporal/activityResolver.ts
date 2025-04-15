import { ActivityOptions, proxyActivities } from "@temporalio/workflow";
import { ActivityConfig } from "../components/activities/models/acitityConfig";
import { ActivityFunction } from "../components/activities/models/acitivity";
import { ActivityResolver } from "../components/activities/activityResolver";

const DEFAULT_CONFIG: ActivityConfig = {
    timeout: 10000,
    retryPolicy: {
        initialInterval: 1000,
        maximumAttempts: 3,
    },
};

export class TemporalActivityResolver implements ActivityResolver {
    public constructor() {
    }

    public getActivity<P extends any[] = any[], R = any>(name: string, activityConfig?: ActivityConfig): ActivityFunction<P, R> {

        const config: ActivityConfig = { 
            timeout: activityConfig?.timeout ?? DEFAULT_CONFIG?.timeout,
            retryPolicy: {
                initialInterval: activityConfig?.retryPolicy?.initialInterval ?? DEFAULT_CONFIG?.retryPolicy?.initialInterval,
                maximumAttempts: activityConfig?.retryPolicy?.maximumAttempts ?? DEFAULT_CONFIG?.retryPolicy?.maximumAttempts,
                maximumInterval: activityConfig?.retryPolicy?.maximumInterval ?? DEFAULT_CONFIG?.retryPolicy?.maximumInterval,
                nonRetryableErrorTypes: activityConfig?.retryPolicy?.nonRetryableErrorTypes ?? DEFAULT_CONFIG?.retryPolicy?.nonRetryableErrorTypes,
            },
         };

        const activityOptions: ActivityOptions = {
            startToCloseTimeout: config?.timeout,
            scheduleToCloseTimeout: config?.timeout,
            retry: {
                initialInterval: config?.retryPolicy?.initialInterval,
                maximumAttempts: activityConfig?.retryPolicy?.maximumAttempts,
                maximumInterval: activityConfig?.retryPolicy?.maximumInterval,
                nonRetryableErrorTypes: activityConfig?.retryPolicy?.nonRetryableErrorTypes,
            },
        }
        const proxyActivity = proxyActivities(activityOptions);
        return (proxyActivity as any)[name];
    }
}