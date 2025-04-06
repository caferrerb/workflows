import 'reflect-metadata';
import { Activity, getActivityMetadata, getActivitiesFromObject } from './activity';

describe('Activity Decorator', () => {
  class TestClass {
    @Activity()
    async testMethod() {
      return 'test result';
    }

    @Activity('customName')
    async namedMethod() {
      return 'named result';
    }

    async nonActivityMethod() {
      return 'not an activity';
    }
  }

  class ChildTestClass extends TestClass {
    @Activity()
    async childMethod() {
      return 'child result';
    }
  }

  it('should add metadata to decorated methods', () => {
    const testInstance = new TestClass();
    const metadata = getActivityMetadata(testInstance, 'testMethod');
    
    expect(metadata).toBeDefined();
    expect(metadata?.name).toBeUndefined();
  });

  it('should add custom name to metadata when provided', () => {
    const testInstance = new TestClass();
    const metadata = getActivityMetadata(testInstance, 'namedMethod');
    
    expect(metadata).toBeDefined();
    expect(metadata?.name).toBe('customName');
  });

  it('should not add metadata to non-decorated methods', () => {
    const testInstance = new TestClass();
    const metadata = getActivityMetadata(testInstance, 'nonActivityMethod');
    
    expect(metadata).toBeUndefined();
  });

  it('should get all activities from an object', () => {
    const testInstance = new TestClass();
    const activities = getActivitiesFromObject(testInstance);
    
    expect(activities.size).toBe(2);
    expect(activities.has('testMethod')).toBe(true);
    expect(activities.has('customName')).toBe(true);
    expect(activities.has('nonActivityMethod')).toBe(false);
    
    expect(typeof activities.get('testMethod')).toBe('function');
    expect(typeof activities.get('customName')).toBe('function');
  });

  it('should include inherited activities', () => {
    const childInstance = new ChildTestClass();
    const activities = getActivitiesFromObject(childInstance);
    
    expect(activities.size).toBe(3);
    expect(activities.has('testMethod')).toBe(true);
    expect(activities.has('customName')).toBe(true);
    expect(activities.has('childMethod')).toBe(true);
  });

  it('should preserve method functionality', async () => {
    const testInstance = new TestClass();
    const activities = getActivitiesFromObject(testInstance);
    
    const testMethod = activities.get('testMethod');
    const namedMethod = activities.get('customName');
    
    expect(testMethod).toBeDefined();
    expect(namedMethod).toBeDefined();
    
    const testResult = await testMethod!();
    const namedResult = await namedMethod!();
    
    expect(testResult).toBe('test result');
    expect(namedResult).toBe('named result');
  });
});
