import { Activity } from "../components/activities/annotations/activity";

export class ActivityTest {
    @Activity('activity1')
    async activity1() {
        return "Activity 1";
    }

    @Activity()
    async activity2() {
        return "Activity 2";
    }
}
