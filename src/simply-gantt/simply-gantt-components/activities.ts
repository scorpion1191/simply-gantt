const template = document.createElement('template');

template.innerHTML = 
`<style>
    .activity{
        position: absolute;
        height:38px;
        top:5px;
        width: calc(2*100%);
        z-index: 100;
        background-color:#1cad2d;
        border-radius: 0px;
        cursor: pointer;
    }

    .activity::after {
        content: '';
        background-color: #646965;
        position: absolute;
        right: 0;
        width: 4px;
        height: 100%;
        cursor: ew-resize;
    }
</style>
<div class="activity"></div>`;

export default class GanttActivity extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  _activity;
  _level = "year-month";

  connectedCallback() {
      var activityElement = <HTMLElement>this.shadowRoot.querySelector(".activity");
      activityElement.id = this.id;
      activityElement.draggable = true;
      this._render();
  }

  disconnectedCallback() {}

  update(){
    this._render();
  }

  _render(){
    var jobElement = <HTMLElement>this.shadowRoot.querySelector(".activity");
    var d;
    if(this._level == "year-month"){
      d = this._dayDiff(this.activity.start, this.activity.end);
    }else{//level = "day"
      d = this._hourDiff(this.activity.start, this.activity.end);
    }
    jobElement.style.width = `calc(${d*100}% + ${d}px)`;
  }

  _handleDblClick = function(){}.bind(this);

  isMouseOverDragHandle = function(e){
    var panel = this.shadowRoot.querySelector(".activity");
    var current_width = parseInt(getComputedStyle(panel, '').width);
    if (e.offsetX >= (current_width - this._HANDLE_SIZE)) {
      return true;
    }
    return false;
  }.bind(this);


  _HANDLE_SIZE = 4;

  _dayDiff(d1, d2){
      var diffTime = Math.abs(d2 - d1);
      var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays;
  }

  _hourDiff(d1, d2){
    var diffTime = Math.abs(d2 - d1);
    var diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
    return diffHours;
  }
  set activity(newValue){
      this._activity = newValue;
      this._render();
  }

  get activity(){
      return this._activity;
  }

  set level(newValue){
    this._level = newValue;
  }

  get level(){
      return this._level;
  }
}

