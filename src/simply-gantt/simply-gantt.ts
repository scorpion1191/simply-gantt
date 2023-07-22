import { SimplyGanttComponent } from "./simply-gantt-component"

export const simplyGantt = (selector) => {
    const element = document.querySelector('#'+selector);
    const ganttElement = 'simply-gantt-'+selector;
    function updateVisualizationData(visualizationData){
        var chart = <SimplyGanttComponent>document.querySelector("#"+ganttElement);
        chart.tasks = visualizationData?.tasks;
        chart.activities = visualizationData?.activities;
    }

    function initializeGanttVisualization(visualizationConfig){
        const customElement = document.createElement(ganttElement);
        customElement.setAttribute("id", ganttElement);
        element.appendChild(customElement);
        customElements.define(ganttElement, SimplyGanttComponent);
        updateVisualizationData(visualizationConfig?.data);
    }  
     
    return {
        initializeGanttVisualization: initializeGanttVisualization,
        updateVisualizationData: updateVisualizationData
    };
};