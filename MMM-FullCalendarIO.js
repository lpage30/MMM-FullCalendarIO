const FullCalendarIO = {
	startIntervalUpdate: (theModule) => {
		if (theModule.config.updateInterval > 0) {
			theModule.intervalId = setInterval(() => theModule.updateDom(), theModule.config.updateInterval);
		}
	},
	startMidnightRefresh: (theModule) => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		const nextMidnight = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
		const now = new Date();
		const msTilMidnight = nextMidnight - now
		theModule.midnightTimeoutId = setTimeout(() => {
			theModule.updateDom();
			FullCalendarIO.startMidnightRefresh(theModule);
		}, msTilMidnight);
	},
	resume: function () {
		this.render = true;
		this.updateDom();
	},

	suspend: function () {
		this.render = false;
		this.updateDom();
	},

	start: function () {
		this.render = !this.hidden;
		this.updateDom();
		FullCalendarIO.startIntervalUpdate(this);
		FullCalendarIO.startMidnightRefresh(this);
	},

	getDom: function () {
		if (!this.render) {
			return document.createElement('div');
		}
		var calendarFrame = document.createElement("iframe");
		calendarFrame.setAttribute('src', `${location.href}${this.data.path}/generatedCalendarHTML/${this.config.identifier}.html`);
		if (this.config.cssClassname) calendarFrame.className = this.config.cssClassname;
		return calendarFrame;
	},
	defaults: {
		updateInterval: 0,
		identifier: 'calendar',
		themeName: 'flatly',
		backgroundColor: '#A9A9A9',
		dayNameHTMLTransformation: (dayName) => dayName,
		monthDayNumberHTMLTransformation: (month, day, momentModule) => `${momentModule.monthsShort(month-1)} ${day}`,
		fullcalendar: {
			themeSystem: 'bootstrap4',
			height: 'parent',
			contentHeight: 'auto',
			header: {
				left: '',
				center: 'title',
				right: ''
			},
			footer: {
				left: 'listDay,listWeek,month,threeMonths,  prev,today,next',
				center: '',
				right: '',
			},
			defaultView: 'threeMonths',
			views: {
				listDay: { buttonText: 'day' },
				listWeek: { buttonText: 'week'},
				threeMonths: { type: 'multimonth', duration: { weeks: 12 }, buttonText: '3-mos' },
			},
			// to be used in eventClick to show event in EventContent div below
			eventClick: function showEventContentDiv (calEvent, jsEvent, view) {
				$('#eventTitle').html('');
				$('#eventStart').html('');
				$('#eventEnd').html('');
				$("#eventDescription").html('');
				$("#eventLocation").html('');
				
				$('#eventTitle').html(`<B>${calEvent.title}</B>`);
				if(calEvent.start) $('#eventStart').html(`Start: ${moment(calEvent.start).format('MMM Do h:mm A')}`)
				if (calEvent.end) $('#eventEnd').html(`End: ${moment(calEvent.end).format('MMM Do h:mm A')}`);
				if (calEvent.description) $("#eventDescription").html(`Description: ${calEvent.description}`);
				if (calEvent.location) $("#eventLocation").html(`Location: ${calEvent.location}`);
					$("#eventContent").dialog({ modal: true });
					return false;
			},
		},  
	}
};
if (typeof Module !== 'undefined') {
	Module.register('MMM-FullCalendarIO', FullCalendarIO);
} else {
	module.exports = FullCalendarIO;
}
