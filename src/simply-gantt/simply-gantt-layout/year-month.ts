import GanttActivity from "../simply-gantt-components/activities";

export function YearMonthRenderer(root, layout){

    var shadowRoot = root;

    var names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    this.tasks=[];
    this.activities = [];

    this.selectedActivity = null;
    this.selectedActivityElement = null;

    this.dateFrom = new Date();
    this.dateTo = new Date();

    var yearSelectFrom;
    var yearSelectTo;
   
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
    

    var checkElements = function(){

      if(shadowRoot && yearSelectFrom && yearSelectTo){
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
            setYearFrom(`${this.dateFrom.getFullYear()}`);
            setYearTo(`${this.dateTo.getFullYear()}`);
        }
    }.bind(this);

    var initFirstRow = function(){
      
      if(checkElements()){

        var container = shadowRoot.querySelector("#gantt-container");
        var first_date = getYearFrom();
        var last_date = getYearTo();

        var task = document.createElement("div");
        task.className = "gantt-row-task gantt-header-one";
        container.appendChild(task);


        for(let i = first_date; i <= last_date; i++){
            
            var date_period = document.createElement("div");
            date_period.className = "gantt-row-period gantt-header-one";
            
            date_period.innerHTML = i.toString();

            container.appendChild(date_period);
        }
      }
    }

    var initSecondRow = function(){

      if(checkElements()){
        
        var container = shadowRoot.querySelector("#gantt-container");
        var first_date = getYearFrom();
        var last_date = getYearTo();

        var task = document.createElement("div");
        task.className = "gantt-row-task gantt-header-two";
        task.style.borderTop = "none";    
        container.appendChild(task);

        for(let i = first_date; i <= last_date; i++){

            var date_period = document.createElement("div");
            date_period.className = "gantt-row-period gantt-header-two";
            date_period.style.border = "none";
            container.appendChild(date_period);

            for(var day = 0; day<names.length; day++){
                
              var period = <HTMLElement>document.createElement("div");
              period.className = "gantt-row-period gantt-header-two";
              period.style.borderTop = "none";
              period.innerHTML = names[day];
              
              date_period.appendChild(period);
            } 
        }
      }
    }

    var initGanttRows = function(){
      
      if(checkElements()){
        
        var container = shadowRoot.querySelector("#gantt-container");
        var first_date = getYearFrom();
        var last_date = getYearTo();

        this.tasks.forEach(element => {

        var task = document.createElement("div");
        task.className = "gantt-row-task";
        task.innerHTML = element.name;
        task.style.borderTop = "none";    
        container.appendChild(task);

        for(let i = first_date; i <= last_date; i++){
            
            var date_period = document.createElement("div");
            date_period.className = "gantt-row-period";
            date_period.style.border = "none";
            container.appendChild(date_period);

            for(var day = 0; day<names.length; day++){

                var period = document.createElement("div");
                period.className = "gantt-row-item";
                period.style.borderTop = "none";
                period.style.borderRight = "none";
                
                if(day==names.length){
                    period.style.borderRight = "1px solid";
                }
                
                period.setAttribute("data-date", i+"-"+day);
                period.setAttribute("data-task", element.id);

                period.ondrop = onActivityDrop;

                period.ondragover = function(ev){
                  ev.preventDefault();
                }
              
                date_period.appendChild(period);
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
        end.setHours(start.getHours()+hourDiff(activity.start, activity.end));

        activity.start = start;
        activity.end = end;
        activity.task = gantt_item.getAttribute("data-task");
        activityElement.update();
      }
    }.bind(this);
    var initGantt = function(){
      if(checkElements()){
        var container = shadowRoot.querySelector("#gantt-container");
        container.innerHTML = "";
        var first_date = new Date(getYearFrom());
        var last_date = new Date(getYearTo());
        var n_Days = dayDiff(first_date, last_date) 
        container.style.gridTemplateColumns = `160px repeat(${n_Days+1},1fr)`;
        initFirstRow();
        initSecondRow();
        initGanttRows();
        initJobs();
     }
  }

  var formatDate = function(d){
    return d.getFullYear()+"-"+d.getMonth();
  }
  
  function dayDiff(d1, d2){
    
    var diffTime = Math.abs(d2 - d1);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  }

  function hourDiff(d1, d2){

    var diffTime = Math.abs(d2 - d1);
    var diffHours = Math.ceil(diffTime / (1000 * 60 * 60)); 
    return diffHours;
  }

  var getGanttElementFromPosition = function(x, y){
    
    var items = shadowRoot.elementsFromPoint(x, y);
    var gantt_item = items.find(item => item.classList.contains("gantt-row-item"));

    return gantt_item;
  }

  var initJobs = function(){

    this.activities.forEach(activity => {

        var date_string = formatDate(activity.start);
        var ganttElement = shadowRoot.querySelector(`div[data-task="${activity.task}"][data-date="${date_string}"]`);

        if(ganttElement){

          var activityElement = <GanttActivity>document.createElement("gantt-activity");
          activityElement.layout = layout;
          activityElement.id = activity.id;
          activityElement.data = activity;

          ganttElement.appendChild(activityElement);
          
          activityElement.ondragstart = function(ev){
                ev.dataTransfer.setData("activity", ev.target.id);
          };

          activityElement.addEventListener("resizejob", (ev) =>{

            var gantt_item = getGanttElementFromPosition(ev.detail.x, ev.detail.y);
            activity.end = new Date(gantt_item.getAttribute("data-date"));
            activityElement.update();
            
          });
          
          activityElement.addEventListener("editjob", (ev) =>{

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
        if(!customElements.get('gantt-activity')) {
            customElements.define('gantt-activity', GanttActivity)
        }
    });

    makeJobsResizable();
    makeJobsEditable();
    
  }.bind(this);


  var makeJobsResizable = function(){

    if(checkElements()){

      var container = shadowRoot.querySelector("#gantt-container");

      container.addEventListener("mousedown", _handleMouseDown, false);
      
    }

  }.bind(this);


  var makeJobsEditable = function(){

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
  
      if(e.target.tagName == "GANTT-JOB"){

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