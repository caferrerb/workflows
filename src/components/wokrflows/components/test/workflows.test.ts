import { ActivityResolver } from '../../../activities/activityResolver';
import { ActivityConfig } from '../../../activities/models/acitityConfig';
import { BaseWorkflow } from '../baseWorkflow';
import { WorkflowBuilder } from '../workflowBuilder';
import { Activity, getActivitiesFromObject } from '../../../activities/annotations/activity';
import { ActivityFunction } from '../../../activities/models/acitivity';
import { Workflow } from '../../annotations/workflow';
import { TestActivityResolver } from '../../test/testActivityResolver';


class StringActivities {
    @Activity('toLower')
    public toLower(value: string): string {
        return value.toLowerCase();
    }

    @Activity('toUpper')
    public toUpper(value: string): string {
        return value.toUpperCase();
    }
}

class MathActivities {
    @Activity('add')
    public add(a: number, b: number): number {
        return a + b;
    }

    @Activity('subtract')
    public subtract(a: number, b: number): number {
        return a - b;
    }
}

@Workflow({ name: 'MathWorkflow' })
class TestWorkflow extends BaseWorkflow<{a: number, b: number}, number> {
    public async run(params: {a: number, b: number}): Promise<number> {
        return this.callActivity('add', params.a, params.b);
    }
}


describe('BaseWorkflow', () => {
let workflowBuilder: WorkflowBuilder;

  beforeEach(() => {
    const testActivityResolver = new TestActivityResolver();
    testActivityResolver.registerActivities(new StringActivities(), new MathActivities());
    workflowBuilder = new WorkflowBuilder(testActivityResolver);
  });

  it('should execute the workflow successfully', async () => {
    const workflow = workflowBuilder.build('MathWorkflow');
    const result = await workflow.execute({a: 1, b: 2});
    expect(result).toBe(3);
  });
});
