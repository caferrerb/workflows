import 'reflect-metadata';
import { ActivityFunction } from '../models/acitivity';
import { ActivityConfig } from '../models/acitityConfig';

const ACTIVITY_METADATA_KEY = Symbol('activity');

export interface ActivityMetadata {
    name?: string;
    configuration?: ActivityConfig;
}

export const activitiesConfig = new Map<string, ActivityConfig>();

export function Activity(name?: string, configuration: ActivityConfig = {}): MethodDecorator {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const metadata: ActivityMetadata = { name, configuration };
        Reflect.defineMetadata(ACTIVITY_METADATA_KEY, metadata, target, propertyKey); 
        return descriptor;
    };
}

export function getActivityMetadata(target: any, propertyKey: string | symbol): ActivityMetadata | undefined {
    return Reflect.getMetadata(ACTIVITY_METADATA_KEY, target, propertyKey);
}

export function getActivitiesFromObject(target: any): Map<string, ActivityFunction> {
    const activities = new Map<string, ActivityFunction>();
    
    const getAllProperties = (obj: any): string[] => {
        const properties = new Set<string>();
        let currentObj = obj;
        
        while (currentObj && currentObj !== Object.prototype) {
            Object.getOwnPropertyNames(currentObj).forEach(prop => {
                if (prop !== 'constructor') {
                    properties.add(prop);
                }
            });
            currentObj = Object.getPrototypeOf(currentObj);
        }
        
        return Array.from(properties);
    };

    const properties = getAllProperties(target);
    
    properties.forEach(propertyKey => {
        const metadata = getActivityMetadata(target, propertyKey);
        if (metadata) {
            const method = target[propertyKey];
            if (typeof method === 'function') {
                const activityName = metadata.name || propertyKey.toString();
                activities.set(activityName, method.bind(target));
                if (metadata.configuration) {
                    console.log(`Setting activity configuration for ${activityName}:`, metadata.configuration);
                    activitiesConfig.set(activityName, metadata.configuration);
                }
            }
        }
    });

    return activities;
} 