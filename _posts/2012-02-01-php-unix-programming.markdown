---
title: PHP Unix Programming
layout: post
tags:
    - How To
custom_excerpt: >
    Ever worried that your scripts ain't good Unix citizens?
    Here are some quick, practial recipes usable for everyday
    PHP Command Line scripting.
---

## Use appropiate exit codes

It's important to respect the Exit Code Conventions of Unix, so other
programs can see if the command ran successfully and then can take
action.

PHP provides the [`exit`](http://at2.php.net/exit) function
to stop script execution and return the code passed as first argument as 
Exit Code back to the system.

Here's a quick overview of appropiate Exit Codes:

 * The Exit Code is an Integer Value between __0__ and __255__.
 * Use __0__ to indicate that the command ran _successfully_. In PHP this
   can be done by calling `exit();` or `exit(0);`. 
 * Exit Codes greather than __1__ are used to signal that your command
   failed in some way.
 * Codes between __128__ and __255__ are reserved for special purposes. Do
   _not_ use them.

The [Appendix D.](http://www.tldp.org/LDP/abs/html/exitcodes.html)
of the Advanced Shell Scripting Guide is a good place to look for
infos about Exit Codes.

## Cleanup Your Mess

It's always good to cleanup the mess that you've created. In a Shell
Script you would trap the `EXIT` signal:

    #!/bin/sh

    my_exit_handler() {
        echo "Cleaning up..." >&2
    }

    trap my_exit_handler EXIT

You can do the same in PHP by using `register_shutdown_function` an
passing a valid callback:

    #!/usr/bin/env php
    <?php

    register_shutdown_function(function() {
        fwrite(STDERR, "Cleaning up...\n");
    });

## Writing Error Output

The Error Pipe is available via the `STDERR` constant. Simply use
`fwrite` to write to it:

    #!/usr/bin/env php
    <?php

    fwrite(STDERR, "Some error happened,\n");
    exit(1);

To make it easy to spot error output of _your_ command in a log file,
the convention is to prepend your command's name in front of the error
output followed by a colon:

    #!/usr/bin/env php
    <?php

    fwrite(STDERR, "foo: Some error happened.\n");
    exit(1);

Later on you can use `grep foo:` to show only log entries related to
your command.

## Read Input piped-in from other commands

When data is piped into a script then PHP makes the input stream accessible via the `STDIN` constant. 
You can use `stream_get_contents` to get all input data:

    #!/usr/bin/env php
    <?php

    $input = stream_get_contents(STDIN);

It's important to note that `stream_get_contents(STDIN)` _blocks_ script
execution until data becomes available on `STDIN`.

To check if data is available we can use `stream_select`.
`stream_select` receives three lists of stream resources: "read",
"write" and "except". To see if data is available to _read_ we put the
stream into the "read" list:

    #!/usr/bin/env php
    <?php

    $read = array(STDIN);
    $write = null;
    $except = null;

Then we pass these variables to the `stream_select` function:

    # ...

    $readyCount = stream_select($read, $write, $except, 0);

    if ($readyCount > 0 and $read) {
        # Something is available to read on STDIN.
        $input = stream_get_contents(STDIN);
    }

`stream_select` modifies the `$read` list to contain _only_ the
resources which have data available for reading. When nothing 
can be read, then the `$read` variable will contain _no_ resources.

Usually it's better to switch to receiving input from the input stream
if a special parameter is passed, for example `-`:

    #!/usr/bin/env php
    <?php

    $file = @$_SERVER["argv"][0];

    if (!$file) {
        fwrite(STDERR, usage());
        exit(1);
    }

    # Read from STDIN when "-" is passed as file name:
    if ($file === "-") {
        $input = stream_get_contents(STDIN);
    } else {
        $input = file_get_contents($file);
    }

    # Do something with the $input

## Fin

That's it for now. If you know some more tips just let me know by mentioning
[@yuri41](http://twitter.com/yuri41) on Twitter.

