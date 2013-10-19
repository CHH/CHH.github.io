---
title: Running Sylius on Heroku
layout: post
---
[Sylius](http://sylius.org) is a modern ecommerce solution for PHP,
built on Symfony 2. In this post I will show you how simple it's to
use [Heroku](http://heroku.com) to setup your very own shop with Sylius.

# What you need

* At least PHP 5.3.3
* [Composer](http://getcomposer.org)
* A [Heroku](http://heroku.com) account
* [The Heroku Toolbelt](https://toolbelt.herokuapp.com)

# Getting setup

<p>
    <div class="info-box">
        TL;DR: Check out the <a href="https://github.com/CHH/Sylius-Heroku">Github repo</a>.
    </div>
</p>

First setup a Sylius project with Composer:

    $ composer create-project sylius/sylius -s dev myshop

Grab some coffee. This takes a while. When asked about the database
driver enter `pdo_pgsql`, and when asked about the mailer host enter
`smtp.mandrillapp.com`. Leave everything else at the default values by
hitting the Enter key.

Now create a free Heroku Account and create an app with the `heroku`
tool:

    $ heroku create --buildpack git://github.com/CHH/heroku-buildpack-php

_(If you are located in Europe add `--region eu` to the latter command
to get a speedier setup)_

To run Sylius we need a database and a mail server, so let's add the
Heroku Postgres and the Mandrill addons to our app:

    $ heroku addons:add mandrill:starter
    $ heroku addons:add heroku-postgresql:dev

We need to do one more step to setup Heroku Postgres. You might have
noticed this output when adding the addon:

```
Adding heroku-postgresql:dev on frozen-island-9860... done, v3 (free)
Attached as HEROKU_POSTGRESQL_GRAY_URL
Database has been created and is available
 ! This database is empty. If upgrading, you can transfer
 ! data from another database with pgbackups:restore.
Use `heroku addons:docs heroku-postgresql` to view documentation.
```

To get our Postgres database finally ready, we have one more step ahead
of us. If you look closer at the output in your own console,
you will notice that the color in `HEROKU_POSTGRESQL_GRAY_URL` is a
different one than here. Copy the whole string `HEROKU_POSTGRESQL_GRAY_URL` and 
run this in your terminal:

    $ heroku pg:promote HEROKU_POSTGRESQL_GRAY_URL
    Promoting HEROKU_POSTGRESQL_GRAY_URL to DATABASE_URL... done

Let's also turn on the labs feature `user-env-compile`, we need it later
on.

    $ heroku labs:enable user-env-compile

When deploying to Heroku, you don't store your sensible configuration
values, like the database credentials _not_ in your repository. You add
them as configuration variables to your Heroku app. These configuration
variables are then available as environment variables in your processes,
i.e. in the `$_SERVER` and `$_ENV` superglobals of PHP or via
`getenv()`.

So we need a PHP config file which reads this environment variables and 
sets the right container parameters. The Heroku Postgres addon sets the
`DATABASE_URL` environment variable, and the Mandrill addon sets the
`MANDRILL_USERNAME` and `MANDRILL_APIKEY` variables, which are the SMTP
credentials.

Make a file named `parameters.php` in the `app/config/` directory,
and put the following into it:

```
<?php

if (isset($_ENV['DATABASE_URL'])) {
    $dbUrl = $_ENV['DATABASE_URL'];
    $parts = parse_url($dbUrl);

    $container->setParameter('sylius.database.driver', 'pdo_pgsql');
    $container->setParameter('sylius.database.host', $parts['host']);
    $container->setParameter('sylius.database.name', trim($parts['path'], '/'));
    $container->setParameter('sylius.database.user', $parts['user']);
    $container->setParameter('sylius.database.password', $parts['pass']);
    $container->setParameter('sylius.database.port', $parts['port']);
}

if (isset($_ENV['SECRET'])) {
    $container->setParameter('sylius.secret', $_ENV['SECRET']);
}

if (isset($_ENV['MANDRILL_USERNAME']) and isset($_ENV['MANDRILL_APIKEY'])) {
    $container->setParameter('sylius.mailer.user', $_ENV['MANDRILL_USERNAME']);
    $container->setParameter('sylius.mailer.password', $_ENV['MANDRILL_APIKEY']);
}
```

Next add this file to your `imports` in your `app/config/config.yml`, so
it looks like this:

```yaml
imports:
    - { resource: parameters.yml }
    - { resource: security.yml }
    - { resource: sylius.yml }
    - { resource: parameters.php }
```

The custom PHP buildpack we're using, reads some config settings from
the composer.json stored in `extra.heroku`.

```json
{
    …
    "extra": {
        …
        "heroku": {
            "compile": [
                "php app/console assetic:dump --env=prod"
            ]
        }
    }
}
```

We are almost done! Now we need to deploy the code to Heroku.
Deploying to Heroku is done with a `git push` of the master branch to the `heroku` remote.

    $ git push heroku master

Don't worry when `assetic:dump` fails, this is expected and we will fix
this in a minute. When the push was successful use the `sylius:install` command to setup
Sylius. You can run any console command in a new dyno with `heroku run`:

    $ heroku run php app/console sylius:install --env=prod

Last, let's fix the assets by forcing a full redeploy:

    $ git commit -m "Rebuild" --allow-empty && git push heroku master

You can now use `heroku open` to open your fresh Sylius site in your
browser, or run `heroku apps:info` and copy the "Web URL" and open it in
your browser.

## Further reading

* [Heroku Devcenter](https://devcenter.heroku.com/)
* [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command)
* [Heroku Postgres](https://devcenter.heroku.com/articles/heroku-postgresql)
* [Custom PHP buildpack with Symfony support](https://github.com/CHH/heroku-buildpack-php)
