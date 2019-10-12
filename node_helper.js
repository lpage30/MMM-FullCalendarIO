
const bodyParser = require("body-parser");
const NodeHelper = require("node_helper");
const { spawn } = require('child_process');
const cors = require('cors');
const { readFileSync, writeFileSync } = require('fs');
const {HOST_ADDRESS, MM_PORT, MMM_SERVER_PORT } = require('./application_paths');
const MAGICMIRROR_URI = `http://${HOST_ADDRESS}:${MM_PORT}`;
  
function updateAppSettingsJson() {
    const appSettingsJSONFile = `${__dirname.substring(0, __dirname.indexOf('MagicMirror') + 11)}/modules/MMM-FullCalendarIO/src/assets/appsettings.json`
    const currentSettings = JSON.parse(readFileSync(appSettingsJSONFile, 'utf8'))
    if (currentSettings.moduleURI !== MAGICMIRROR_URI) {
        const newSettings = Object.assign(currentSettings, {
            moduleURI: MAGICMIRROR_URI
        });
        writeFileSync(appSettingsJSONFile, JSON.stringify(newSettings, null, 1));
    }
}
module.exports = NodeHelper.create({

    socketNotificationReceived: function(notification, config) {
		if (notification === 'MODULE_STARTED') {
            console.error('CONFIG', config);
            this.config[config.identifier] = config;
            this.moduleStarted = true;
            if (this.serverRunning) {
                this.sendSocketNotification('SERVER_RUNNING');
            }
        }
        if (notification.startsWith('REQUIRE_')) {
            const result = require(notification.substring(8))
            this.sendSocketNotification(notification, result)
        }
	},

    // Subclass start method.
    start: function () {
        this.moduleStarted = false;
        this.serverRunning = false;
        this.config = {};
        updateAppSettingsJson();
        this.expressApp.use(bodyParser.urlencoded({ extended: true }));
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(cors());
        console.log("Starting node helper for: " + this.name);
        this.expressApp.get('/fullcalendario/configuration/:identifier', bodyParser.text('text/html'),
        (req, res) => {
            console.log(`GET-REQUEST config ${req.params.identifier}`)
            if (!this.config[req.params.identifier]) {
                res.status(404).send({ success: false, config: {}});
            } else {
                res.status(200).send({ success: true, config: this.config[req.params.identifier] });
            }
        });
       
        // Start angular server for Module
        this.server = spawn(
            'ng',
            ['serve', '--host', HOST_ADDRESS, '--port', MMM_SERVER_PORT],
            {
                cwd: __dirname, 
            },
        );
        const nodeHelper = this;
        this.server.stdout.on('data', data => {
            const message = data.toString()
            console.info('FullCalendarIO Server', message)
            if (message.indexOf(`listening on ${HOST_ADDRESS}:${MMM_SERVER_PORT}`) > -1) {
                nodeHelper.serverRunning = true;
                nodeHelper.sendSocketNotification('SERVER_RUNNING');
            }
        });
        this.server.on('error', err => {
            console.error('FullCalendarIO Server ERROR', err);
        })
        this.server.on('exit', (code, signal) => {
            console.error('FullCalendarIO Server EXIT', code, signal);
        })
        console.log(`Started ${this.name} at ${HOST_ADDRESS}:${MMM_SERVER_PORT}`);
    },
    stop: function () {
        if (this.server) {
            this.server.kill();
        }
    }
});

