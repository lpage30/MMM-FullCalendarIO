const FullCalendarIO = {
	startIntervalUpdate: (theModule) => {
		if (theModule.config.updateInterval > 0) {
			theModule.intervalId = setInterval(() => theModule.updateDom(), theModule.config.updateInterval);
		}
	},

	stopIntervalUpdate: (theModule) => {
		const intervalId = theModule.intervalId;
		theModule.intervalId = null;
		if (intervalId) {
			clearInterval(intervalId);
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
	stopMidnightRefresh: (theModule) => {
		const midnightTimeoutId = theModule.midnightTimeoutId;
		theModule.midnightTimeoutId = null;
		if (midnightTimeoutId) {
			clearTimeout(midnightTimeoutId);
		}
	}
};
Module.register('MMM-FullCalendarIO', {
	// Default module config.
	defaults: {
		updateInterval: 0,
		identifier: 'calendar',
		fullcalendar: {},
	},
	resume: function () {
		this.updateDom();
		FullCalendarIO.startIntervalUpdate(this);
		FullCalendarIO.startMidnightRefresh(this);
	},

	suspend: function () {
		FullCalendarIO.stopIntervalUpdate(this);
		FullCalendarIO.stopMidnightRefresh(this);
	},

	start: function () {
		this.updateDom();
		FullCalendarIO.startIntervalUpdate(this);
		FullCalendarIO.startMidnightRefresh(this);
	},

	stop: function () {
		FullCalendarIO.stopIntervalUpdate(this);
		FullCalendarIO.stopMidnightRefresh(this);
	},
  
	getDom: function () {
		var calendarFrame = document.createElement("iframe");
		calendarFrame.setAttribute('src', `${location.href}${this.data.path}/generatedCalendarHTML/${this.config.identifier}.html`);
		if (this.config.cssClassname) calendarFrame.className = this.config.cssClassname;
		return calendarFrame;
	},
});

