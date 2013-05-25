---
layout: post
title: Go Patterns
excerpt: Foo
---

I must admit that I'm a serious fan of [Go][]. I spent most of the last
company hackdays with it, doing some small projects, like a simple
language independent job queue, and some smaller libraries.

After reading over my code, I noticed that there is code I'm writing
over and over again.

[Go]: http://golang.org

## Constructor Function

Constructor functions are simple functions which usually return an
initialized reference to the type. They have the prefix `New` (or `new` when private), e.g. when we have a type `T` then the name of the constructor
function should be `NewT`.

A package doesn't need to provide a constructor function for every type.
Usually constructor functions are only needed when the type needs
initialization, i.e. when the type embeds references to other types.

Example:

    type Event struct {}

    type EventEmitter struct {
        Events map[string][]func(*Event)
    }

    func NewEventEmitter() *EventEmitter {
        return &EventEmitter{
            Events: make(map[string][]func(*Event)),
        }
    }



I'm not going to explain in detail what [Futures][] are, because it's not in the
scope of this article. TL;DR: If you have an operation which usually
takes rather long (e.g. sending on a socket), then you give the caller a
"Future" immediately. When the operation is finished the Future gets
resolved, which notifies the caller.

In Go you can create a Future just with a couple lines of code —
thanks to channels and Goroutines.

A Future Pattern in Go consists of a Future type which has `Success` and
`Error` channels. These channels are used to resolve the Future into the
"error" and "success" states respectively. 

    // Can be anything
    type Result interface{}

    type MyFuture struct {
        Success chan Result
        Error chan error
    }

    func doSomethingAsync() *MyFuture {
        future := &MyFuture{Success: make(chan Result), Error: make(chan error)}

        go func() {
            time.Sleep(5 * time.Second)
            future.Success <- 1
        }()

        return future
    }

The "Then" part uses a `select` construct to wait on the `Success` 
and `Error` channels until the Future is resolved.

    future := doSomethingAsync()

    select {
    case result := <-future.Success:
        // Future was successfully resolved and we can work with the
        // result
    case err := <- future.Error:
        // Future was resolved as error
    }

Here is a quick playground example:

[Futures]: http://en.wikipedia.org/wiki/Future_(programming)

<iframe src="http://play.golang.org/p/vytsY0nx-c" style="width: 100%"
height=300></iframe>

If you read throughly about Futures in Programming, then you might
notice that this implementation is fairly incomplete. It lacks stacking
of futures, the bubbling of errors and protection against resolving from
the outside. Though construction a more "correct" Future implementation is 
unnecessary for most use cases, and left as an exercise to the reader.

## Goroutine Worker Pool

## BYOC

Just like C has "BYOB" — Bring your own Buffer, Go has "BYOC" — Bring
your own Channel. This means that functions which produce or consume
values with a channel, should let the user make the channel. The
advantage is that users are able to decide the buffer size of the
channel. This is helpful when you want to run multiple instances of the
function on the same channel.

<iframe src="http://play.golang.org/p/mrbJG-W9TE" style="width: 100%"
height=300></iframe>

(`crypto/random` seems not to work on play.golang.org)

## Embedded Goroutine

## Generator

<iframe src="http://play.golang.org/p/qagj2rN9p2" style="width: 100%" height=300></iframe>

Generators are a feature known from Python or more recently also from
PHP and JavaScript. Generators represent non-rewindable sequences of
values. In Go we can represent a generator by a function which yields
values on a channel via an embedded Goroutine.

I think it's fine that generators don't adhere to BYOC, because it
usually doesn't make sense to run multiple instances of the same
generator.

Generators are a good choice for enabling efficient iteration of custom
data structures, e.g. Stacks or Lists, because while the outer loop
processes the current value, the generator is able to calculate
the next value in the mean time.

