---
#published: false
title: Grails Plugin Etiquette
layout: post
tags:
    - Programming
custom_excerpt: >
    At work we use a _lot_ of Grails plugins. Recently one of our most
    important Plugins broke functionality in our app in a _minor_
    release, does not tag the releases in the repository and doesn't
    provide a upgrading document. This brought me to think
    a bit about how plugins should behave.
---

## Breaking things in my app ain't cool

Breaking things in my app in a _minor_ version does fill me with rage.
It makes me switch to another plugin (when there's any).

So if you want people to keep using your plugin, be very careful with
breaking stuff in existing apps.

## When you absolutely, positively have to break something

When you do have to break with existing behaviour then the
most important thing is to __Communicate__!

The worst thing for me as user is to realize that certain things
do not work anymore, after a unsuspicious minor update.

Here are some suggestions:

 * Write a note into your changelog.
 * Put instructions for upgrading into your documentation.
 * Indicate it with a new _major_ version number (e.g. "2.0"). This is
   about managing expectations. I expect breaking changes in a major
   release. In minor releases though, I expect that _not a single thing_ breaks.
 * Blog about the break, and provide information on how to
   upgrade from previous versions.

## Provide a changelog

A changelog simply makes updates a bit more predictable &mdash; and
therefore you make it easier to upgrade to the latest version if you
clearly state what's new and what has changed from previous versions.

_You want your users to be on the latest version, or do you?_

I think it's in your interest that all of your users are on the most
recent version. It safes you quite a bit of work.

This is how an example changelog could look:

    # Changelog

    ## v1.2.0

     * Added internationalization for error messages. Error messages are
       now in a i18n resource bundle in `foo/i18n/foo.properties`. For
       details see the `UPGRADING.txt`.
     * Added some more changes. (christoph)

    ## v1.1.0

     * Added some feature. (christoph)

## Too lazy? At least tag your releases

When you are too _lazy_ to provide a change log, then at least tag your
releases &mdash; so I can use the version control system to see what has
changed between releases.

Tags can be combined with [Github's Compare View](https://github.com/blog/612-introducing-github-compare-view)
to provide a change log of releases.

You can use

    http://github.com/<user>/<repository>/compare/<start>...<end>

to get a nice comparison between two points in a projects history,
complete with all commits listed and a diff.

These points can also be _Tag Names_, [here is
an example](https://github.com/CHH/php-build/compare/v0.3.0...v0.4.0)
from one of my projects.
