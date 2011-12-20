---
layout: post
title: Time is money
excerpt: >
    or why **no** corporation will fork your permissively licensed
    open source project _without_ contributing back upstream.
---
This post should address some angsts people expressed when I'm
discussed with them about open source licenses.

Almost all of them expressed a strong dislike for permissive licenses, because
they fear, that once the project gets popular some big corporation will
take the code, develop a fork of it and sell it without contributing
back to their open source project.

"You must be this tall to&hellip;"
---------------------------

_First of all_: most open source projects will never get _that_ popular. Especially
it's very rare that a project gets popular enough, that they'll be used in a successful 
commercial product.

_So don't worry._ Just pick any license which let's people use your
software in the ways they want _and move on with your life_.

I tend to use the [MIT License][mit] _a lot_ these days for things I
release as open source. I think it's _short_ and answers (without using
too much legalese) all questions someone who wants to use your project will ask:

 * Who made that?
 * May I use it for my project?
 * What kind of warranty is granted?

[mit]: http://opensource.org/licenses/MIT

Forking is really expensive
---------------------------

The second thing is, that maintaining an internal fork of an open source
project is _really really really expensive_.

These are the choices you've for maintaining downstream patches:

 1. Invest the time, backport upstream bug fixes and security fixes.
 2. Invest _more_ time and forward-port your set of patches to any change
    the upstream project makes.
 3. **Invest no time at all and let it rot**, be stuck on an old, unsecure and buggy version
    of the software. You will almost surily land in dependency hell too,
    because you _cannot_ upgrade software that depends on it.

All of these options cost time (and time _is money_) and therefore _do not_ create 
business value.

That's the reason why every corporation _avoids_ having to
maintain downstream patches to open source software.

_Don't fear making free software._
