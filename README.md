# Simply Gantt

Simply Gantt is a ES6 Library to Visualize Gantt chart, it is based on Web Components so it will work on all the new browsers that support web components

```sh
<div id="gantt"></div>


import {simplyGantt} from "./lib/es6/index"

const visualizationConfig = {
    layout: {
        type: 'month',
        formData: new Date(2021,5,1),
        toDate: new Date(2021,6,30)
    },
    data : {
        tasks: [{id:1, name: "Task 1"}, {id:2, name: "Task 2"}, {id:3, name: "Task 3"}, {id:4, name: "Task 4"}],
        activities: [
            { id: "t1", start: new Date("2021/6/1"), end: new Date("2021/6/4"), task: 1 },
            { id: "t2", start: new Date("2021/6/4"), end: new Date("2021/6/13"), task: 2 },
            { id: "t3", start: new Date("2021/6/13"), end: new Date("2021/6/21"), task: 3 },
            { id: "t4", start: new Date("2021/7/10"), end: new Date("2021/7/30"), task: 3 },
        ]
    }
}

simplyGantt("gantt").initializeGanttVisualization(visualizationConfig);
```

## License

Apache License 2.0
**Free Software, Hell Yeah!**
