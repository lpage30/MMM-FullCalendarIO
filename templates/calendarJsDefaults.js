module.exports = {
    header: {
        left: '',
        center: 'prev title next',
        right: ''
    },
    eventClick: function(calEvent, jsEvent, view) {
        alert(`${calEvent.title}: ${calEvent.description}`);
    /*      $('<div></div>>').dialog({
        title: calEvent.title,
        modal: true,
        open: () => {
            $(this).html(calEvent.description);
        }
        });
    */      return false;
    },
};
