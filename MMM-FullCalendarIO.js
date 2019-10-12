Module.register('MMM-FullCalendarIO', {
	startIntervalUpdate: () => {
		const config = this.getFullConfiguration();
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
		if (notification.startsWith('REQUIRE_')){
			const moduleName = notification.split('/').pop();
			if ('application_paths' === moduleName) {
				const { HOST_ADDRESS, MMM_SERVER_PORT } = result;
				this.calendarUIURL = `http://${HOST_ADDRESS}:${MMM_SERVER_PORT}`
			}
		}
	},
	start: function () {
		const config = this.getFullConfiguration();
		this.serverRunning = false
		this.sendSocketNotification('REQUIRE_./application_paths');
		this.sendSocketNotification('MODULE_STARTED', config);
	},
	getFullConfiguration: function () {
		if (this.fullConfig) return this.fullConfig;

		const config = {...this.defaults, ...this.config};
		if (this.config.fullcalendar) {
			config.fullcalendar = {...this.defaults.fullcalendar, ...this.config.fullcalendar};
			if (this.config.fullcalendar.header) {
				config.fullcalendar.header = {...this.defaults.fullcalendar.header, ...this.config.fullcalendar.header};
			}
			if (this.config.fullcalendar.footer) {
				config.fullcalendar.footer = {...this.defaults.fullcalendar.footer, ...this.config.fullcalendar.footer};
			}
			if (this.config.fullcalendar.views) {
				config.fullcalendar.views = {...this.defaults.fullcalendar.views, ...this.config.fullcalendar.views};
			}
		}
		this.fullConfig = config;
		return this.fullConfig;
	},
	getStyles: function () {
		return [
			this.file('custom.css'),
		]
	},
	getDom: function () {
		const config = this.getFullConfiguration();
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
