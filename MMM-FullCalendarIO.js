function getFullConfiguration(fullCalendarIOModule) {
	if (fullCalendarIOModule.fullConfig) return fullCalendarIOModule.fullConfig;

	const config = {...fullCalendarIOModule.defaults, ...fullCalendarIOModule.config};
	if (fullCalendarIOModule.config.fullcalendar) {
		config.fullcalendar = {...fullCalendarIOModule.defaults.fullcalendar, ...fullCalendarIOModule.config.fullcalendar};
		if (fullCalendarIOModule.config.fullcalendar.header) {
			config.fullcalendar.header = {...fullCalendarIOModule.defaults.fullcalendar.header, ...fullCalendarIOModule.config.fullcalendar.header};
		}
		if (fullCalendarIOModule.config.fullcalendar.footer) {
			config.fullcalendar.footer = {...fullCalendarIOModule.defaults.fullcalendar.footer, ...fullCalendarIOModule.config.fullcalendar.footer};
		}
		if (fullCalendarIOModule.config.fullcalendar.views) {
			config.fullcalendar.views = {...fullCalendarIOModule.defaults.fullcalendar.views, ...fullCalendarIOModule.config.fullcalendar.views};
		}
	}
	fullCalendarIOModule.fullConfig = config;
	return fullCalendarIOModule.fullConfig;
}
Module.register('MMM-FullCalendarIO', {
	startIntervalUpdate: () => {
		const config = getFullConfiguration(this);
		if (config.updateInterval > 0) {
			this.intervalId = setInterval(() => this.updateDom(), config.updateInterval);
		}
	},
	startMidnightRefresh: () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		const nextMidnight = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
		const now = new Date();
		const msTilMidnight = nextMidnight - now
		this.midnightTimeoutId = setTimeout(() => {
			this.updateDom();
			this.startMidnightRefresh();
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
	socketNotificationReceived: function(notification, result) {
		if (notification === 'SERVER_RUNNING') {
			this.serverRunning = true;
			console.log("FullCalendarIOServer is up: REFRESHING MODULE");
			this.render = !this.hidden;
			this.updateDom();
			this.startIntervalUpdate();
			this.startMidnightRefresh();
		}
		if (notification === 'SERVER_STOPPED') {
			this.serverRunning = false;
		}
		if (notification.startsWith('REQUIRE_')){
			const moduleName = notification.split('/').pop();
			if ('application_paths' === moduleName) {
				const { HOST_ADDRESS, MMM_SERVER_PORT } = result;
				this.calendarUIURL = `http://${HOST_ADDRESS}:${MMM_SERVER_PORT}`
			}
		}
	},
	start: function () {
		const config = getFullConfiguration(this);
		this.serverRunning = false
		this.sendSocketNotification('REQUIRE_./application_paths');
		this.sendSocketNotification('MODULE_STARTED', config);
	},
	
	getStyles: function () {
		return [
			this.file('custom.css'),
		]
	},
	getDom: function () {
		const config = getFullConfiguration(this);
		var calendarUI;
		if(this.serverRunning) {
			calendarUI = document.createElement("iframe");
			calendarUI.setAttribute('src', `${this.calendarUIURL}?identifier=${config.identifier}`);
		} else {
			calendarUI = document.createElement("div");
			calendarUI.innerHTML = 'Loading...'
		}
		if (config.cssClassname) calendarUI.className = config.cssClassname;
		return calendarUI;
	},
	defaults: {
		updateInterval: 0,
		identifier: 'calendar',
		themeName: 'flatly',
		backgroundColor: '#A9A9A9',
		fullcalendar: {
			themeSystem: 'bootstrap4',
			height: 'parent',
			contentHeight: 'auto',
			header: {
				left: 'title',
				center: '',
				right: 'listDay,listWeek,month,threeMonths,  prev,today,next'
			},
			defaultView: 'threeMonths',
			views: {
				listDay: { buttonText: 'day' },
				listWeek: { buttonText: 'week'},
				threeMonths: { type: 'multimonth', duration: { weeks: 12 }, buttonText: '3-mos' },
			},
		},  
	}
});
