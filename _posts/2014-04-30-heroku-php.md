---
title: Official Heroku PHP support updated with Composer, HHVM and NGINX support
short: true
type: link
href: "https://blog.heroku.com/archives/2014/4/29/introducing_the_new_php_on_heroku"
layout: post
---
A long due update to the Heroku PHP buildpack —which adds support for
modern PHP development— is now in public beta. Their [Devcenter
Article][heroku php doc] has more info.

You know what's really awesome about it? You can require
`heroku/heroku-buildpack-php` in your Composer dev requirements and run
your apps locally with a `Procfile` and Foreman, just like every other
supported language on Heroku.

_PSA: Once the official PHP buildpack is stable, I plan to no longer support [my
own PHP buildpack](https://github.com/CHH/heroku-buildpack-php)._

[heroku php doc]: https://devcenter.heroku.com/categories/php?utm_source=pardot&utm_medium=email&utm_campaign=php
