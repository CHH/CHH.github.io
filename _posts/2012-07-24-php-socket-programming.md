---
layout: post
title: PHP Socket Programming, done the Right Way™
custom_excerpt: >
    When it comes to socket programming with PHP, nearly
    all articles are about the Socket Extension, despite it's
    the unfriendliest and most cumbersome way to work with Sockets
    in modern PHP. Let me introduce you to something, which apparently
    is pretty unknown among PHP programmers &mdash; __Stream Sockets__.
---

{% include posts/socket-book.html %}

<p class="info-box">
This article is also available in
<a href="http://science.webhostinggeeks.com/php-soket-programiranje">Serbo-Croatian</a>.
</p>

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

You can read more about the supported socket transports for
`stream_socket_` functions [in the Manual][socket_transports].

Here's a simple example for making an HTTP request:

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

    $addr = gethostbyname("www.example.com");

First you need the IP address of the host you want to connect to. This
is done with the `gethostbyname` function.

    $client = stream_socket_client("tcp://$addr:80", $errno, $errorMessage);

    if ($client === false) {
        throw new UnexpectedValueException("Failed to connect: $errorMessage");
    }

Then we create the socket connection with `stream_socket_client`. When
it returns false, it means there was an error &mdash; so we throw an exception.
`stream_socket_client` allows to pass references as second and third arguments, which get then set
with the error code and the error message when an error occurs.

    fwrite($client, "GET / HTTP/1.0\r\nHost: www.example.com\r\nAccept: */*\r\n\r\n");
    echo stream_get_contents($client);

Socket connections created by `stream_socket_client` are streams, just
like files opened via `fopen`. This means we can use `fwrite` to write
bytes to the socket and we can use the convenient `stream_get_contents`
function for reading the whole response.

    fclose($client);

Stream sockets can be closed, just like files, by `fclose`.

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

    $server = stream_socket_server("tcp://127.0.0.1:1337", $errno, $errorMessage);

    if ($server === false) {
        throw new UnexpectedValueException("Could not bind to socket: $errorMessage");
    }

    for (;;) {
        $client = @stream_socket_accept($server);

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

_Windows users:_ You can open a telnet connection on `127.0.0.1` and
port `1337`, type something in and press enter. You should see the same
text appear.

Lets walk through this, step by step:

    $server = stream_socket_server("tcp://127.0.0.1:1337", $errno, $errorMessage);

First bind on the `tcp` socket on address `127.0.0.1` and port `1337`.
This is the network socket, which can be used by clients to connect to
our server. Just like `stream_socket_client`, two arguments can be
passed by reference, which then get filled with the error number and
human readable error message.

    if ($server === false) {
        throw new UnexpectedValueException("Could not bind to socket: $errorMessage");
    }

If an error occured, the function returns `false`, so we quit here by
throwing an exception. It makes no sense to start waiting for connections when we
couldn't register ourselves for the socket.

    for (;;) {

Using `for` without statements causes it to loop forever. We need this,
because the server should run until we decide to kill it.

    $client = @stream_socket_accept($server);

`stream_socket_accept` blocks until a client connects to the socket or
the timeout expires. Error suppresssion is intentional here, because this function likes to
spit out unnecessary warnings.

    if ($client) {

The call to `stream_socket_accept` either returns a connection or `null`
when the timeout expired. So we want only to do something when a client
actually connected, which is when the return value was "truthy".

    stream_copy_to_stream($client, $client);

This gem is very handy for our echo server. It copies bytes from the
stream given as first argument, to the stream given as second argument.
So it actually sends everything back, what the client sent.

    fclose($client);

Last, but not least, we close the connection to the client. This is not
always necessary, because in some scenarios you want to let the client
close the connection (e.g. FTP).

## Further Reading

Manual Pages:

- [List of supported socket transports][socket_transports]
- [All Stream Socket Functions](http://php.net/results.php?q=stream_socket_&l=en&p=local)

Functions for connecting/binding to sockets:

- [stream_socket_server][]
- [stream_socket_client][]

[socket_transports]: http://php.net/manual/en/transports.php
