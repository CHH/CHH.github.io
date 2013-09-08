---
title: PHP and Heroku, Part 1
layout: post
---
This is part 1 of a series of posts about bringing good support for modern PHP to
Heroku. In this part of the series, we will deploy a simple "Hello
World" example to Heroku.

Heroku is a Platform as a Service (_PAAS_) provider, and has support for
many languages like Ruby, Python and Node. But many people don't know
that Heroku also has basic support for PHP.

Though it's very basic:

* Uses Apache with the "Prefork" MPM and `mod_php`, which is not
  the most memory efficient setup. This is an issue because dynos only
  have 512MB of RAM. For optimal memory efficiency, you typically use
  _NGINX_ and _PHP-FPM_.
* No support for [Composer][], this is essential for modern PHP
  applications.
* __PHP 5.3,__ I wanted something which supports at least PHP 5.4

[Composer]: http://getcomposer.org

But thanks to _Buildpacks_ we as community can improve this.
Buildpacks are a framework for adding additional languages to the Heroku platform.
So I took on writing an advanced [Heroku buildpack][] for running modern PHP
applications on the Heroku platform.

[Heroku buildpack]: https://github.com/CHH/heroku-buildpack-php

# Prerequisites

* Basic PHP knowledge, including an installed version of at least PHP 5.3.0 and Composer
* Basic Git knowledge
* Your application must run on PHP 5.5.0
* A Heroku user account. [Signup is free][heroku signup]
* The Heroku Toolbelt. [Read the Getting Started Guide][Getting started guide]

[Getting started guide]: https://devcenter.heroku.com/articles/quickstart
[heroku signup]: https://api.heroku.com/signup/devcenter

# Hello World

First, deploying to Heroku requires a Git repository.

    $ mkdir heroku-hello-world
    $ cd heroku-hello-world
    $ git init

Now let's make a classic PHP app and create a file `index.php` in the
project's directory.

    $ echo '<?php echo "<h1>Hello World</h1>"; ?>' > index.php

Then we create our first commit.

    $ git add .
    $ git commit -m "Initial commit"

I'm assuming you have the `heroku` tool installed on your system and
setup with your Heroku account. Next, create a Heroku app.

    $ heroku create --buildpack git://github.com/CHH/heroku-buildpack-php
    Creating cryptic-anchorage-9288... done, region is us
    BUILDPACK_URL=git://github.com/CHH/heroku-buildpack-php
    http://cryptic-anchorage-9288.herokuapp.com/ | git@heroku.com:cryptic-anchorage-9288.git
    Git remote heroku added

Deploying to Heroku is now only a `git push` away.

    $ git push heroku master
    Counting objects: 3, done.
    Writing objects: 100% (3/3), 256 bytes, done.
    Total 3 (delta 0), reused 0 (delta 0)

    -----> Fetching custom git buildpack... done
    -----> PHP (classic) app detected
    -----> Bundling NGINX 1.4.2
    -----> Bundling PHP 5.5.3
    -----> Vendoring binaries into slug
    -----> Setting up default configuration
    -----> Running compile commands
    -----> Discovering process types
           Procfile declares types         -> (none)
           Default types for PHP (classic) -> web

    -----> Compiled slug size: 33.9MB
    -----> Launching... done, v5
           http://cryptic-anchorage-9288.herokuapp.com deployed to Heroku

    To git@heroku.com:cryptic-anchorage-9288.git
     * [new branch]      master -> master

Now let's open the browser and view our app. It should say "Hello World"
in big bold letters.

    $ heroku open

# Fin

In the next part of our series we will look at getting a simple Silex
application running on Heroku.
