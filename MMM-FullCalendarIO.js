const startIntervalUpdate = (theModule) => {
	if (theModule.config.updateInterval > 0) {
		theModule.intervalId = setInterval(() => theModule.updateDom(), theModule.config.updateInterval);
	}
};

const stopIntervalUpdate = (theModule) => {
	const intervalId = theModule.intervalId;
	theModule.intervalId = null;
	if (intervalId) {
		clearInterval(intervalId);
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
		startIntervalUpdate(this)
	},

	suspend: function () {
		stopIntervalUpdate(this);
	},

	start: function () {
		this.updateDom();
		startIntervalUpdate(this);
	},
	stop: function () {
		stopIntervalUpdate(this)
	},
  
	getDom: function () {
		var calendarFrame = document.createElement("webview");
		calendarFrame.setAttribute('src', `${location.href}${this.data.path}/generatedCalendarHTML/${this.config.identifier}.html`);
		if (this.config.cssClassname) calendarFrame.className = this.config.cssClassname;
		return calendarFrame;
	},
});

