---
title: What I like about Tilt
layout: post
tags:
    - Opinion
custom_excerpt: > 
    Tilt is a templating library for Ruby. It's kind of an 
    aggregator for templating engines &mdash; and I like it.
---
[Tilt](https://github.com/rtomayko/tilt) is a templating library for **Ruby**. It's not an 
engine, but kind of an aggregator for templating engines and provides
adapters to _Erubis_, _Markdown_ and even for _LESS_ and _SASS_. It's kind of
a "Meta" Templating Engine. Here is what I like about it.

## Democratizes Writing of View Templates

Tilt supports many templating engines and you can choose the one you
like the most. Want to use Markdown instead of Textile? Just use a
`.markdown` file instead of a `.textile`. Or need some templates on the
client side too? Use a JST or Mustache engine. The user can choose what
*he/she* likes to use, or choose the *best* tool for the job.

## You don't have to reinvent the wheel

Need a view layer? Just plug it in. Frameworks can provide a great
set of options for their users and at the same time they don't have to
reinvent the wheel.

It's great for applications and libraries too, if you need support for
multiple templating engines.

## Who uses it?

 * [Sinatra](http://sinatrarb.com) &mdash; a popular Ruby Microframework
 * [Sprockets](https://github.com/sstephenson/sprockets) &mdash; powers the
   Rails Asset Pipeline
 * [Gollum](https://github.com/github/gollum) &mdash; runs the Github Wikis

## What's in there for PHP

Certainly something like this could be very useful for PHP Libraries/Frameworks, 
and as far as I know Zend_View 2 will go in that direction. I think though, that a
framework-independent implementation would be even more useful (and I'm
working in private on this, _hint hint_).

## Conclusion

It certainly doesn't fit everyone, though. If you plan to provide
_only_ support for one templating engine, then this is _definitly_ going
to be _overhead_. But it's a good choice for everything, that needs support for 
_multiple_ template engines (think Wikis, Blog Engines, Asset Pipelines) and 
for Frameworks, where you want a robust templating library 
and provide your users the choice to use whatever templating engine they
want.
