const template = document.createElement('template');

template.innerHTML = 
`<style>
    .activity{
        position: absolute;
        height: 10px;
        bottom: 10px;
        width: calc(2*100%);
        z-index: 100;
        background-color:black;
        cursor: pointer;
    }

    .activity:hover{
      box-shadow: 0px 2px 5px 1px;
    }

    .activity::after {
        content: '';
        background-color: rgba(0,0,0,0.2);;
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

  _data;
  _layout = { type: "month", activity: {style: {}}};

  connectedCallback() {
      var activityElement = <GanttActivity>this.shadowRoot.querySelector(".activity");
      activityElement.id = "activity -" + this.id;
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
    if(this._layout?.type == "month"){
      d = this._dayDiff(this.data.start, this.data.end);
    }else if(this._layout?.type == "day"){//layout = "day"
      d = this._hourDiff(this.data.start, this.data.end);
    }else{
      d = this._monthDiff(this.data.start, this.data.end);
    }

    let activityStyle = this.data?.style ? this.data?.style : {};
    let layoutStyle = this.layout?.activity.style ? this.layout?.activity.style : {};
    this.setActivityStyle({...layoutStyle, ...activityStyle});
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

  _monthDiff(d1, d2){
    const monthDiff = d2.getMonth() - d1.getMonth();
    const yearDiff = d2.getYear() - d1.getYear();
    return (monthDiff + yearDiff * 12) + 1;
  }

  set data(newValue){
      this._data = newValue;
      this._render();
  }

  get data(){
      return this._data;
  }

  set layout(newValue){
    this._layout = newValue;
  }

  get layout(){
      return this._layout;
  }

  setActivityStyle(style){
    var activityElement = <HTMLElement>this.shadowRoot.querySelector(".activity")

    for(const key in style) {
      activityElement.style[key] = style[key]
    }

  }
}

