import { ActivityFunction } from "./acitivity";

export interface ActivityConfig {
    retryPolicy?: {
        initialInterval?: number;
        maximumAttempts?: number;
        maximumInterval?: number;
        nonRetryableErrorTypes?: string[];
    };
    timeout?: number;
}

export interface ActivityDefinition {
    name: string;
    config?: ActivityConfig;
    handler: ActivityFunction;
    compensation?: ActivityFunction;
}
