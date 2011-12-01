---
title: PHP Programming with Assertions
excerpt:
published: false
---
I recently read a piece on [Idiomatic Code][idio1] on Hacker News, so
I started thinking of how some things can be useful in PHP programming.

[idio1]: http://example.com

One of the things you really always do, when you write a function is
a simple validation of the inputs. 

In most cases you validate a variable and then throw 
an Exception, like this:

    <?php
    
    namespace CHH;

    function someFunction($callback)
    {
        if (!is_callable($callback)) {
            throw new \InvalidArgumentException(
                'someFunction needs a valid callback!'
            );
        }

        // do something here
    }

    function someOtherFunction($callback)
    {
        if (!is_callable($callback)) {
            throw new \InvalidArgumentException(
                'someOtherFunction needs a valid callback!'
            );
        }

        // do something here
    }

That's fine if you need this once, but it gets boring to write
the same checks and throw the same exceptions over and over again.

## How can we do better?

A better solution is to put the check into a function, which throws
and exception if the condition is not met: I will call that an **Assertion**.

This is how a simple assertion library could look like:

    <?php

    namespace CHH\Assert
    {
        class AssertionFailedException extends \Exception
        {}

        function isCallable($expr, $msg = '')
        {
            if (!is_callable($expr)) {
                throw new AssertionFailedException($msg);
            }
        }
    }

Here is how the first example could use this:

    <?php

    namespace CHH;

    use CHH\Assert;

    function someFunction($callback)
    {
        Assert\isCallable(
            $callback, __METHOD__.' needs a valid callback as argument'
        );

        // do something here
    }

    function someOtherFunction($callback)
    {
        Assert\isCallable(
            $callback, __METHOD__.' needs a valid callback as argument'
        );

        // do something here
    }

Much better. Now we've stopped repeating ourselves *and* we reduced the
code needed at the beginning of each function from 5 to 3 lines!

## Why don't you just use Hamcrest's or PHPUnit's assertions?

The Assertions by the Hamcrest Project and PHPUnit are
made for *testing* things. My point is that they're designed
to provide the best as possible output for testing. The second
thing is, that they aren't really designed for runtime
performance either.

These assertions are also run at runtime, so they should be
really *lightweight* and designed to provide
practical assertions which check common styles of function/method
arguments, like is something callable or is it not empty.

## Perspective

This can now be developed further, by providing assertions for
`notNull`, `isTrue`, `hasMethod` and so forth.


