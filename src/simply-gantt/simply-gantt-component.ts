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

    #select-level{
      text-align: left;
      margin-top: 10px;
    }
    #gantt-settings{
      display: flex;
      align-items: center;
      column-gap: 3px;
      font-size:10px;
      margin-bottom: 10px;
    }
    </style>

    <div id="gantt-settings">
      <select name="select-level" id="select-level">
        <option value="year-month">Month / Day</option>
        <option value="day">Day / Time</option>
      </select>

      <fieldset id="select-from">
        <legend>From</legend>
      </fieldset>

      <fieldset id="select-to">
        <legend>To</legend>
      </fieldset>

    </div>

    <div id="gantt-container">

    </div>   
  `
  ;

  export class SimplyGanttComponent extends HTMLElement {
    levelSelect: any;

    constructor() {
      super();

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.levelSelect = this.shadowRoot.querySelector('#select-level');
    }

    _tasks = [];
    _activities = [];
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
    get level() {
      return this.levelSelect.value;
    }
    set level(newValue) {
      this.levelSelect.value = newValue;
    } 
    get renderer(){
      return this._renderer;
    }
    set renderer(r){
      this._renderer = r;
    }
    connectedCallback() {
      this.changeLevel = this.changeLevel.bind(this);
      this.levelSelect.addEventListener('change', this.changeLevel);
      this.level = "year-month";   
      this.renderer = new YearMonthRenderer(this.shadowRoot);
      this.renderer.dateFrom = new Date(2021,5,1);
      this.renderer.dateTo = new Date(2021,5,24);
      this.renderer.render();
    }

    disconnectedCallback() {
      if(this.levelSelect)
        this.levelSelect.removeEventListener('change', this.changeLevel);
      if(this.renderer)
        this.renderer.clear();
    }
    changeLevel(){
      if(this.renderer){
        this.renderer.clear();
      }
      var r;
      if(this.level == "year-month"){
        r = new YearMonthRenderer(this.shadowRoot);
      }else{
        r = new DateTimeRenderer(this.shadowRoot);
      }
      r.dateFrom = new Date(2021,5,1);
      r.dateTo = new Date(2021,5,24);
      r.tasks = this.tasks;
      r.activities = this.activities;
      r.render();
      this.renderer = r;
    }
  }