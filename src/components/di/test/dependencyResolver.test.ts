import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { DependencyResolver, DependencyIdentifier, dependencyMethods, getActivitiesFromInstances, resolveAllActivities } from '../dependencyResolver';
import { ActivityFunction } from '../../activities/models/acitivity';
import { Activity } from '../../activities/annotations/activity';

class Test {
    @Activity()
    public method1(a: number, b: number) {
        console.log('test');
        return a + b;
    }
}

class Test2 {
    @Activity("test2")
    public method2(name: string) {
        console.log('test2');
        return name.toUpperCase();
    }
    @Activity("test3")
    public method3(name: string) {
        console.log('test3');
        return name.toLowerCase();
    }
}   

class MockContainer {
    private bindings: Map<DependencyIdentifier, any> = new Map();
    public bind(identifier: DependencyIdentifier, instance: any) {
        this.bindings.set(identifier, instance);
    }
    public get(identifier: DependencyIdentifier) {
        return this.bindings.get(identifier);
    }
}

class MockDependencyResolver implements DependencyResolver {
    private container: MockContainer;
    constructor(container: MockContainer) {
        this.container = container;
    }
    public resolveAllDependencies(...names: DependencyIdentifier[]) {
        return names.map(name => this.container.get(name));
    }
}


describe('DependencyResolver', () => {
  describe('getActivitiesFromInstances', () => {
    it('should extract activities from instances', () => {
        const instance1 = new Test();
        const instance2 = new Test2();
      
      const activities = getActivitiesFromInstances(instance1, instance2);
      
      expect(activities.method1(1,2)).toEqual(3);
      expect(activities.test2("test")).toEqual("TEST");
      expect(activities.test3("TEST")).toEqual("test");
    });
  });
  describe('resolveAllActivities', () => {
    it('should resolve all activities', () => {
        const container = new MockContainer();
        container.bind(Test, new Test());
        container.bind("test_name", new Test2());

        const resolver = new MockDependencyResolver(container);
        const activities = resolveAllActivities(resolver, Test, "test_name");
        expect(activities.method1(1,2)).toEqual(3);
        expect(activities.test2("test")).toEqual("TEST");
        expect(activities.test3("TEST")).toEqual("test");
    });
  });
});
