module.exports = {
    height: 'parent',
    contentHeight: 'auto',
    header: {
        left: '',
        center: 'title',
        right: ''
    },
    footer: {
        left: 'listDay,listWeek,month,threeMonths',
        center: '',
        right: 'prevYear,prev,today,next,nextYear',
    },
    defaultView: 'threeMonths',
    views: {
        listDay: { buttonText: 'day' },
        listWeek: { buttonText: 'week'},
        threeMonths: { type: 'multimonth', duration: { weeks: 12 }, buttonText: '3-mos' },
    },
    dayRender: function ( date, cell ) { 
        const color = month_colors[date._d.getMonth()];
        console.log('HELLO');
    },
    eventClick: function(calEvent, jsEvent, view) {
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
};
