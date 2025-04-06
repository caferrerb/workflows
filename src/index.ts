import { getActivities } from "./components/activities/annotations/activity";
import "./example/activityTest";

function main() {
    const activities = getActivities();
    console.log(activities);
}

main();