# MMM-FullCalendarIO
A [MagicMirror](https://magicmirror.builders/) module that renders calendars using the [fullcalendar.io](https://fullcalendar.io/) javascript libraries. The basic approach here is you specify your fullcalendar configuration, and then run `npm run build` on your module to generate HTML files that render your calendar. These files are rendered in a webview which has similar restrictions to [MMM-Webview](https://github.com/lpage30/MMM-Webview)

## Setting up to use this Module
There are a 2 things you will need to do in your overall configuration so you can then render these webview(s).
1. ***Electron Options***
Referring to the [MagicMirror Configuration](https://github.com/MichMich/MagicMirror#configuration), you will need to add the `nodeIntegration: true` to `electronOptions`.  I am uncertain why this is needed (I have plenty of educated guesses), but if this value is false, things don't render.
````javascript
	electronOptions: {
	/*  Note: MagicMirror uses Object.assign() to 'override' its defaults. In order to ensure
	    you get the defaults for webPreferences along with your 'override' you must fully define 
	    webPreferences to have all the MagicMirror defaults along with your override (nodeIntegration).
	    Thankfully, MagicMirror's default for webPreferences is zoomFactor: 1
	    and we are overriding the other default nodeIntegration
	*/
		webPreferences: {
			zoomFactor: 1, // default is actually zoomFactor: config.zoom, and zoom's default is 1.
			nodeIntegration: true, // the default for this is false. we are overriding this.
	},
````
2. ***Custom CSS***
This is a kinda optional. Things do render without it, but the sizing is all crap. Basically what I am saying here is use CSS to style your webview; do not use the webview inline style. There are PLENTY of references/complaints online about how the webview isn't rendering fully as specified in the inline style. I wanted my entire screen to render as the webview. I finally came across a [reference](https://github.com/electron/electron/issues/8277) that presented a solution that actually worked (I hate css). This CSS did the trick; put this in your MagicMirror custom css `css/custom.css`.
````css
.MMMFullCalendarIO {
  position: absolute;
  top: 30;
  left: 20;
  width: 90%;
  height: 100%;
  margin: 0 0 0 2em;
  display: inline-flex;
}
````
I did some adjustments based on the page I was loading as in my application the rendered webview was 'too wide' and then shifted too much to the left.

## Using the module
This module requires an additional step to convert your configuration for use by the module.

1. Add or Change 1 or more `MMM-FullCalendarIO` module configurations in `~/MagicMirror/config/config.js` file:
    ````javascript
    {
        module: "MMM-FullCalendarIO",
        position: "fullscreen_above",	
        config: {
            identifier: 'OurCalendar',
            cssClassname: 'MMMFullCalendarIO',
            fullcalendar: {
                // see https://fullcalendar.io/docs/initialization
                // document read function javascript
                //  see '// put your options and callbacks here'
            }
        }
    }
    ````
2. Build (generate) the html file(s) for your added module(s)  
    ```bashscript
    cd ~/MagicMirror/modules/MMM-FullCalendarIO
    npm run build
    ```
    This does the following:
    -  clears out the existing generated HTML files
    - loads `~/MagicMirror/config/config.js` reading all `MMM-FullCalendarIO` module definitions.
    - Generates 1 HTML file for each `MMM-FullCalendarIO` module definition.
3. Restart your MagicMirror

## Configuration options
The following properties can be configured:
<table width="100%">
	<tr>
		<th>Option</th>
		<th width="100%">Description</th>
	</tr>
	<tr>
		<td><code>updateInterval</code></td>
		<td>the update interval for the HTML page.<br>
			<br><b>Example for 30 seconds:</b><code>30 * 1000</code>
			<br><b>Default value:</b> <code>"0"</code> (never update; except based on module lifecycle)
		</td>
	</tr>	
	<tr>
		<td><code>identifier</code></td>
		<td>unique id/name used in generating the html file.<br>
            This field is necessary to differentiate configurations<br>
            when more than 1 use if this module is present in the config.js<br>
			<br><b>Default value:</b> <code>'calendar'</code>
		</td>
	</tr>		
	<tr>
		<td><code>cssClassname</code></td>
		<td>The name of the css definition for this Calendar.<br>
			If you created a CSS class definition in ***Custom CSS*** setup step above<br>
			you should provide that name for this option<br>
			<br><b>Default value:</b> <code>'webview'</code> (no actual assignment as the element name matches the css class name)
			<br><b>Example using css class definition `.MMMFullCalendarIO`:</b><code>'.MMMFullCalendarIO'</code>
			<UL>
<LI>custom.css

````javascript
.MMMFullCalendarIO {
  position: absolute;
  top: 30;
  left: 20;
  width: 90%;
  height: 100%;
  margin: 0 0 0 2em;
  display: inline-flex;
}
````
</LI><LI>config.js:

````javascript
{
    module: "MMM-FullCalendarIO",
    position: "fullscreen_above",	
    config: {
        identifier: 'OurCalendar',
        cssClassname: 'MMMFullCalendarIO',
        fullcalendar: {
            // see https://fullcalendar.io/docs/initialization
            // document read function javascript
            //  see '// put your options and callbacks here'
        }
    }
}

````	
</LI></UL>
		</td>
	</tr>
    <tr>
            <td><code>backgroundColor</code></td>
            <td>The background color of the rendered calendar area.
            <br><b>Default value:</B><code>#A9A9A9</code> (grey)
            </td>
    </tr>
    <tr>
            <td><code>dayNameHTMLTransformation</code></td>
            <td>Function called with day name (sun - sat) to transform and render that dayname with HTML formatting (if desired).
            <br><b>Default value:</B><code>(dayName) => dayName</code> (no transformation)
            </td>
    </tr>
    <tr>
            <td><code>monthDayNumberHTMLTransformation</code></td>
            <td>Function called with Month Number (1 - 12), Day Number (1 - 31), and [Moment](https://momentjs.com/) module (to help in rendering things associated with the month and day) to transform and render that day with HTML formatting (if desired).
            <br><b>Default value:</B><code>(month, day, momentModule) => `${momentModule.monthsShort(month-1)} ${day}`</code> shortMonth name and day number
            </td>
    </tr>
    <tr>
            <td><code>themeName</code></td>
            <td>The name of the specific theme within the <code>fullcalendar.themeSystem</code> specified theme for css.
            <br><b>Default value:</B><code>flatly</code> (bootstrap4 themesystem theme)
            </td>
    </tr>
    <tr>
            <td><code>fullcalendar</code></td>
            <td>The [fullcalendar IO option object](https://fullcalendar.io/docs/initialization) passed to the<br>
                fullcalendar function in the HTML.<br>
                This is passed without interpretation to the fullcalendar.io function call in the javascript of the generated HTML file.
                <br><b>Default value:</b>  

    ```javascript
    {
        themeSystem: 'bootstrap4',
        views: {
            listDay: { buttonText: 'day' },
            listWeek: { buttonText: 'week'},
            threeMonths: { type: 'multimonth', duration: { weeks: 12 }, buttonText: '3-mos' },
        },
        defaultView: 'threeMonths',
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
    }
    ```
Defaults result in following:
- Bootstrap4 'flatly' theme style
- 4 types of views used:
    - list events in current day
    - list events in current week
    - month view
    - 3 month view  (Uses new custom multimonth view)
- default view is 3 month view
- scale height to limit of the calendar's parent container. Since this is rendered as an IFrame that covers a full screen, the limit is the full screen.
- automatically scale the height of the calendar contents
- show title of calendar in top center of calendar
- On the bottom left of the calendar show 4 buttons for day, week, month, and 3 month views.
- On the bottom left of the calendar, to the right of the 4 buttons show navigation buttons with today in the center.
- On event click render the event data in a jquery 'popup' 'dialog' object.

All that is needed is the data for your events.
</td>
</tr>
</table>
## Known Issues
- In a google calendar integration when you 'click' on a scheduled item, you are brought to the google rendering of that text. Once you get here you seemingly cannot 'get back'. This is currently be worked on.
