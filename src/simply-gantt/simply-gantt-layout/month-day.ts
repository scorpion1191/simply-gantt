import GanttActivity from "../simply-gantt-components/activities";
import GanttEvent from "../simply-gantt-components/events";

export function MonthDayRenderer(root, ganttlayout){

    var shadowRoot = root;
    var layout = ganttlayout
    var names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    this.tasks=[];
    this.activities = [];
    this.events = [];

    this.dateFrom = new Date();
    this.dateTo = new Date();

    var monthSelectFrom;
    var yearSelectFrom;
    var monthSelectTo;
    var yearSelectTo;

    this.selectedActivity = null;
    this.selectedActivityElement = null;

    var getYearFrom = function() {
      return parseInt(yearSelectFrom);
    }

    var setYearFrom = function(newValue) {
      yearSelectFrom = newValue;
    }

    var getYearTo = function() {
      return parseInt(yearSelectTo);
    }

    var setYearTo = function(newValue) {
      yearSelectTo = newValue;
    }

    var getMonthFrom = function() {
      return parseInt(monthSelectFrom);
    }

    var setMonthFrom = function(newValue) {
      monthSelectFrom = newValue;
    }

    var getMonthTo = function() {
      return parseInt(monthSelectTo);
    }

    var setMonthTo = function(newValue) {
      monthSelectTo = newValue;
    }
  
    var checkElements = function(){

      if(shadowRoot && yearSelectFrom && yearSelectTo && monthSelectFrom && monthSelectTo){
        return true;
      }
      return false;
    }

    this.clear = function(){

      if(checkElements()){
        var container = shadowRoot.querySelector("#gantt-container");
        container.innerHTML = "";
        container.removeEventListener("mousedown", _handleMouseDown, false);
        document.removeEventListener("mouseup", _handleMouseUp, false);
        container.removeEventListener("dblclick", _handleDblClick, false);
      }
    }

    var initSettings = function(){
        if(shadowRoot){ 
            setMonthFrom(this.dateFrom.getMonth());
            setYearFrom(this.dateFrom.getFullYear());
            setMonthTo(this.dateTo.getMonth());
            setYearTo(this.dateTo.getFullYear());
        }
     }.bind(this);

    var initFirstRow = function(){
      
      if(checkElements()){
        var container = shadowRoot.querySelector("#gantt-container");
        var first_month = new Date(getYearFrom(), getMonthFrom(), 1);
        var last_month = new Date(getYearTo(), getMonthTo(), 1);

        var tasks = document.createElement("div");
        tasks.className = "gantt-row-task";
        container.appendChild(tasks);
        var month = new Date(first_month);
        for(month; month <= last_month; month.setMonth(month.getMonth()+1)){
          var period = document.createElement("div");
          period.className = "gantt-row-period";
          period.innerHTML = names[month.getMonth()] + " " + month.getFullYear();
          container.appendChild(period);
        }
      }
    }

    var initSecondRow = function(){

      if(checkElements()){
        var container = shadowRoot.querySelector("#gantt-container");
        var first_month = new Date(getYearFrom(), getMonthFrom(), 1);
        var last_month = new Date(getYearTo(), getMonthTo(), 1);
        var tasks = document.createElement("div");
        tasks.className = "gantt-row-task";
        tasks.style.borderTop = "none";    
        container.appendChild(tasks);
        var month = new Date(first_month);
        for(month; month <= last_month; month.setMonth(month.getMonth()+1)){
            var month_period = <HTMLElement>document.createElement("div");
            month_period.className = "gantt-row-period";
            month_period.style.border = "none";
            container.appendChild(month_period);
            var f_om = new Date(month);
            var l_om = new Date(month.getFullYear(), month.getMonth()+1, 0);
            var date = new Date(f_om);
            for(date; date <= l_om; date.setDate(date.getDate()+1)){
              var period = <HTMLElement>document.createElement("div");
              period.className = "gantt-row-period";
              period.style.borderTop = "none";
              period.innerHTML = date.getDate();
              month_period.appendChild(period);
            } 
        }
      }
    }

    var initGanttRows = function(){
      if(checkElements()){
        var container = shadowRoot.querySelector("#gantt-container");
        var first_month = new Date(getYearFrom(), getMonthFrom(), 1);
        var last_month = new Date(getYearTo(), getMonthTo(), 1);
        this.tasks.forEach(element => {
          var tasks = document.createElement("div");
          tasks.className = "gantt-row-task";
          tasks.style.borderTop = "none";    
          tasks.innerHTML = element.name;
          container.appendChild(tasks);
          var month = new Date(first_month);
          for(month; month <= last_month; month.setMonth(month.getMonth()+1)){
              var month_period = document.createElement("div");
              month_period.className = "gantt-row-period";
              month_period.style.border = "none";
              container.appendChild(month_period);
              var f_om = new Date(month);
              var l_om = new Date(month.getFullYear(), month.getMonth()+1, 0);
              var date = new Date(f_om);
              for(date; date <= l_om; date.setDate(date.getDate()+1)){
                var period = document.createElement("div");
                period.className = "gantt-row-item";
                period.style.borderTop = "none";
                period.style.borderRight = "none";
                if(date.getDay()==0 || date.getDay()==6){
                  period.style.backgroundColor="whitesmoke";
                }
                period.setAttribute("data-date", formatDate(date));
                period.setAttribute("data-task", element.id);
                period.ondrop = onActivityDrop;
                period.ondragover = function(ev){
                  ev.preventDefault();
                }
                month_period.appendChild(period);
              }
          }
        });
      }
    }.bind(this);

    var onActivityDrop = function(ev){
      if(checkElements()){
        var gantt_item = getGanttElementFromPosition(ev.x, ev.y);
        var data = ev.dataTransfer.getData("activity");               
        var activityElement = shadowRoot.getElementById(data);                
        gantt_item.appendChild(activityElement);
        var activity = this.activities.find(j => j.id == data );
        var start = new Date(gantt_item.getAttribute("data-date"));
        var end = new Date(start);
        end.setDate(start.getDate()+dayDiff(activity.start, activity.end));
        activity.start = start;
        activity.end = end;
        activity.tasks = gantt_item.getAttribute("data-task");
        activityElement.update();
      }
    }.bind(this);


    var initGantt = function(){
        if(checkElements()){
            var container = shadowRoot.querySelector("#gantt-container");
            container.innerHTML = "";
            var first_month = new Date(getYearFrom(), getMonthFrom(), 1);
            var last_month = new Date(getYearTo(), getMonthTo(), 1);
            var n_months = monthDiff(first_month, last_month)+1;
            container.style.gridTemplateColumns = `160px repeat(${n_months},1fr)`;
            initFirstRow();
            initSecondRow();
            initGanttRows();
            initActivities();
            initEvents();
        }
    }

  var formatDate = function(d){
    return d.getFullYear()+"-"+zeroPad(d.getMonth()+1)+"-"+zeroPad(d.getDate());
  }

  var zeroPad = function(n){
    return n<10 ? "0"+n : n;
  }

  function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  function dayDiff(d1, d2){
    
    var diffTime = Math.abs(d2 - d1);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  }


  var getGanttElementFromPosition = function(x, y){

    var items = shadowRoot.elementsFromPoint(x, y);
    var gantt_item = items.find(item => item.classList.contains("gantt-row-item"));

    return gantt_item;
  }


  var initActivities = function(){

    if(checkElements()){

        this.activities.forEach(activity => {

            var date_string = formatDate(activity.start);
            var ganttElement = <HTMLElement>shadowRoot.querySelector(`div[data-task="${activity.task}"][data-date="${date_string}"]`);

            if(ganttElement){
    
              var activityElement = <GanttActivity>document.createElement("gantt-activity");
              activityElement.id = activity.id;
              activityElement.data = activity;
              activityElement.layout = layout;

              ganttElement.appendChild(activityElement);

              if(!customElements.get('gantt-activity')) {
                customElements.define('gantt-activity', GanttActivity)
              }
            
              activityElement.ondragstart = function(ev){
                  ev.dataTransfer.setData("activity", ev.target.id);           
              };

              activityElement.addEventListener("editActivity", (ev) =>{

                var date_string = formatDate(activity.start);
                var gantt_item = shadowRoot.querySelector(`div[data-task="${activity.task}"][data-date="${date_string}"]`);
                gantt_item.appendChild(activityElement);
                
              });

              activityElement.addEventListener("click", function() {
                if(layout?.activity && layout.activity?.click) {
                  layout.activity.click(activity); 
                }
              });
            }
        });

        makeActivitiesResizable();
        makeActivitiesEditable();
      }
  }.bind(this);

  var initEvents = function(){

    this.events.forEach(event => {

        var date_string = formatDate(event.date);
        var ganttElement = shadowRoot.querySelector(`div[data-task="${event.task}"][data-date="${date_string}"]`);

        if(ganttElement){

          var eventElement = <GanttEvent>document.createElement("gantt-event");
          eventElement.id = event.id;
          eventElement.event = event;
          eventElement.layout = layout;

          ganttElement.appendChild(eventElement);

          eventElement.addEventListener("click", function() {
            if(layout?.event && layout.event?.click) {
              layout.activity.click(event); 
            }
          });
          
        }
        if(!customElements.get('gantt-event')) {
            customElements.define('gantt-event', GanttEvent)
        }
    });
    
  }.bind(this);

  var makeActivitiesResizable = function(){

    if(checkElements()){

      var container = shadowRoot.querySelector("#gantt-container");

      container.addEventListener("mousedown", _handleMouseDown, false);
      
    }

  }.bind(this);


  var makeActivitiesEditable = function(){

    if(checkElements()){

      var container = shadowRoot.querySelector("#gantt-container");

      container.addEventListener("dblclick", _handleDblClick, false);
      
    }

  }.bind(this);


  var _handleDblClick = function(e){

    if(e.target.tagName == "GANTT-ACTIVITY"){

      var activityElement = e.target;
      activityElement._handleDblClick();
    }
  }


  var _handleMouseDown = function(e){
  
      if(e.target.tagName == "GANTT-ACTIVITY"){

       this.selectedActivityElement = e.target;
       
       if(this.selectedActivityElement.isMouseOverDragHandle(e)){
               
          this.selectedActivity = this.activities.find(j => j.id == e.target.id);

          document.addEventListener("mousemove", _handleMouseMove, false);

          document.addEventListener("mouseup", _handleMouseUp, false);

          e.preventDefault();
        }
      }
    }.bind(this);



    var _handleMouseMove = function(ev){            
         
      var gantt_item = getGanttElementFromPosition(ev.x, ev.y);

      if(this.selectedActivity && this.selectedActivityElement){
        this.selectedActivity.end = new Date(gantt_item.getAttribute("data-date"));
        this.selectedActivityElement.update();
      }

    }.bind(this);


    var _handleMouseUp = function(){ 

      this.selectedActivity = null;
      this.selectedActivityElement = null;
      document.removeEventListener("mousemove", _handleMouseMove, false);
      
    }.bind(this);


  
  this.render = function(){
      this.clear();
      initSettings();
      initGantt();
   }
}