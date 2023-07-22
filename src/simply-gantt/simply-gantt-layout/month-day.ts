import GanttActivity from "../simply-gantt-components/activities";

export function YearMonthRenderer(root){

    var shadowRoot = root;

    var names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    this.tasks=[];
    this.activities = [];

    this.dateFrom = new Date();
    this.dateTo = new Date();

    var monthSelectFrom;
    var yearSelectFrom;
    var monthSelectTo;
    var yearSelectTo;

    this.selectedActivity = null;
    this.selectedActivityElement = null;

    var getYearFrom = function() {
      return parseInt(yearSelectFrom.value);
    }

    var setYearFrom = function(newValue) {
      yearSelectFrom.value = newValue;
    }

    var getYearTo = function() {
      return parseInt(yearSelectTo.value);
    }

    var setYearTo = function(newValue) {
      yearSelectTo.value = newValue;
    }

    var getMonthFrom = function() {
      return parseInt(monthSelectFrom.value);
    }

    var setMonthFrom = function(newValue) {
      monthSelectFrom.value = newValue;
    }

    var getMonthTo = function() {
      return parseInt(monthSelectTo.value);
    }

    var setMonthTo = function(newValue) {
      monthSelectTo.value = newValue;
    }
  
    var checkElements = function(){

      if(shadowRoot && yearSelectFrom && yearSelectTo && monthSelectFrom && monthSelectTo){
        return true;
      }
      return false;
    }

    this.clear = function(){

      if(checkElements()){
        yearSelectFrom.removeEventListener('change', initGantt);
        yearSelectFrom.remove();

        yearSelectTo.removeEventListener('change', initGantt);
        yearSelectTo.remove();

        monthSelectFrom.removeEventListener('change', initGantt);
        monthSelectFrom.remove();

        monthSelectTo.removeEventListener('change', initGantt);
        monthSelectTo.remove();

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
      
          <select id="from-select-year" name="from-select-year"></select>
          <select id="from-select-month" name="from-select-month">
            <option value="0">Jan</option>
            <option value="1">Feb</option>
            <option value="2">Mar</option>
            <option value="3">Apr</option>
            <option value="4">May</option>
            <option value="5">Jun</option>
            <option value="6">Jul</option>
            <option value="7">Aug</option>
            <option value="8">Sep</option>
            <option value="9">Okt</option>
            <option value="10">Nov</option>
            <option value="11">Dec</option>   
          </select>
       
        `;

        shadowRoot.querySelector("#select-to").innerHTML += `
        
          <select id="to-select-year" name="to-select-year"></select>
          <select id="to-select-month" name="to-select-month">
            <option value="0">Jan</option>
            <option value="1">Feb</option>
            <option value="2">Mar</option>
            <option value="3">Apr</option>
            <option value="4">May</option>
            <option value="5">Jun</option>
            <option value="6">Jul</option>
            <option value="7">Aug</option>
            <option value="8">Sep</option>
            <option value="9">Okt</option>
            <option value="10">Nov</option>
            <option value="11">Dec</option>   
          </select>
        `;

        for(var y=2000; y<=2100; y++){
          shadowRoot.querySelector("#from-select-year").innerHTML += `
          <option value="${y}">${y}</option>
          `;
          shadowRoot.querySelector("#to-select-year").innerHTML += `
          <option value="${y}">${y}</option>
          `;
        }

        monthSelectFrom = shadowRoot.querySelector('#from-select-month');
        yearSelectFrom =  shadowRoot.querySelector('#from-select-year');
        monthSelectTo = shadowRoot.querySelector('#to-select-month');
        yearSelectTo =  shadowRoot.querySelector('#to-select-year');

        yearSelectFrom.addEventListener('change', initGantt);
        monthSelectFrom.addEventListener('change', initGantt);   
        yearSelectTo.addEventListener('change', initGantt);
        monthSelectTo.addEventListener('change', initGantt);  
         
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
      if( (getYearFrom() > getYearTo()) || (getYearFrom() == getYearTo() && getMonthFrom() > getMonthTo())){

        monthSelectFrom.style.color="red";
        monthSelectTo.style.color="red";

        yearSelectFrom.style.color="red";
        yearSelectTo.style.color="red";

      }else{

        monthSelectFrom.style.color="black";
        monthSelectTo.style.color="black";

        yearSelectFrom.style.color="black";
        yearSelectTo.style.color="black";

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
    }  
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
              activityElement.activity = activity;
              activityElement.level = "year-month";

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
            }
        });

        makeActivitiesResizable();
        makeActivitiesEditable();
      }
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