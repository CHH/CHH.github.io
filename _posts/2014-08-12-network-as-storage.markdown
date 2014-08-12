---
layout: post
title: "The Network as Data Storage"
date: "Di Aug 12 16:14:49 +0200 2014"
excerpt: "Just like a file, a socket is an ordered stream of data. Do you know what’s also ordered? You’re right, a queue. So the network is essentially a queue. You know any of those fancy job processing systems, like Gearman or RabbitMQ? We can use the network to achieve some of their features, without any  infrastructure."
---

{% include posts/socket-book.html %}

Just like a file, a socket is an ordered stream of data. Do you know what’s also ordered? You’re right, a queue. So the network is essentially a queue. You know any of those fancy job processing systems, like Gearman or RabbitMQ? We can use the network to achieve some of their features, without any  infrastructure.

## A Quick Primer on Job Queues

If you don’t know any of  these systems: imagine you  have some expensive operation, e.g. resizing uploaded images, which can happen perfectly fine in the background. Systems like this let you push these jobs in an out of process queue, a separate process then picks the message up and produces the result in the background. The user’s request returns nearly immediately.

## The Protocol

The producer of messages writes for every pushed job a serialized PHP object, each on its own line.

In essence it will look like this, if it would be written to a file:

    O:3:”Job":1:{s:4:"data";s:3:"foo";}
    O:3:”Job":1:{s:4:"data";s:3:"BAR";}

_Why PHP serialized?_ It’s simple, and we can encapsulate all of the code for running the job in a single class. The are some drawbacks to this. The consumer needs to be able to decode PHP serialized data and needs access to the same classes than the producer, which limits us to consumers written in PHP. Since we decided to write the consumer in PHP anyways, this isn’t a huge issue for us.

The consumer reads each line it receives on the socket, decodes the serialized object and calls the class’ run method.

## The “Job” Class (http://git.io/ql0w8w)

This is a simple implementation of the job class. It has one property for generic payload data and the run method has to be implemented by specific jobs. The HelloWorldJob implements the run method, which waits two seconds and then prints “Hello World”, followed by the payload (which is expected to be a name) and a newline. The call to sleep should simulate an expensive task.

```
<?php
// job.php

abstract class Job
{
    protected $data;

    function __construct($data)
    {
        $this->data = $data;
    }

    function getData()
    {
        return $this->data;
    }

    abstract function run();
}

class HelloWorldJob extends Job
{
    function run()
    {
        printf("Hello World %s\n", $this->data);
    }
}
```

## The “Producer” Class

Connects to the queue, serializes the jobs in our serialization format, and writes them to the queue socket.

```
<?php
// producer.php

require_once __DIR__.'/job.php';

class Producer
{
    private $socket;

    function push(Job $job)
    {
        fwrite($this->getSocket(), serialize($job)."\n");
    }

    private function getSocket()
    {
        if (null === $this->socket) {
            $this->socket = @stream_socket_client('tcp://127.0.0.1:8001', $errno, $errstr);

            if (false === $this->socket) {
                throw new \UnexpectedValueException(sprintf("Couldn't connect to queue: %s", $errstr));
            }
        }

        return $this->socket;
    }
}
```

## The “Push” Script

You would typically run this code in your web application. It creates the Producer and pushes the Job.

```
<?php
// push.php

require_once __DIR__.'/job.php';
require_once __DIR__.'/producer.php';

$job = new HelloWorldJob("Christoph");

$producer = new Producer;
$producer->push($job);
```

## The “Consume” Script

The consume.php script waits for jobs to be added to the queue, reads each line sent by a client, deserializes and runs the job. This script would be run in a separate service on the server.

```
<?php
// consume.php

require_once __DIR__.'/job.php';

$server = @stream_socket_server('tcp://0.0.0.0:8001', $errno, $errstr);

if (false === $server) {
    # Write error message to STDERR and exit, just like UNIX programs usually do
    fprintf(STDERR, "Error connecting to socket: %d %s\n", $errno, $errstr);
    exit(1);
}

for (;;) {
    $conn = @stream_socket_accept($server, -1, $peer);

    if (is_resource($conn)) {
        while ($data = fgets($conn)) {
            $job = unserialize($data);
            $job->run();

            if (feof($conn)) {
                break;
            }
        }
    }
}
```

## Putting it all together

Run the consume.php script in one terminal. Now open up another terminal and start push.php. You will notice that it returns immediately. How is that possible? It’s simple. As I’ve mentioned earlier, the operating system really accepts the connection and stores all sent data for us in the backlog. Calling `stream_socket_accept` is more like telling the OS that our program is ready for serving another connection. If the connection is alive or the client already disconnected doesn’t matter. The OS gives us the data sent by the client anyways.

This is exactly what it means to use the network as storage. The operating system saves the data for us, and allows the client to disconnect as soon as all data was sent as long as it needs nothing from the server. The additional benefit is that the consumer doesn’t need to hold all data in memory. The operating system additionally manages that the backlog doesn’t get too large.

But be aware that writes to the socket might block once the backlog is full. Therefor for larger systems a production grade job queue like _Gearman_, or a more intelligent transport layer like _ZeroMQ_ or _NanoMsg_, will be a great idea nonetheless.

There are also some great libraries out there which handle multiple backends
and ship with ready-to-use consumers:

 - [Bernard](http://bernardphp.com)
 - [Kue](http://github.com/CHH/kue)
