import { getActivitiesFromObject } from "../activities/annotations/activity";
import { ActivityFunction } from "../activities/models/acitivity";

export const dependencyMethods = new Map<string, (...args: any[]) => any | Promise<any>>();

export type DependencyIdentifier = string | symbol | (new (...args: any[]) => any);

export interface DependencyResolver {
    resolveAllDependencies(...names: DependencyIdentifier[]): any[];
}

export interface Activities {
    [key: string]: ActivityFunction;
}


export function getActivitiesFromInstances(...instances: any[]): Activities {
    const activities: Activities = {};
    instances.forEach(instance => {
        const activitiesMap: Map<string, ActivityFunction> = getActivitiesFromObject(instance);
        activitiesMap.forEach((activity, name) => {
            activities[name] = activity;
        });
    });
    return activities;
}

export function resolveAllActivities(resolver: DependencyResolver, ...names: DependencyIdentifier[]): Activities {
    const instances = resolver.resolveAllDependencies(...names);
    return getActivitiesFromInstances(...instances);
}
