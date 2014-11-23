---
layout: post
title: "Named Exception Constructors"
date: "Sa Sep 22 16:30 +0200 2014"
---
Some time ago I read [a post][named constructors] by [Mathias Verraes](http://verraes.net) about using
static methods as named constructors in object oriented PHP. I thought that this technique is very
practical, and that it has the potential for making code much more readable.
However, it can be also used to make generating Exception messages less
repititive.

{% include posts/socket-book.html %}

[named constructors]: http://verraes.net/2014/06/named-constructors-in-php/

This technique can be used to improve code a lot, like Beau Simensen
also shows in his example [in this gist](https://gist.github.com/simensen/67139c0521c5495a799c).

Recently I've seen another great usage of this pattern. Look at exception
messages: the messages are usually defined all over the place in the project. The code
for generating the exception messages is also very repetitive and not very
readable.

Consider this pattern:

```php
<?php

namespace foo;

function do_something_with_file($file)
{
    if (!file_exists($file) or !is_readable($file)) {
        throw new \Exception(sprintf('The file "%s" does either not exist or is not readable', $file));
    }

    // Do something with file
}

function do_something_else_with_file($file)
{
    if (!file_exists($file) or !is_readable($file)) {
        throw new \Exception(sprintf('The file "%s" does either not exist or is not readable', $file));
    }

    // Do something else with file
}
```

The messages are identical and even need the same parameter. We can improve this
with a custom exception class[^customexceptionclass] and named constructors to
make it less repetitive and more concise.

I took this trick from Jeremy Lindblom's [Config Microlibrary][config], and I was told
that libraries of the Doctrine project do this for at least a couple of years by now.

Here's how an improved version could look:

```php
<?php

namespace foo;

class Exception
{
    static function fileIsNotReadable($file)
    {
        return new self(sprintf(
            'The file "%s" does either not exist or is not readable', $file
        ));
    }
}

function do_something_with_file($file)
{
    if (!file_exists($file) or !is_readable($file)) {
        throw Exception::fileIsNotReadable($file);
    }

    // Do something with file
}

function do_something_else_with_file($file)
{
    if (!file_exists($file) or !is_readable($file)) {
        throw Exception::fileIsNotReadable($file);
    }

    // Do something else with file
}
```

This is better in a number of ways:

* All exception messages can be changed in one place
* Code for throwing the exceptions got more concise and shorter
* We have implemented a custom exception class which enables the users of our library to catch
  only the exceptions thrown by the library

[config]: https://github.com/jeremeamia/microlib-config/blob/master/config.php#L238
[^customexceptionclass]: There are many reasons how this is a good idea in your
    library. But
    as always you can argue to what degree. I usually don't extend
    `InvalidArgumentException` or `UnexpectedValueException`.
[^assertions]: To make it even more concise for our simple use case, check out
    Benjamin Eberlei's [assert library](https://github.com/beberlei/assert).
