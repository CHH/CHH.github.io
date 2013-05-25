---
published: false
layout: post
title: Writing Minimal PHP
custom_excerpt: >
    Recently I've done a small experiment: I'm toying with a
    style of PHP programming, which I want to call "Minimal PHP".
    Minimal PHP focusses on cutting the bloat from writing
    PHP and introduces a _lean_ subset of language features, which
    make the code more _flexible_ and pleasant to use.
---
Over the last few weeks, I've been coding on a [new Project][bob]
and I wanted to try something new and deviate a bit of my current
style.

This is a write-up of my experiences and thoughts and therefore an
_Opinion Piece_.

[bob]: http://github.com/CHH/Bob

## Interfaces are **not** DRY

After thinking about DRY, I've come to the conclusion the Interfaces
have the same flaws than Header Files in C: They duplicate knowledge.

So either you generate Interfaces automatically from your code, or 
just skip them _completely_ in favor of Duck Typing.

My experience is that interfaces become useless when they define more
than a few methods. The ideal interface has _one_ method. Though then
it's smarter to allow the user to pass a Callback instead.

I think the other flaw of Interfaces is, that they add more artifacts
to a codebase, which _do not actually do something_.

## Use Duck Typing

## Don't use function argument type hints

Be open with accepting input.

## Public instance variables are OK

## Omitting the `public` keyword is OK
