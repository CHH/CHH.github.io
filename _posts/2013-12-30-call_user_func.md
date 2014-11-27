---
layout: post
title: "On call_user_func()"
short: true
tag: Programming
---
Little known change of PHP 5.4: you don't have to
use the `call_user_func()` function anymore to call generic callables!

Before 5.4 you could only use `()` to call variables
when the type was a String or Closure, otherwise you would have to use
`call_user_func()`. Since 5.4 however, you can simply do `()` on anything which satisfies the `callable` typehint, as illustrated below:

```php
<?php

class Foo
{
	function bar()
    {
        echo "Hello World\n";
    }
}

$cb = array(new Foo, "bar");
$cb();

$cb = "strlen";
var_dump($cb("foo"));
```

([Try it](http://3v4l.org/62BeK))

Currently this doesn't make much difference, but it's a nice step to
improve readability a bit.

Together with [Argument Unpacking][] (currently slated for 5.6) this could make
`call_user_func_array()` obsolete too.

Yay! We won't have to use functions to call functions anymore!

[Argument Unpacking]: https://wiki.php.net/rfc/argument_unpacking
