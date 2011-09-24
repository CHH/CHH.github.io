
$(function() {
    $('#greeting').html(welcomeMessage());
});

(function() {
    var WEEKDAYS = [
        'Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 
        'Donnerstag', 'Freitag', 'Samstag'
    ];

    var MERIDIANS = {
        am: 'Vormittag',
        pm: 'Nachmittag'
    };

    function welcomeMessage() {
        var now = new Date();
        var weekDay = WEEKDAYS[now.getDay()];
        
        var meridian = now.getHours() < 12 ? 'am' : 'pm';

        return "Einen wundersch&ouml;nen " + weekDay + " " + MERIDIANS[meridian] + '.';
    }

    this.welcomeMessage = welcomeMessage;
}).apply(this);
