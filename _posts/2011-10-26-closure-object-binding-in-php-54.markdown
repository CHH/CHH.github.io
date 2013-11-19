---
title: Closure Object Binding in PHP 5.4
layout: post
tags:
    - How To
custom_excerpt:
    Closure Object Binding is one of the features that I'm looking
    forward to in PHP 5.4. We will take a brief look at the long way
    it took to be implemented and look into practical examples on how to
    improve libraries.
---

For the people who read PHP's `NEWS` file, it's no surprise &mdash; but
for all who don't here's is probably one of the biggest features of PHP
5\.4: Closure Object Support is back. For me it's something I missed
the most, when Closures were introduced in PHP 5.3. So I'm
very happy, that's finally here (or back).

I'm going to tell you about the rocky road which closure
object binding support had and show you some simple use cases for it.

## A Rocky Road

The Object Binding support for Closures had a very hard way, until it
finally landed. I remember that it was present in some alpha releases of
PHP 5.3, but when 5.3 was released it disappeared. 

After some digging, I found out it was excluded from the release because 
the behaviour of the Object Binding was kind of unspecified. Thank god,
this [RFC](https://wiki.php.net/rfc/closures/object-extension) came
along and got the problems for an implementation out of the way.

It was sadly missed. Closures are a great way for letting others supply
their own behaviour for aspects of your library. For example let the
User supply a request handler as Closure, as used by many
Microframeworks. But without Object Binding, you can't give a Closure a
Context. For example, how do you access your Microframework's
application instance, from within the Closure? Yes you could use the
`use` keyword to import it from a variable to a closure:

    <?php

    use Silex\Application;

    $app = new Application;

    $app->get('/', function() use ($app) {
        $request = $app['request'];

        // do something with the request object
    });

Yeah, that kind of works, but if you've more than one request handler you
have to import the `$app` variable *every single time you define a
closure*. This sucks.

Now with Closure object binding, the Silex Framework could bind all
closures, passed as request handlers, to the application instance. This
can be achieved by using the closure's `bindTo` method. Take this
example:

    <?php

    $closure = function() { 
        echo $this->foo;
    };

    $context = new \StdClass;
    $context->foo = "Hello World";

    // rebinds the closure to the $context object
    $boundClosure = $closure->bindTo($context);
    $boundClosure();
    // outputs "Hello World"

The `bindTo` method returns a new closure instance, in which the `$this`
is bound to the passed object.

If Silex would implement this, the request handler could be rewritten as follows:

    <?php

    $app->get('/', function() {
        $request = $this['request'];

        // do something with the request object
    });

This is much better. No more `use`-ing of the `$app` every time we want to
attach a request handler.

## A Simple Use Case

It came to my mind, that this would be perfect for Templating engines.
For example, `Zend_View` has to isolate the assigned template properties
from its own properties by subclassing and marking them as `private`.
With Closure Object Binding this could now be achieved by simply
including the template script in a closure!

I've written a small prototype which is available as [this Gist](https://gist.github.com/1121233).
This implements a quite small templating class, which takes a context
object and binds it to the template as `$this`, via closure binding.

The template is able to access the context's properties and methods then as its own
properties and methods &mdash; but none of the template engine's
properties and methods are exposed to the template.

Consider the following example:

    // heisdead.phtml
    He is dead <?= $this->name ?>.
    
    // test.php
    <?php

    $template = new \CHH\Template(__DIR__.'/heisdead.phtml');
    
    $context = (object) array(
        'name' => 'Jim'
    );

    echo $template->render($context);
    // Outputs "He is dead Jim."


**Though, for now this doesn't buy us anything. What's with Helper
Methods?**

Helper Methods could then be provided by a default context
implementation. The user then would assign additional properties
to this context.

Take this example of a (rather inflexible) context with a helper method:

    <?php

    namespace CHH;

    class DefaultContext
    {
        function formatDate($date, $format = 'Y/m/d H:i')
        {
            $dateTime = new \DateTime($date);
            return $dateTime->format($format);
        }
    }

Our previous example could then be written as:

    // heisdead.phtml
    He is dead <?= $this->name ?>. He died at 
    <?= $this->formatDate($this->dateTimeOfDeath); ?>.

    // test.php
    ...
    $context = new \CHH\DefaultContext;
    $context->name = 'Jim';
    $context->dateTimeOfDeath = '2011-10-26 12:00:00';

    echo $template->render($context);
    // Outputs "He is dead Jim. He died at 2011/10/26 12:00.

This default context, could then also have some kind of plugin loader
to allow extending the context with additional helper methods (think
`Zend_Loader_PluginBroker` of the upcoming ZF2).

## Conclusion

Closure object support makes injecting behaviour into classes
much more elegant &mdash; as they can give you a access to
the classes' properties. It can also simplify templating engines alot, 
by putting the template inside the closure.

## Further Reading

 * PHP Manual, [Anonymous Functions](http://www.php.net/manual/en/functions.anonymous.php)
 * PHP Manual, [The Closure Class](http://www.php.net/manual/en/class.closure.php)
 * PHP Wiki/RFC, [RFC: Closures Object Extension](https://wiki.php.net/rfc/closures/object-extension)
