
$(function() {
    $('#greeting').html(welcomeMessage());

    $(document).delegate('.comment-on-twitter', 'click', function() {
        var url = encodeURI(
            document.location.protocol + '//' + document.location.host + 
            $(this).data('url')
        );
        var follow = encodeURI('@yuri41');

        var intent = "https://twitter.com/intent/tweet?url=" + url + '&text=' + follow;

        var w = window.open(
            intent, 'Kommentiere auf Twitter', 'width=550,height=260,scrollbars=no'
        );
        
        w.focus();
    });
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
