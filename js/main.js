/**
 * Calendar class
 */
function Calendar(options){
	//default options
	this.opts = {
		id:'calendar', //id of element on a webpage to install calendar
		activeClass:'jcal-active', //class name of an active day
		today:new Date(), //todays date
		showForm:true //show interface form of not
	};
	//if some options passed to constructor of class
	if(options!==undefined){
		for(var ops in options){
			//add only allowed options
			if(this.opts[ops]!==undefined)
				this.opts[ops] = options[ops];
		}
	}
	//setting current date
	this.currentDate = new Date();
	//declaring array of days of current month
	this.currentDays = [];

	/**
	 * Returns array of days of the month
	 * @param  {int} year  [optional]
	 * @param  {int} month [optional]
	 * @return {array}  
	 */
	this.getDates = function(year, month){
		//needed variables
		var weeks = [],
            week = [],
            date, jmonth, jyear;
        //reset if array of days
        this.currentDays = [];
        //checking passed arguments
        if(arguments.length == 0){
        	jmonth = this.currentDate.getMonth();
        	jyear = this.currentDate.getFullYear();
        	date = this.firstDayOfWeek(new Date(jyear,jmonth, 1));
        }else{
        	jmonth = month;
        	jyear = year;
        	this.currentDate = new Date(year, month, 1);
        	date = this.firstDayOfWeek(this.currentDate);
        }
        //creating array of days of month
        while (((date.getMonth()<=jmonth) && (date.getFullYear()===jyear)) || (((date.getMonth()==11 && date.getFullYear()!==jyear) || date.getMonth()==jmonth) && (date.getFullYear()<=jyear))) {
        	//creating array of week day's numbers
            for (var i=0; i<7; i++) {
            	//filling array of current month days
            	if(date.getMonth() == jmonth){
            		this.currentDays.push(date);
            	}
                week.push(date);
                date = new Date(date.getTime());
                date.setDate(date.getDate() + 1);
            }
            weeks.push(week);
            week = [];
        }
        return weeks;
	}
	
	/**
	 * Renders options with days of current month
	 */
	this.renderOptions = function(){
		//needed variables
		var days = this.currentDays,
			select = document.getElementById('jcal-date'),
			html = '<option value="0">Select a day</option>';
		//reset from previous month
		select.innerHTML = '';
		//filling days
		days.forEach(function(day){
			html += '<option value="'+day.getTime()+'">'+day.getDate()+'</option>';
		});
		//injecting to select element
		select.innerHTML = html;
	}

	/**
	 * Returns first day of the week
	 * @param  {date object} date 
	 * @return {date object}
	 */
	this.firstDayOfWeek = function(date){
		var firstDay = new Date(date.getTime());
        while (firstDay.getDay() !== 1) {
            firstDay.setDate(firstDay.getDate() - 1);
        }
        return firstDay;
	}

	/**
	 * Changing month to next
	 * @return {[type]} [description]
	 */
	this.nextMonth = function(){
		//setting current date to next month
		this.currentDate.setMonth(this.currentDate.getMonth()+1);
		//checking if year changed
		if(this.currentDate.getMonth().toString().indexOf('-')!=-1)
			this.currentDate.setMonth(0);
		//rendering calendar with new date
		this.render(this.currentDate.getFullYear(), this.currentDate.getMonth());
	}

	/**
	 * Changing month to previous
	 * @return {[type]} [description]
	 */
	this.prevMonth = function(){
		//setting current date to previous month
		this.currentDate.setMonth(this.currentDate.getMonth()-1);
		//checking if year changed
		if(this.currentDate.getMonth().toString().indexOf('-')!=-1)
			this.currentDate.setMonth(0);
		//rendering calendar with new date
		this.render(this.currentDate.getFullYear(), this.currentDate.getMonth());
	}

	/**
	 * Rendering days on the webpage
	 * @param  {int} year  [optional]
	 * @param  {int} month [optional]
	 */
	this.render = function(year, month){
		//checking if args passed
		if(arguments.length == 0){
        	month = this.currentDate.getMonth();
        	year = this.currentDate.getFullYear();
        }
        //declaring needed variables
		var html = "<tbody><tr><th>Mon</th><th>Tus</th><th>Wed</th><th>Thu</th><th>Fri</th><th class='jcal-weekend'>Sat</th><th class='jcal-weekend'>Sun</th></tr>",
			currentDate = this.currentDate,
			opts = this.opts,
			weeks = this.getDates(year, month), //getting array of days
			activeDates = localStorage.getItem('dates') || [], //getting string with day which should be active
			classes;

        //filling html with data, month
		weeks.forEach(function(week){
			html += "<tr>";
			//filling week
			week.forEach(function(day){
				classes = 'jcal-item';
				if (currentDate.getMonth() != day.getMonth())
					classes += ' jcal-other-month';
				if (day.getDay() == 0 || day.getDay() == 6)
					classes += ' jcal-weekend';
				if (((opts.today.getDate() == day.getDate()) && (opts.today.getMonth() == day.getMonth()) && (opts.today.getFullYear() == day.getFullYear())) || (activeDates.indexOf(day.getTime())!==-1))
					classes += ' ' + opts.activeClass;

				html += "<td class='"+classes+"' data-v='"+day.getTime()+"'>"+day.getDate()+"</td>"
			});

			html += "</tr>";
		});

		html += "</tbody>";
		//injecting label of current month
		document.getElementById('jcal-current-date').innerHTML = this.label(weeks[2][2]); //taking day in the moddle of the month
		//injecting month days
		document.getElementById('jcal-dates').innerHTML = html;
		//checking if form should be shown than rendering options for select
		if(this.opts.showForm)
			this.renderOptions();
	}
	/**
	 * Returns name of the month
	 * @param  {date object} date 
	 * @return {string}      label for current month
	 */
	this.label = function(date){
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		return monthNames[date.getMonth()]+' '+date.getFullYear();
	}
	//initialization of calendar
	this.init = function(){
		//setting needed variables
		var self = this,
			last = [],
			store = '',
			html = "<div id='jcal'><table id='jcal-controll-block'><tbody><tr><td><a href='#' class='jcal-btn jcal-prev'>Prev</a></td><td id='jcal-current-date'></td><td><a href='#' class='jcal-btn jcal-next'>Next</a></td></tr></tbody></table><table id='jcal-dates'></table></div>",
			form = "<div id='jcal-calendar-form'><form action='#' id='jcal-form'><p>Select a day of current month</p>	<label for='jcal-date'>Date</label><select type='text' name='jcal-date' id='jcal-date'></select><p>or enter the date</p><label for='jcal-date-formated'>Date</label><input type='text' name='jcal-date-formated' placeholder='DD/MM/YYYY' id='jcal-date-formated' /><br><label for='jcal-class'>CSS class name</label><input type='text' name='jcal-class' id='jcal-class' /><br><input type='submit' value='Set as active'><input type='button' value='Reset all active' id='jcal-reset'></form></div><div style='clear:both;'></div>";
		//initial injection of calendar's html code to element with given in options id (default #calendar)
		if(document.getElementById(self.opts.id)!==null)
			document.getElementById(self.opts.id).innerHTML = (self.opts.showForm) ? html+form : html;
		else return;

		//rendering calendar of current month
		self.render();
		
		//handling prev month click
		document.getElementsByClassName('jcal-prev')[0].addEventListener('click', function(e){
			e.preventDefault();
			self.prevMonth()
		}, false);
		
		//handling next month click
		document.getElementsByClassName('jcal-next')[0].addEventListener('click', function(e){
			e.preventDefault();
			self.nextMonth()
		}, false);

		//checking if form should be shown
		if(self.opts.showForm){ 
			//saving last used className for active day	
			last.push(self.opts.activeClass);

			//initialization of localStorage
			if(localStorage.getItem('dates')==null || localStorage.getItem('dates').length == 0)
				localStorage.setItem('dates', store);

			//handling submit event of the form
			document.getElementById('jcal-form').addEventListener('submit', function(e){
				e.preventDefault();
				var date = this['jcal-date'].value,
					date2 = this['jcal-date-formated'].value,
					className = this['jcal-class'].value,
					reg = /(^((((0[1-9])|([1-2][0-9])|(3[0-1]))|([1-9]))\x2F(((0[1-9])|(1[0-2]))|([1-9]))\x2F(([0-9]{2})|(((19)|([2]([0]{1})))([0-9]{2}))))$)/,
					str,
					saved;
				//checking if class name is given and changing it, else setting default
				self.opts.activeClass = (className.length!=0) ? className : 'jcal-active';
				className = self.opts.activeClass;
				//checking if date from text input has been entered
				if(date2.length!=0){
					//checking if data is in valid format dd/mm/yyyy
					if(reg.test(date2)){ 
						str = date2.split('/');
						date = new Date(parseInt(str[2]), parseInt(str[1])-1, parseInt(str[0])).getTime();	
						//saving date
						store += date+', ';
					}else{
						//if date is not valid stop
						return false;
					}
				}
				//getting all day elements
				tds = document.getElementsByClassName('jcal-item');
				//looping to set item as ative or/and set new class name
				for (var i = 0; i < tds.length; i++) {
					//changing class name
					if(last[last.length-1]!==className){
						tds[i].className = tds[i].className.replace(new RegExp('\\b' + last[last.length-1] + '\\b'),className);
					}
					//setting day as active
					if(tds[i].dataset.v == date){
						//checking if cell has class name
						if(tds[i].className.indexOf(new RegExp('\\b' + className + '\\b'))==-1){
							//saving date
							store += date+', ';
							tds[i].className = tds[i].className +' '+ className;
						}
					}
					
				};

				//getting saved dates
				saved = localStorage.getItem('dates');
				//resave with a new value
				localStorage.setItem('dates', saved+store);
				//saving last used class name
				last.push(className);
			}, false);

			//handling change event of date field
			document.getElementById('jcal-date-formated').addEventListener('change', function(e){
				//declaring needed variables
				var val = this.value.toString(),
					reg = /(^((((0[1-9])|([1-2][0-9])|(3[0-1]))|([1-9]))\x2F(((0[1-9])|(1[0-2]))|([1-9]))\x2F(([0-9]{2})|(((19)|([2]([0]{1})))([0-9]{2}))))$)/;
				//checking if field has date and it's valid, if not set error class else remove error class
				this.className = (val.length!==0 && !reg.test(val)) ? 'jcal-error' : this.className.replace(new RegExp('\\bjcal-error\\b'),'');
			},false);
			//handling reset event, delete all active elements, but current day
			document.getElementById('jcal-reset').addEventListener('click', function(){
				localStorage.setItem('dates', '');
				self.render();
			}, false);
		}
	}
}

//Loading page and creating new object of Calendar with id option and calling init method
window.addEventListener('load', function(){
	new Calendar({id:'calendar'}).init(); 
}, false);