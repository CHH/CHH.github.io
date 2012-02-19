---
layout: post
title: PHP Project Automation with Bob
excerpt: >
    After not being satisfied with Ant, Phing and Pake &mdash; I've
    scratched my own itch and made Bob &mdash; a **simple** project
    automation tool.
---
[Bob][] was written as a tool for me to
automate those tiny, repetitive tasks that pop up every once
in a while &mdash; like commands which have to be run on the shell every time
with the same arguments, or some maintenance for the database. 

These task do almost never need a fancy CLI frontend. 
They just need a place where they can be put and simple 
means to link them together.

[bob]: http://github.com/CHH/Bob

Here is an uncomplete list of possible use cases right from
the top of my head:

 * Generating an archive of all files and upload it somewhere for
   deployment.
 * Running all tests (maybe with sub-tasks to run only unit or
   integration tests).
 * Code Generation (often created application artifacts like controllers, domain
   classes).
 * Launching a development server.
 * Doing Database migrations.
 * Automating certain maintenance stuff.
 * Doing tasks necessary when a new release is due, for example
   bump the application's version number, create some tags
   in the VCS and make a tarball.

I wrote Bob because I had enough of the verboseness of Phing's and Ant's 
XML based DSLs and wasn't quite satisfied with Pake's PHP based
DSL either.

I had these Design Goals in mind for Bob:

 * The Build configs must be plain PHP files, so _existing_
   application code, libraries and functions can be easily used. This
   should also _lower_ the barrier of contribution for the project's
   team members in a PHP project. When the barrier of contribution
   is too high build files start to _rot_. __I'm seeing this
   happen with our Ant Build Configs at work.__
 * Shell scripts are easy and simple, but not an option because of their
   portability (mainly Windows).
 * I wanted to make use of Closures for defining task actions, to get
   defining tasks as concise as possible with PHP. I really disliked
   the way Pake does not use Closures (since it has to support PHP
   5\.2\.x) and instead forces me to define a
   _separate_, _named function_ for the task action which leads &mdash; in my
   opinion &mdash; to unnecessary verboseness.
 * I _really_ like [Rake][], therefore it influenced the design of Bob
   and its DSL quite a bit.
 * __Keep it simple.__ The tool should not have more than several
   hundred lines of code.
 * I wanted to experiment with an own coding style, I would like to call
   it "Lean PHP". I plan to do an extra article on that.

[rake]: http://rake.rubyforge.org

## Install

The recommended way of installing [Bob][] is through
[Composer][].

Create a `composer.json` in your project's root and put this
into it:

    {
        "require": {
            "chh/bob": "master-dev"
        }
    }

Then run on the shell:

    $ wget http://getcomposer.org/composer.phar
    php composer.phar install

Bob is then ready to use in `vendor/bin/bob.phar`.

[composer]: http://packagist.org/about-composer

## Quickstart

To start using Bob, create a `bob_config.php` in your project's root
directory. This file will contain all tasks.

This is how a simple `bob_config.php` can look like:

    <?php

    namespace Bob;

    task('hello', function() {
        println('Hello World');
    });

    task('foo', function() {
        println('Foo');
    });

To run this task launch Bob with `hello` as argument. Bob treats all
arguments passed after the flags as task names. These tasks are run in
the specified order:

    $ php vendor/bin/bob.phar hello
    Hello World
    $ php vendor/bin/bob.phar hello foo
    Hello World
    Foo

When no task is given on the command line, then Bob attempts to run the
`default` task.

Tasks can be described by using the `desc()` function before defining 
a task. Now let's add a simple description to our `hello` task:

    desc('Echoes Hello World');
    task('hello', function() {
        ...
    });

Descriptions are shown alongside their tasks when Bob is run with the
`--tasks` flag:

    $ php vendor/bin/bob.phar --tasks
    (in yourproject/)
    bob hello # Echoes Hello World

To make dependencies between tasks, just pass an array of task names as
second argument to the call to `task`.

Let's change the definition of our first task to reference the `foo`
task as a dependency:

    task('hello', array('foo'), function() {
        println('Hello World')
    });

And now run Bob again:

    $ php vendor/bin/bob.phar hello
    Foo
    Hello World

We can use this now set the `hello` task as default task, by adding
it as dependency:

    task('default', array('hello'));

When we run Bob without task names then the `hello` task is now run:

    $ php vendor/bin/bob.phar
    Foo
    Hello World

This was only a quick overview of what Bob is able to do. To see more
examples, read on in the next section.

## Practical Recipes

These are some common scenarios for using Bob. More examples
can be found in Bob's own [bob_config.php](https://github.com/CHH/Bob/blob/master/bob_config.php).

### Update composer packages when the composer.json has changed

This is good example for a file task. Here we run `composer.phar update`
when the `composer.json` is newer than the `composer.lock` created by
composer. This keeps our dependencies up to date and could be run before
running the unit tests.

    fileTask('composer.lock', array('composer.json'), function() {
        sh('composer.phar update');
    });

### Running unit tests

This runs all tests with PHPUnit and copies the provided
`phpunit.dist.xml` to a `phpunit.xml` before running the tests.

    task('test', array('phpunit.xml'), function() {
        sh('phpunit');
    });

    # Copies the phpunit.dist.xml to phpunit.xml, when phpunit.xml does
    # not exist.
    fileTask('phpunit.xml', array('phpunit.dist.xml'), function() {
        copy('phpunit.dist.xml', 'phpunit.xml');
    });

### Running a local PHP development server

This requires PHP 5.4.0 at least for the builtin CLI Web Server.

    task('server', function() {
        # The Symfony Process Component is included with Bob.
        $phpFinder = new \Symfony\Component\Process\PhpExecutableFinder;
        $php = $phpFinder->find();

        $process = new \Symfony\Component\Process\Process(join(' ', array(
            $php, '-S', 'localhost:8080', '-t', 'public/', 'public/index.php'
        )));

        # Set this to something really high, the dev server will be a
        # rather long running process usually.
        $process->setTimeout(10000000);

        # Write Error output to STDERR and normal output to
        # STDOUT, so we see the server's logging messages:
        $process->run(function($type, $output) {
            $type == 'err' ? fwrite(STDERR, $output) : echo $output;
        });
    });

