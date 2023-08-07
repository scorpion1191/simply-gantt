import {MonthDayRenderer} from './simply-gantt-layout/month-day';
import {DayTimeRenderer} from './simply-gantt-layout/day-time';
import {YearMonthRenderer} from './simply-gantt-layout/year-month';
  const template = document.createElement('template');

  template.innerHTML = 
   `<style>
      #gantt-container{
        display: grid;   
        overflow:auto;  
        position: relative;
        height: 100%;
        margin:1em;
    }
    .gantt-row-task{
      background-color:#f3f4f5;
      border:1px solid #d8d9da;
      text-align: center;
      padding: 15px;
      position: sticky;
      left: 0px;
      z-index:999;
      font-family: sans-serif;
      font-size: 0.9em;
      font-weight: 600;
      color: #797b7d;
    }
    .gantt-row-period{
      background-color:#f3f4f5;
      border:1px solid #d8d9da;
      text-align: center; 
      display:grid;
      grid-auto-flow: column;
      grid-auto-columns: minmax(40px, 1fr);
      line-height:200%;
      font-family: sans-serif;
      font-weight: 500;
      font-size: 14px;
      color: #667280;
    }
    .gantt-row-item{
        border: 1px solid #d8d9da;
        padding: 10px 0 10px 0;
        position: relative;
        background-color:white;
        text-align:left;
    }
    .gantt-header-one {
      position: sticky;
      top: 0px;
      z-index: 1000;
    }
    .gantt-header-two {
      position: sticky;
      top: 34px;
      z-index: 1000;
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
    _events = [];
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

    set events(list){
      this._events = list;
      if(this.renderer){
        this.renderer.events = this._events;
        this.renderer.render();
      }
    }
    get events(){
      return this._events;
    }
    get layout() {
      return this._layout;
    }
    set layout(value) {
      this._layout = value;
      if(this.renderer){
        this.renderer.layout = this._layout 
        if(this._layout.type == "year"){
          this.renderer = new YearMonthRenderer(this.shadowRoot,this._layout);
        }else if(this._layout.type == "day"){
          this.renderer = new DayTimeRenderer(this.shadowRoot,this._layout);
        } else {
          this.renderer = new MonthDayRenderer(this.shadowRoot,this._layout);
        } 
        this.renderer.dateFrom = this.getMaxandMinLayoutDates(this._layout?.fromDate, this._layout?.toDate).minDate;
        this.renderer.dateTo = this.getMaxandMinLayoutDates(this._layout?.fromDate, this._layout?.toDate).maxDate;
        this.renderer.activities = this._activities;
        this.renderer.events = this._events;
        this.renderer.tasks = this._tasks;
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
      if(this._layout?.type == "year"){
        this.renderer = new YearMonthRenderer(this.shadowRoot, this._layout);
      }else if(this._layout?.type == "day"){
        this.renderer = new DayTimeRenderer(this.shadowRoot, this._layout);
      } else {
        this.renderer = new MonthDayRenderer(this.shadowRoot, this._layout);
      }    
    }

    disconnectedCallback() {
      if(this.renderer)
        this.renderer.clear();
    }

    getMaxandMinLayoutDates(fromDate?, toDate?){
      let minDate;
      let maxDate;
      if( fromDate || toDate || this._activities.length || this.events.length) {
        minDate = fromDate ? fromDate : [...this._activities.map((i) => i.start), ...this._events.map((i) => i.date)].reduce(function (a, b) { return a < b ? a : b; });
        maxDate = toDate ? toDate : [...this._activities.map((i) => i.end), ...this._events.map((i) => i.date)].reduce(function (a, b) { return a > b ? a : b; });
      }
      return {minDate, maxDate}
    }
  }