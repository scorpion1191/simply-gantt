import { SimplyGanttComponent } from "./simply-gantt-component"

export const simplyGantt = (selector) => {
    const element = document.querySelector('#'+selector);
    const ganttElement = 'simply-gantt-'+selector;

    function updateVisualizationData(visualizationData){
        var chart = <SimplyGanttComponent>document.querySelector("#"+ganttElement);
        chart.tasks = visualizationData?.tasks;
        chart.activities = visualizationData?.activities;
        chart.events = visualizationData?.events;
    }

    function updateVisualizationLayout(layout){
        var chart = <SimplyGanttComponent>document.querySelector("#"+ganttElement);
        let initLayout = chart.layout;
        let currentLayout = layout ? layout : {type: 'day'}
        chart.layout = { ...initLayout , ...currentLayout}
    }

    function initializeGanttVisualization(visualizationConfig){
        const customElement = document.createElement(ganttElement);
        customElement.setAttribute("id", ganttElement);
        element.appendChild(customElement);
        customElements.define(ganttElement, SimplyGanttComponent);
        var chart = <SimplyGanttComponent>document.querySelector("#"+ganttElement);
        chart.tasks = visualizationConfig.data?.tasks;
        chart.activities = visualizationConfig.data?.activities;
        chart.events = visualizationConfig.data?.events;
        chart.layout = visualizationConfig?.layout
    }  

    function addTask(data){
        var chart = <SimplyGanttComponent>document.querySelector("#"+ganttElement);
        let task = [...chart.tasks,data]
        chart.tasks = task;
    }

    function addActivity(data){
        var chart = <SimplyGanttComponent>document.querySelector("#"+ganttElement);
        let activities = [...chart.activities,data]
        chart.activities = activities;
    }
     
    return {
        initializeGanttVisualization: initializeGanttVisualization,
        updateVisualizationData: updateVisualizationData,
        updateVisualizationLayout: updateVisualizationLayout,
        addTask: addTask,
        addActivity: addActivity
    };
};