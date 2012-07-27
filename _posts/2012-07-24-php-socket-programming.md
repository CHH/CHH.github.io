---
layout: post
title: PHP Socket Programming, done the Right Way™
excerpt: >
    When writing about socket programming with PHP, nearly
    all articles are about the Socket Extension, despite it's
    the unfriendliest and most cumbersome way to work with Sockets
    in modern PHP. Let me introduce you to something, which apparently 
    is pretty unknown among PHP programmers &mdash; __Stream Sockets__.
draft: true
---
## What is a Socket?

The [IP Address][] is the identification of a network device within a
network, and the Port Number is the identification of a network
application within a Host.

These two things uniquely identify a network application on a computer
and are called _Socket_.

So when we send a packet to `127.0.0.1` and port `80`, the packet is
sent to the device `127.0.0.1` (your local host) and then the operating
system looks if an application has itself bound on port `80`.

If there's an application bound on port `80`, then the operating system
forwards the network packet to the application. The application can then
accept the connection. This connects to the IP Address and Port Number
the client sent with the initial request.

[IP Address]: http://en.wikipedia.org/wiki/IP_Address

## There's more than one way to do it

Sadly, there are two ways to do Socket programming with PHP:

- *Socket Extension:* despite being not even enabled by default when
  building PHP, the Socket Extension is referred by most authors when
  talking about Socket Programming. The manual refers to it as the "low
  level" Socket API, and the only thing it's good at, is at providing a
  C-like API. These are all functions starting with `socket_`.
- *Stream Sockets:* Since version _5.0.0_ of PHP, the Stream extension
  (providing all of PHP's IO abstraction) is able to _bind_ and _connect_
  to network sockets. Socket resources created with the stream extension
  can be used with almost all stream related functions, like `fgets`,
  `fread` or `stream_get_contents`, and therefor provide access to
  streams in a simple and convenient way, which is like working with
  file handles. These functions all start with `stream_socket_` and are
  the ones you _really_ want to use.

## Connecting to a Server

Connecting to a server is done with the function
[stream_socket_client][]. The only mandatory argument is the
specification of the socket you want to connect to, and it returns a `resource`
on success or `false` on error.

[stream_socket_client]: http://at2.php.net/stream_socket_client

The socket specification is in the form of `$protocol://$host:$port`
where protocol is one of the following:

 - `tcp`, for communicating via TCP, which is used by almost all common
   internet protocols like HTTP, FTP, SMTP where reliability is needed.
 - `udp`
 - or `unix`, which connects to a Unix Socket, a special kind of network
   socket, which is internal to the operating system's network stack. Slightly more
   efficient, because no network interface is involved.

A simple example for making an HTTP request:

    <?php

    $addr = gethostbyname("www.example.com");
    $client = stream_socket_client("tcp://$addr:80", $errno, $errorMessage);

    if ($client === false) {
        throw new UnexpectedValueException("Failed to connect: $errorMessage");
    }

    fwrite($client, "GET / HTTP/1.0\r\nHost: www.example.com\r\nAccept: */*\r\n\r\n");
    echo stream_get_contents($client);
    fclose($client);

Let's go through this, step by step.

First you need the IP address of the host you want to connect to. This
is done with the `gethostbyname` function.

    $addr = gethostbyname("www.example.com");

Then we create the socket connection with `stream_socket_client`. When
it returns false, it means there was an error &mdash; so we throw an exception. 
`stream_socket_client` allows to pass references as second and third arguments, which get then set
with the error code and the error message when an error occurs.
    
    $client = stream_socket_client("tcp://$addr:80", $errno, $errorMessage);

    if ($client === false) {
        throw new UnexpectedValueException("Failed to connect: $errorMessage");
    }

Socket connections created by `stream_socket_client` are streams, just
like files opened via `fopen`. This means we can use `fwrite` to write
bytes to the socket and we can use the convenient `stream_get_contents`
function for reading the whole response.

    fwrite($client, "GET / HTTP/1.0\r\nHost: www.example.com\r\nAccept: */*\r\n\r\n");
    echo stream_get_contents($client);

Stream sockets can be closed, just like files, by `fclose`.

    fclose($client);

## Servers

The Stream extension also provides a simple way to make socket
servers with the [stream_socket_server][] function.

The function `stream_socket_server`, again, takes a socket specification
as first argument, in the same format as the string passed to `stream_socket_client`.

Running a server involves at least these things:

 1. Bind on a Socket, tells the operating system that we're interested
    in network packages arriving at the given network interface and port
    (= socket)
 2. Check if an incoming connection is available
 3. "Accept" the incoming connection (with [stream_socket_accept][]).
 4. Send something useful back to the client
 5. Close the connection, or let the client close it
 6. Go to `(2)`

When writing a server, you first have to do an "Accept" operation on the
server socket. This is done with the [stream_socket_accept][] function.
This function blocks until a client connects to the server, or the
timeout runs out.

[stream_socket_server]: http://php.net/stream_socket_server
[stream_socket_accept]: http://php.net/stream_socket_accept

Here is a simple echo server:

    <?php
    # server.php
    
    $server = stream_socket_server("tcp://127.0.0.1:1337");

    if ($server === false) {
        throw new UnexpectedValueException("Could not bind to socket.");
    }

    for (;;) {
        $client = stream_socket_accept($server);

        if ($client) {
            stream_copy_to_stream($client, $client);
            fclose($client);
        }
    }

You can try this by first starting your script:

    php server.php

Then start another terminal and type this:

    % echo "Hello World" | nc 127.0.0.1 1337
    Hello World

