---
title: How to log to the PHP error log in Symfony 2
layout: post
short: true
---
Sometimes you want to log to PHP's `error_log` in a Symfony 2 app. This
is useful if your app runs in a container (think Docker)
and PHP's error log is redirected to standard output and you want your
application logs to show up there too.

You need to use at least version 2.4 of the MonologBundle to use the
ErrorLogHandler:

    {
        "require": {
            …
            "symfony/monolog-bundle": "~2.4"
        }
    }

Then in your `config_prod.yml` and `config_dev.yml` change the type of the Monolog
handlers to `error_log` and you are all set. For example, the Monolog
config in `config_dev.yml` would look like this:

```yaml
monolog:
    handlers:
        main:
            type:  error_log
            level: debug
```

