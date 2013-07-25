---
layout: post
title: Go Patterns
---

I must admit that I'm a serious fan of [Go][]. I spent most of the last
company hackdays with it, doing some small projects, like a simple
language independent job queue, and some smaller libraries.

After reading over my code, I noticed that there is code I'm writing
over and over again.

Many of these patterns are from [Effective Go][], a book which is
maintained by the Go team. This book is available online, and highly
recommended.

If you are not already familiar with Go, I also recommend going through the [Tour of Go][] to get to know the core concepts of the language before reading this article. 

[Tour of Go]: http://tour.golang.org/
[Effective Go]: http://golang.org/doc/effective_go.html
[Go]: http://golang.org

## Constructor Function

Constructor functions are functions which return an
_initialized_ reference to the type. They have the prefix `New` (or `new` when private).
This means when there is a type `T` then the name of the constructor
function is `NewT`.

A package doesn't need to provide a constructor function for every type.
Usually constructor functions are only needed when the type needs
initialization, i.e. when the type embeds references to other types,
like Maps or references to other Structs.

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

## Futures

I'm not going to explain in detail what [Futures][] are, because it's not in the
scope of this article. TL;DR: If you have an operation which usually
takes rather long (e.g. sending on a socket), then you give the caller a
"Future" immediately. When the operation is finished the Future gets
resolved, which notifies the caller.

[Futures]: http://en.wikipedia.org/wiki/Future_(programming)

In Go you can replicate most of the behavior of Futures just with a couple lines of code —
thanks to channels and Goroutines.

I like to write Futures in Go with a `struct` type which has `Success` and
`Error` channels. These channels are used to resolve the Future into the
"error" and "success" states, respectively. 

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

If you read throughly about Futures in Programming, then you might
notice that this implementation is fairly incomplete. It lacks stacking
of futures, error bubbling and protection against resolving from
the outside. Constructing a more "correct" Future implementation though is 
unnecessary for most use cases, and left as an exercise to the reader.

## BYOC

Just like C has "BYOB" — Bring your own Buffer, Go has "BYOC" — __B__ring
__Y__our __O__wn __C__hannel.

This means that functions which produce or consume
values with a channel let the user make the channel.

The advantage is that users are able to decide the buffer size of the
channel. This is helpful when you want to run multiple instances of the
function on the same channel.

    package main

    import "fmt"
    import "math/rand"

    // Generates some random numbers
    func generateSomeRandoms(c chan int) {
        for {
            number := rand.Int()

            c<-number
        }
    }

    func main() {
        numWorkers := 4
        c := make(chan int, numWorkers)
        
        for i := 0; i < numWorkers; i++ {
            go generateSomeRandoms(c)
        }
        
        // Get 10 random numbers
        for i := 0; i < 10; i++ {
            fmt.Println(<-c)
        }
        
        close(c)
    }

## Generator

Generators are a feature known from Python or more recently also from
PHP and JavaScript. Generators represent non-rewindable sequences of
values. In Go we can represent a generator by a function which yields
values on a channel via an embedded Goroutine.

    package main

    import "fmt"

    func xrange(from int, to int) chan int {
        yield := make(chan int)

        go func() {
            for i := from; i <= to; i++ {
                yield <- i
            }
            close(yield)
        }()
        
        return yield
    }

    func main() {
        for i := range xrange(0, 10) {
            fmt.Println(i)
        }
    }

I think it's fine that generators don't adhere to BYOC, because it
usually doesn't make sense to run multiple instances of the same
generator on the same channel.

Generators are a good choice for offering an efficient and uniform iteration API
for custom data structures, like Stacks, Lists or Trees. The `range` construct is able to iterate
over a channel, and while the `for-range` loop processes the current
value, the generator is able to already calculate the next value.

## Fin

Go is a simple and effective language with powerful primitives, which
can be used to replicate many features of higher level languages.

Especially Channels and Goroutines are extremely powerful, yet simple
and efficient primitives. I really love how Go makes Concurrency
_really_ easy, without the bloat, and in a safe way.

