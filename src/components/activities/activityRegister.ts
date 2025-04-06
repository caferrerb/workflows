import { ActivityDefinition } from "./models/acitityConfig";

export abstract class ActivityRegister {
    private static activities: Record<string, ActivityDefinition> = {};

    public static registerActivity(name: string, activity: ActivityDefinition) {
        this.activities[name] = activity;
    }

    public static getActivity(name: string): ActivityDefinition {
        return this.activities[name];
    }
}