const fs = require('fs');
const MODULE_NAME = 'MMM-FullCalendarIO';
const { defaults: CALENDAR_DEFAULTS } = require('./MMM-FullCalendarIO');
const GENERATED_CODE_DIRECTORY = './generatedCalendarHTML';

const CALENDAR_JS_TEMPLATE_FILEPATH = './templates/calendarjs.template';
const CALENDAR_HTML_TEMPLATE_FILEPATH = './templates/calendarhtml.template';
const MULTIMONTH_CUSTOMVIEW_JS_FILEPATH = './templates/multimonthCustomView.js'

const THEME_STYLESHEET_PLACEMENT_TOKEN = new RegExp('{{THEME_STYLESHEET}}', 'ig');
const BACKGROUND_COLOR_PLACEMENT_TOKEN = new RegExp('{{BACKGROUND_COLOR}}', 'ig');
const CONFIGURATION_PLACEMENT_TOKEN = new RegExp('{{CALENDAR_CONFIGURATION}}', 'ig');
const CALENDAR_JS_PLACEMENT_TOKEN = new RegExp('{{CALENDAR_JS}}', 'ig');
const DAY_NAME_TRANSFORMATION_F_PLACEMENT_TOKEN = new RegExp('{{DAY_NAME_TRANSFORMATION_F}}', 'ig');
const MONTH_DAY_NUMBER_MOMENT_TRANSFORMATION_F_PLACEMENT_TOKEN = new RegExp('{{MONTH_DAY_NUMBER_MOMENT_TRANSFORMATION_F}}', 'ig');
const TAB_SPACING = '    ';

const generateStylesheet = (themeSystem, themeName) => {
    let url = '';
    if (themeSystem === 'jquery-ui') {
        url = 'https://code.jquery.com/ui/1.12.1/themes/' + themeName + '/jquery-ui.css';
    }
    else if (themeSystem === 'bootstrap3') {
        url = 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css';
        if (themeName) url = 'https://bootswatch.com/3/' + themeName + '/bootstrap.min.css';
    }
    else if (themeSystem === 'bootstrap4') {
        url = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css';
        if (themeName) url = 'https://bootswatch.com/4/' + themeName + '/bootstrap.min.css';
    }
    return url.length > 0 ? `<link rel="stylesheet" type="text/css" href="${url}">` : '';
}

const toJavascriptString = (object, spacing = '') => {
    if(typeof object === 'string') return `"${object}"`;
    if(typeof object === 'function' || typeof object === 'number') return object.toString();
    if(Array.isArray(object)) {
        const lines = [];
        lines.push('[');
        object.forEach((item, index) => {
            if(index > 0) {
                lines[lines.length-1] += ','; 
            }
            lines.push(`${spacing + TAB_SPACING}${toJavascriptString(item, spacing + TAB_SPACING + TAB_SPACING)}`);
        })
        lines.push(']');
        return lines.join('\n');
    }
    if(typeof object === 'object') {
        const lines = [];
        lines.push('{');
        Object.keys(object).forEach((key, index) => {
            if(index > 0) {
                lines[lines.length-1] += ','; 
            }
            lines.push(`${spacing + TAB_SPACING}${key}: ${toJavascriptString(object[key], spacing + TAB_SPACING + TAB_SPACING)}`)
        })
        lines.push('}');
        return lines.join('\n');
    }
}
/**
 * Loads the calendarConfigurations from MM config file.
 * @returns [{ identifier: <MM-Module-Identifier>, config: { fullcalendar: {} }}] configurations for generation.
 */
const getCalendarConfigurations = () => {
    const calendarConfigurations = []
    const { modules } = require('../../config/config.js');
    modules.forEach((module, index) => {
        if (module.module === MODULE_NAME) {
            const config = Object.assign({}, CALENDAR_DEFAULTS, module.config);
            config.fullcalendar = Object.assign({},CALENDAR_DEFAULTS.fullcalendar, module.config.fullcalendar);
            calendarConfigurations.push(config);
        }
    });
    return calendarConfigurations;
};
/**
 * Generate string of Javascript code to be placed in HTML file 
 * to define (and render) configured calendar(s)
 * @param {Object} config single MM FullCalendar configuration
 * @returns {string} javascript snippet to be written to html file contents.
 */
const generateCalendarJS = (config) => {
    const dayNameHTMLTransformFString = toJavascriptString(config.dayNameHTMLTransformation);
    const monthDayMomentHTMLTransformFString = toJavascriptString(config.monthDayNumberHTMLTransformation);
    const calendarConfigurationString = toJavascriptString(config.fullcalendar);

    let multiMonthView = fs.readFileSync(MULTIMONTH_CUSTOMVIEW_JS_FILEPATH, 'utf8');
    multiMonthView = multiMonthView.replace(DAY_NAME_TRANSFORMATION_F_PLACEMENT_TOKEN, dayNameHTMLTransformFString);
    multiMonthView = multiMonthView.replace(MONTH_DAY_NUMBER_MOMENT_TRANSFORMATION_F_PLACEMENT_TOKEN, monthDayMomentHTMLTransformFString);

    let calendarJS = fs.readFileSync(CALENDAR_JS_TEMPLATE_FILEPATH, 'utf8');
    calendarJS = calendarJS.replace(CONFIGURATION_PLACEMENT_TOKEN, calendarConfigurationString)

    return `${multiMonthView}\n${calendarJS}`;
};
/**
 * Genearte string of HTML code to be written to HTML file for configured calendar(s)
 * @param {Object} config single calendar configuration
 * @returns {string} HTML file contents to be written to html file
 */
const generateCalendarHTML = (config) => {
    const cssLink = generateStylesheet(config.fullcalendar.themeSystem, config.themeName);
    const calendarJS = generateCalendarJS(config);

    let calendarHTML = fs.readFileSync(CALENDAR_HTML_TEMPLATE_FILEPATH, 'utf8');
    calendarHTML = calendarHTML.replace(THEME_STYLESHEET_PLACEMENT_TOKEN, cssLink);
    calendarHTML = calendarHTML.replace(CALENDAR_JS_PLACEMENT_TOKEN, calendarJS);
    calendarHTML = calendarHTML.replace(BACKGROUND_COLOR_PLACEMENT_TOKEN, config.backgroundColor);

    return calendarHTML;
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
