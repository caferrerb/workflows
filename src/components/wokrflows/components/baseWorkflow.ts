import { ActivityConfig } from "../../activities/models/acitityConfig";
import { ActivityResolver } from "../../activities/activityResolver";
import { ActivityFunction } from "../../activities/models/acitivity";
import { mapSeries } from "bluebird";

export abstract class BaseWorkflow<P = any, R = any> {
    private activities: Map<string, ActivityConfig> = new Map();
    private compensations: ActivityFunction[] = [];
    public activityResolver: ActivityResolver;

    public constructor(activityResolver: ActivityResolver, activities: Map<string, ActivityConfig>) {
        this.activityResolver = activityResolver;
        this.activities = activities;
    }

    public abstract run(params: P): Promise<R>;

    public async execute(params: P): Promise<R> {
        try {
            const result = await this.run(params);
            return result;
        } catch (error) {
            await mapSeries(this.compensations, async (compensation: ActivityFunction) =>{ 
                try {
                    await compensation();
                } catch (error) {
                    console.error(`Error executing compensation ${compensation.name}:`, error);
                }
            });
            throw error;
        }
    }

    public async callActivity(name: string, ...args: any[]): Promise<any> {
        const activity = this.activityResolver.getActivity(name);
        const activityConfig = this.activities.get(name);
        if (!activity) {
            throw new Error(`Activity with name ${name} not found`);
        }
        try {
            
            if (activityConfig?.compensationActivity) {
                const compensationName = activityConfig.compensationActivity;
                this.compensations.push(() => this.callActivity(compensationName, ...args));
            }
            const result = await activity(...args);
            return result;
        } catch (error) {
            throw error;
        }
    }
}