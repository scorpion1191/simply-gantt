import GanttActivity from "../simply-gantt-components/activities";

export function DateTimeRenderer(root){

    var shadowRoot = root;

    var names = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    
    this.tasks=[];
    this.activities = [];

    this.selectedActivity = null;
    this.selectedActivityElement = null;

    this.dateFrom = new Date();
    this.dateTo = new Date();

    var dateSelectFrom;
    var dateSelectTo;
   
    var getDateFrom = function() {
      return dateSelectFrom.value;
    }

    var setDateFrom = function(newValue) {
      dateSelectFrom.value = newValue;
    }

    var getDateTo = function() {
      return dateSelectTo.value;
    }

    var setDateTo = function(newValue) {
      dateSelectTo.value = newValue;
    }
    

    var checkElements = function(){

      if(shadowRoot && dateSelectFrom && dateSelectTo){
        return true;
      }
      return false;
    }

    this.clear = function(){

      if(checkElements()){
        
        dateSelectFrom.removeEventListener('change', initGantt);
        dateSelectFrom.remove();

        dateSelectTo.removeEventListener('change', initGantt);
        dateSelectTo.remove();

        var container = shadowRoot.querySelector("#gantt-container");
        container.innerHTML = "";

        container.removeEventListener("mousedown", _handleMouseDown, false);
        document.removeEventListener("mouseup", _handleMouseUp, false);
        container.removeEventListener("dblclick", _handleDblClick, false);
      }
    }

    var initSettings = function(){

        if(shadowRoot){
        shadowRoot.querySelector("#select-from").innerHTML += `
      
           <input type="date" id="from-select-date" name="from-select-date" min="2000/1/1" max="2050/12/31">   
        `;

        shadowRoot.querySelector("#select-to").innerHTML += `
        
            <input type="date" id="to-select-date" name="to-select-date"> 
        `;

        dateSelectFrom = shadowRoot.querySelector('#from-select-date');
        dateSelectTo = shadowRoot.querySelector('#to-select-date');
        
        dateSelectFrom.addEventListener('change', initGantt);
        dateSelectTo.addEventListener('change', initGantt);
         
        setDateFrom(`${this.dateFrom.getFullYear()}-${zeroPad(this.dateFrom.getMonth()+1)}-${zeroPad(this.dateFrom.getDate())}`);
        setDateTo(`${this.dateTo.getFullYear()}-${zeroPad(this.dateTo.getMonth()+1)}-${zeroPad(this.dateTo.getDate())}`);
      }
    }.bind(this);

    var initFirstRow = function(){
      
      if(checkElements()){

        var container = shadowRoot.querySelector("#gantt-container");
        var first_date = new Date(getDateFrom());
        var last_date = new Date(getDateTo());

        var task = document.createElement("div");
        task.className = "gantt-row-task";
        container.appendChild(task);

        var date = new Date(first_date);
        date.setHours(0);

        for(date; date <= last_date; date.setDate(date.getDate()+1)){

            date.setHours(0);
            
            var date_period = document.createElement("div");
            date_period.className = "gantt-row-period";
            
            date_period.innerHTML = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" ("+names[date.getDay()]+")";

            container.appendChild(date_period);
        }
      }
    }

    var initSecondRow = function(){

      if(checkElements()){
        
        var container = shadowRoot.querySelector("#gantt-container");
        var first_date = new Date(getDateFrom());
        var last_date = new Date(getDateTo());

        var task = document.createElement("div");
        task.className = "gantt-row-task";
        task.style.borderTop = "none";    
        container.appendChild(task);

        var date = new Date(first_date);
        date.setHours(0);

        for(date; date <= last_date; date.setDate(date.getDate()+1)){

            date.setHours(0);
            
            var date_period = document.createElement("div");
            date_period.className = "gantt-row-period";
            date_period.style.border = "none";
            container.appendChild(date_period);

            for(var h = 0; h<24; h++){
                
              var period = <HTMLElement>document.createElement("div");
              period.className = "gantt-row-period";
              period.style.borderTop = "none";
              period.innerHTML = h;
              
              date_period.appendChild(period);
            } 
        }
      }
    }

    var initGanttRows = function(){
      
      if(checkElements()){
        
        var container = shadowRoot.querySelector("#gantt-container");
        var first_date = new Date(getDateFrom());
        var last_date = new Date(getDateTo());

        this.tasks.forEach(element => {

        var task = document.createElement("div");
        task.className = "gantt-row-task";
        task.innerHTML = element.name;
        task.style.borderTop = "none";    
        container.appendChild(task);

        var date = new Date(first_date);
        date.setHours(0);

        for(date; date <= last_date; date.setDate(date.getDate()+1)){

            date.setHours(0);
            
            var date_period = document.createElement("div");
            date_period.className = "gantt-row-period";
            date_period.style.border = "none";
            container.appendChild(date_period);

            for(var h = 0; h<24; h++){

                var item_date = new Date(date);
                item_date.setHours(h);
                
                var period = document.createElement("div");
                period.className = "gantt-row-item";
                period.style.borderTop = "none";
                period.style.borderRight = "none";
                
                if(h==23){
                    period.style.borderRight = "1px solid";
                }
                
                var date_string = formatDate(item_date);
                period.setAttribute("data-date", date_string);
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

        if(getDateFrom() > getDateTo()){

          dateSelectFrom.style.color="red";
          dateSelectTo.style.color="red";
  
        }else{

          dateSelectFrom.style.color="black";
          dateSelectTo.style.color="black";

          var container = shadowRoot.querySelector("#gantt-container");
          container.innerHTML = "";

          var first_date = new Date(getDateFrom());
          var last_date = new Date(getDateTo());

          var n_Days = dayDiff(first_date, last_date) 
      
          container.style.gridTemplateColumns = `160px repeat(${n_Days+1},1fr)`;

          initFirstRow();

          initSecondRow();

          initGanttRows();

          initJobs();
        }
     }
  }

  var formatDate = function(d){

    return d.getFullYear()+"-"+zeroPad(d.getMonth()+1)+"-"+zeroPad(d.getDate())+"T"+zeroPad(d.getHours())+":00:00";
    
  }

  var zeroPad = function(n){

    return n<10 ? "0"+n : n;

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
          activityElement.id = activity.id;
          activityElement.activity = activity;
          activityElement.layout = "day";

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