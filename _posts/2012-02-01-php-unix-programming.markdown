---
title: PHP Unix Programming
layout: post
excerpt:
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

## Exit early

## Do something when the script exits

## Writing error output

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

## Read Input piped in from other commands

When data is piped into a script then PHP makes the input stream accessible via the `STDIN` constant. 
You can use `stream_get_contents` to get all input data:

    #!/usr/bin/env php
    <?php

    $input = stream_get_contents(STDIN);

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
    if ($file == "-") {
        $input = stream_get_contents(STDIN);
    } else {
        $input = file_get_contents($file);
    }

    # Do something with the $input

**Important:** `stream_get_contents(STDIN)` _blocks_ when there is
nothing available on `STDIN`.

