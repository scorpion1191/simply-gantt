import {YearMonthRenderer} from './simply-gantt-layout/month-day';
import {DateTimeRenderer} from './simply-gantt-layout/day-time';
 
  const template = document.createElement('template');

  template.innerHTML = 
   `<style>
      #gantt-container{
        display: grid;   
        overflow:auto;  
        position: relative;
    }
    .gantt-row-task{
      background-color:whitesmoke;
      color:rgba(0, 0, 0, 0.726);
      border:1px solid rgb(133, 129, 129);
      text-align: center;
      padding: 15px;
      position: sticky;
      left: 0px;
      z-index:999;
    }
    .gantt-row-period{
      background-color:whitesmoke;
      color:rgba(0, 0, 0, 0.726);
      border:1px solid rgb(133, 129, 129);
      text-align: center; 
      display:grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(40px, 1fr);
      line-height:200%;
    }
    .gantt-row-item{
        border: 1px solid rgb(214, 214, 214);
        padding: 10px 0 10px 0;
        position: relative;
        background-color:white;
        text-align:left;
    }
    .drag-hide {
      transition: 0.01s;
      transform: translateX(-9999px);
    }

    #select-layout{
      text-align: left;
      margin-top: 10px;
    }
    </style>

    <div id="gantt-container">

    </div>   
  `
  ;

  export class SimplyGanttComponent extends HTMLElement {
    layoutSelect: any;

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.layoutSelect = this.shadowRoot.querySelector('#select-layout');
    }

    _tasks = [];
    _activities = [];
    _layout;
    _renderer;

    set tasks(list){
      this._tasks = list;
      if(this.renderer){
        this.renderer.tasks = this._tasks;
        this.renderer.render();
      }
    }
    get tasks(){
      return this._tasks;
    }
    set activities(list){
      this._activities = list;
      if(this.renderer){
        this.renderer.activities = this._activities;
        this.renderer.render();
      }
    }
    get activities(){
      return this._activities;
    }
    get layout() {
      return this._layout;
    }
    set layout(value) {
      this._layout = value?.type;
      if(this.renderer){
        this.renderer.layout = this._layout 
        if(this._layout == "month"){
          this.renderer = new YearMonthRenderer(this.shadowRoot);
        }else{
          this.renderer = new DateTimeRenderer(this.shadowRoot);
        } 
        this.renderer.dateFrom = value?.formData;
        this.renderer.dateTo = value?.toDate;
        this.renderer.render();
      }
    } 
    get renderer(){
      return this._renderer;
    }
    set renderer(r){
      this._renderer = r;
    }
    connectedCallback() {
      if(this.layout == "month"){
        this.renderer = new YearMonthRenderer(this.shadowRoot);
      }else{
        this.renderer = new DateTimeRenderer(this.shadowRoot);
      } 
      this.renderer.dateFrom = new Date(2021,5,1);
      this.renderer.dateTo = new Date(2021,5,24);
      this.renderer.render();
    }

    disconnectedCallback() {
      if(this.renderer)
        this.renderer.clear();
    }
  }