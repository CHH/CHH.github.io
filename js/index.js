
(function() {
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
            $.getJSON("https://api.github.com/users/CHH/repos", function(data) {
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

    window.ProjectList = ProjectList;
})();

$(function() {
    hljs.initHighlightingOnLoad();

    $("[data-behavior=project-list]").each(function(i, el) {
        new ProjectList(el);
    });

    $("nav[role=navigation] a[href='" + document.location.pathname + "']").first().addClass("active");
});

