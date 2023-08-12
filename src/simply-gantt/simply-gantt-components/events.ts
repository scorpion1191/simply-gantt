const template = document.createElement('template');

template.innerHTML = 
`<style>
    .event-container{
        width: 100%;
        height: 100%;
        text-align: center;
        display: grid;
        align-items: center;
        justify-items: center;
        position: relative;
        z-index: 110;
    }
    .event-container:hover{
      box-shadow: 0px 2px 5px 1px;
    }
    .event-shape{
        width: 50%;
        height: 50%;
        display: inline-block;
    }
    .event-circle{
        border-radius: 50% 50%;
    }
    .event-triangle{
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        -webkit-clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    }
</style>
<div class="event-container">
    <div class="event"></div>
</div>`;

export default class GanttEvent extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  _event;
  _layout = { type: "month", event: { type: '', style: {}}};
  _type;

  connectedCallback() {
      var eventElement = <HTMLElement>this.shadowRoot.querySelector(".event-container");
      eventElement.id = this.id;
      let eventStyle = this._event?.style ? this._event?.style : {};
      let layoutStyle = this.layout?.event.style ? this.layout?.event.style : {};
      let eventShapeType = this._event?.type ? this._event?.type : this.layout?.event.type
      this.setEventStyle(eventShapeType, {...layoutStyle, ...eventStyle})
      this._render();
  }

  disconnectedCallback() {}

  update(){
    this._render();
  }

  _render(){
    var jobElement = <HTMLElement>this.shadowRoot.querySelector(".event");
    var d;
  }

  set event(newValue){
      this._event = newValue;
      this._render();
  }

  get event(){
      return this._event;
  }

  set layout(newValue){
    this._layout = newValue;
  }

  get layout(){
      return this._layout;
  }

  set type(newValue){
    this._type = newValue;
  }

  get type(){
      return this._type;
  }

  setEventStyle(type, style){
    var eventElement = <HTMLElement>this.shadowRoot.querySelector(".event")
    eventElement.classList.add("event-shape")
    if(type === 'circle'){
        eventElement.classList.add("event-circle")
    }else if(type === 'triangle'){
        eventElement.classList.add("event-triangle")
    }
    for(const key in style) {
        eventElement.style[key] = style[key]
    }
  }
}

