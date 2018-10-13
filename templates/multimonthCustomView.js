// you can now use 'multimonth' as a view type
var FC = $.fullCalendar; // a reference to FullCalendar's root namespace
var MonthView = FC.MonthView;      // the class that all views must inherit from
var MultiMonthView = MonthView.extend({

    // make a subclass of MonthView.
    // This will result in the the view honoring the weeks number and the contentHeight and contentHeight
    initialize: function () {
        if (this.options.contentHeight !== 'auto') {
            console.error('MultiMonthView requires contentHeight to be "auto"');
        }
    },
    renderEvents: function (events) {
        var today = new Date();
        const dayNameTransformation = {{DAY_NAME_TRANSFORMATION_F}};
        const monthDayNumberMomentTransformation = {{MONTH_DAY_NUMBER_MOMENT_TRANSFORMATION_F}};
        var dayNameSpans = document.getElementsByClassName('fc-day-header');
        var dayNumberSpans = document.getElementsByClassName('fc-day-number');
        var i;
        for (i = 0; i < dayNameSpans.length; i += 1) {
            const dayNameSpan = dayNameSpans[i].childNodes[0];
            dayNameSpan.innerHTML = dayNameTransformation(dayNameSpan.innerText);
        }
        for (i = 0; i < dayNumberSpans.length; i += 1) {
            const dayNumberSpan = dayNumberSpans[i];
            const tdElement = dayNumberSpan.parentElement;
            tdElement.style.opacity="1";
            const [,month, day] = dayNumberSpan.parentNode.getAttribute('data-date').split('-').map(s => Number(s));
            dayNumberSpan.innerHTML = monthDayNumberMomentTransformation(month, day, moment);
        }
    }
});
FC.views.multimonth = MultiMonthView; // register our class with the view system
