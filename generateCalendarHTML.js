const fs = require('fs');
const MODULE_NAME = 'MMM-FullCalendarIO';

const GENERATED_CODE_DIRECTORY = './generatedCalendarHTML';

const CALENDAR_JS_TEMPLATE_FILEPATH = './templates/calendarjs.template';
const CALENDAR_HTML_TEMPLATE_FILEPATH = './templates/calendarhtml.template';

const CONFIGURATION_PLACEMENT_TOKEN = new RegExp('{{CALENDAR_CONFIGURATION}}', 'ig');
const CALENDAR_JS_PLACEMENT_TOKEN = new RegExp('{{CALENDAR_JS}}', 'ig');

/**
 * Loads the calendarConfigurations from MM config file.
 * @returns [{ identifier: <MM-Module-Identifier>, config: { fullcalendar: {} }}] configurations for generation.
 */
const getCalendarConfigurations = () => {
    const calendarConfigurations = []
    const { modules } = require('../../config/config.js');
    modules.forEach((module, index) => {
        if (module.module === MODULE_NAME) {
            calendarConfigurations.push(module.config);
        }
    });
    return calendarConfigurations;
};
/**
 * Generate string of Javascript code to be placed in HTML file 
 * to define (and render) configured calendar(s)
 * @param {Object} config single calendar configuration
 * @returns {string} javascript snippet to be written to html file contents.
 */
const generateCalendarJS = (config) => {
    const calendarConfiguration = JSON.stringify(config.fullcalendar, null, 2);
    const calendarJS = fs.readFileSync(CALENDAR_JS_TEMPLATE_FILEPATH, 'utf8');
    return calendarJS.replace(CONFIGURATION_PLACEMENT_TOKEN, calendarConfiguration);
};
/**
 * Genearte string of HTML code to be written to HTML file for configured calendar(s)
 * @param {Object} config single calendar configuration
 * @returns {string} HTML file contents to be written to html file
 */
const generateCalendarHTML = (config) => {
    const calendarHTML = fs.readFileSync(CALENDAR_HTML_TEMPLATE_FILEPATH, 'utf8');
    const calendarJS = generateCalendarJS(config);
    return calendarHTML.replace(CALENDAR_JS_PLACEMENT_TOKEN, calendarJS);
};
/**
 * Load configurd calendars.
 * Generate HTML file for each configured calendar using the module identifier as the filename prefix.
 */
const generateCalendarHTMLFiles = () => {
    if(!fs.existsSync(GENERATED_CODE_DIRECTORY)) {
        fs.mkdirSync(GENERATED_CODE_DIRECTORY);
    }
    const calendarConfigs = getCalendarConfigurations() || [];
    calendarConfigs.forEach((calendarConfig) => {
        const calendarHTMLFilename = `${GENERATED_CODE_DIRECTORY}/${calendarConfig.identifier}.html`;
        const calendarHTML = generateCalendarHTML(calendarConfig);
        fs.writeFileSync(calendarHTMLFilename, calendarHTML, 'utf8');
    });
};

if (typeof module !== "undefined") {
    generateCalendarHTMLFiles();
} else {
    module.exports = { generateCalendarHTMLFiles };
}
