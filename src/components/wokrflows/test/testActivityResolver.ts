import { ActivityResolver } from "../../activities/activityResolver";
import { getActivitiesFromObject } from "../../activities/annotations/activity";
import { ActivityFunction } from "../../activities/models/acitivity";

export class TestActivityResolver implements ActivityResolver {
    private activities: Map<string, ActivityFunction> = new Map();

    public getActivity(name: string): ActivityFunction {
        const activity = this.activities.get(name);
        if (!activity) {
            throw new Error(`Activity ${name} not found`);
        }
        return activity;
    }

    public registerActivities(...instances: any[]): void {
        instances.forEach(instance => {
            const activities = getActivitiesFromObject(instance);
            activities.forEach((activity, name) => {
                this.activities.set(name, activity);
            });
        });
    }
}