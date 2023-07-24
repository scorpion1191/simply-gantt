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
    #gantt-settings{
      display: flex;
      align-items: center;
      column-gap: 3px;
      font-size:10px;
      margin-bottom: 10px;
    }
    </style>

    <div id="gantt-settings">
      <select name="select-layout" id="select-layout">
        <option value="month">Month</option>
        <option value="day">Day</option>
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
      this.layoutSelect.value = this._layout;
      return this.layoutSelect.value;
    }
    set layout(newValue) {
      this.layoutSelect.value = newValue;
      this._layout = newValue;
      if(this.renderer){
        this.renderer.layout =  this._layout;
      }
    } 
    get renderer(){
      return this._renderer;
    }
    set renderer(r){
      this._renderer = r;
    }
    connectedCallback() {
      this.changeLayout = this.changeLayout.bind(this);
      this.layoutSelect.addEventListener('change', this.changeLayout);
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
      if(this.layoutSelect)
        this.layoutSelect.removeEventListener('change', this.changeLayout);
      if(this.renderer)
        this.renderer.clear();
    }
    changeLayout(){
      if(this.renderer){
        this.renderer.clear();
      }
      var r;
      console.log(this.layoutSelect.value)
      this.layout = this.layoutSelect.value;
      if(this.layout == "month"){
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