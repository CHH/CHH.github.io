
$(function() {
    hljs.initHighlightingOnLoad();

    $("nav[role=navigation] a[href='" + document.location.pathname + "']").first().addClass("active");
});

(function(global) {
    var ProjectList = function(el) {
        this.el = $(el);
        this.init();
    };

    $.extend(ProjectList.prototype, {
        init: function() {
            var template = this.getTemplate();
            var ul = this.el;

            this.getProjects(function(projects) {
                $.each(projects, function(i, project) {
                    var li = template.clone();

                    li.find(".title").text(project.name);
                    li.find(".watchers").text(project.watchers);
                    li.find(".language").text(project.language);
                    li.find(".description").text(project.description);

                    ul.append(li);
                    li.show();
                });
            });
        },

        getProjects: function(fn) {
            $.getJSON("https://api.github.com/users/CHH/repos?callback=?", function(data) {
                var projects = [];

                $.each(data, function(i, repo) {
                    if (!repo.fork) projects.push(repo);
                });

                // Sort by watchers.
                projects = projects.sort(function(a, b) {
                    if (a.watchers < b.watchers) {
                        return 1;
                    } else if (a.watchers === b.watchers) {
                        return 0;
                    } else if (a.watchers > b.watchers) {
                        return -1;
                    }
                });

                projects = projects.slice(0, 5);

                fn(projects);
            });
        },

        getTemplate: function() {
            return this.el.find("> .template");
        }
    });

    $(function() {
        $("[data-behavior*=project-list]").each(function(i, el) {
            new ProjectList(el);
        });
    });

    global.ProjectList = ProjectList;
})(window);

// Custom twitter share button, using web intents.
$(function() {
    $(document).on('click', 'a[data-behaviour*=twitter-comment-button]', function(event) {
        event.preventDefault();

        var url = encodeURI(
            document.location.protocol + '//' + document.location.host + 
            $(this).attr('data-url')
        );

        var text = encodeURI($(this).attr("data-text"));
        var intent = "https://twitter.com/intent/tweet?url=" + url + '&text=' + text;

        var w = window.open(
            intent, 'Auf Twitter teilen', 'width=550,height=260,scrollbars=no'
        );

        w.focus();
    });
});
