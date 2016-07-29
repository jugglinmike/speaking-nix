---
title: Networking for Web Developers (TODO)
---

???

Interfacing with the web is a primary motivation for using Unix-like systems
today. Whether you're running your team's development environment
on your machine, deploying to a "staging" server on the local network, or
troubleshooting a production server exposed to the Internet, there are a
handful of concepts that you'll need to understand.

This chapter is a high-level review of those concepts and how they apply to
Unix-like systems. If you are not involved with web development, this
information may not be relevant to you; feel free to continue on to the next
chapter.

---

# OSI

```
vm$ cat osi.txt
  # | Name         | Examples         toward user
  --+--------------+-----------------      ^
  7 | Application  | HTTP, FTP             |
  6 | Presentation | GIF, MPEG
  5 | Session      |
  4 | Transport    | TCP, UDP
  3 | Network      | IP, ICMP
  2 | Data Link    | Ethernet, PPP         |
  1 | Physical     | Wi-Fi, Bluetooth      v
                                      toward network
vm$
```

???

The Open Systems Interconnection model is a framework that describes how
systems can separate responsibilities. The web we know today is built from
components that fit into this framework.

These concepts extend beyond the purview of the Open Group and the POSIX
specification, so we won't find direct representations in "standard" utilities.
Even so, the pervasiveness of the web has led to the development of a wealth of
tooling, and it even has practical implications for system architecture.

---

:continued:

```
vm$ cat osi-traversal.txt
                .-- 10.0.2.3 ---.   .- 10.0.2.4 -.   .- 10.0.2.5 -.
                | curl 10.0.2.5 |   |            |   | web server |
                |       V       |   |            |   |     ^      |
7. Application  |       |       |   |            |   |     |      |
6. Presentation |       |       |   |            |   |     |      |
5. Session      |       |       |   |            |   |     |      |
4. Transport    |       |       |   |            |   |     |      |
3. Network      |       |       |   |            |   |     |      |
2. Data Link    |       |       |   |            |   |     |      |
1. Physical     |       |       |   |     x      |   |     |      |
                '-------V-------'   '-----^------'   '-----^------'
                        |                 |                |
...===== network ===============================================...
vm$
```

???

Every message that a user sends starts at the "top" of the stack and travels
"downwards." At each level, a sub-component modifies the message in some way
(e.g. attaching meta-data, translating it, or even splitting it into pieces)
before passing it along. The data leaves the system as the Physical layer
transmits it to the network.

The message is labeled with the name of its destination on the network. All the
machines on the network receive the message on the Physical layer, but only the
destination machine acts on it. At the destination, the message travels "up"
the stack, where (in an inverse of the sending process) each level "unpacks" or
reformats the message.

---

:continued:

```
vm$ cat osi-focus.txt
  # | Name         | Examples
  --+--------------+---------
  7 | Application  |
  6 | Presentation |
  5 | Session      |
+------------------------------+
| 4 | Transport    | TCP, UDP  |
| 3 | Network      | IP, ICMP  | <- Our focus
+------------------------------+
  2 | Data Link    |
  1 | Physical     |
vm$
```

???

The concepts in this chapter concern the Transport and Network layers specifically.

---

# `curl`

```
vm$ man curl
curl(1)                 Curl Manual                curl(1)

NAME
       curl - transfer a URL

SYNOPSIS
       curl [options] [URL...]

DESCRIPTION
       curl  is  a  tool  to  transfer  data  from or to a
       server, using one of the supported protocols (DICT,
       FILE,  FTP, FTPS, GOPHER, HTTP, HTTPS, IMAP, IMAPS,
       LDAP, LDAPS, POP3, POP3S, RTMP,  RTSP,  SCP,  SFTP,
       SMTP,  SMTPS,  TELNET  and  TFTP).   The command is
       designed to work without user interaction.
```

???

The `curl` utility allows us to make requests and inspect their results. It is
very fully-featured, but we'll only be using a small subset of its capabilities
in this chapter.

---

:continued:

```
vm$ curl example.com
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Example Domain</title>
  </head>
  <body>
    Welcome to example.com!
  </body>
</html>
```

???

By invoking `curl` with a URL, we are issuing an HTTP "GET" request. If the
server responds, `curl` will print the content of the response body to standard
output.

---

:continued:

```
vm$ curl -i www.example.com
HTTP/1.0 200 OK
Date: Thu, 28 Jul 1970 13:02:03 GMT
Content-type: text/html
Content-Length: 157
Last-Modified: Thu, 28 Jul 1970 13:01:57 GMT

<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Example Domain</title>
  </head>
  <body>
    Welcome to example.com!
  </body>
</html>
vm$
```

???

If invoked with the `-i`/`--include` option, `curl` will include the HTTP
headers of the response in its output. This option can be useful when
debugging, where details like the response's status code are especially
relevant.

---

# IP Addresses

```
vm$ host example.com
example.com has address 93.184.216.34
example.com has IPv6 address 2606:2800:220:1:248:1893:25c8:1946
vm$
```

???

In a network running on the Internet Protocol (IP), each machine has a unique
address, assigned to it by an authority of the network. This address is
typically represented with four numbers between 0 and 255 (inclusive),
separated by period characters (`.`). IP addresses are easy for a machine to
interpret but difficult for a human to remember.

The web applies the Internet Protocol in conjunction with the Domain Name
System (DNS) to define human-readable aliases for IP addresses like
"example.com".

Many systems include a utility named `host` that will tell you information about
a given DNS entry, inluding its corresponding IP address.

---

# `ifconfig`

```
vm$ man ifconfig
IFCONFIG(8)      Linux Programmer's Manual     IFCONFIG(8)

NAME
       ifconfig - configure a network interface
```

???

The environments that we work in may not have a DNS entry, so we'll need to be
comfortable working with IP addresses. The `ipconfig` utility that comes
bundled in many Unix-like environments can tell us this information.

---

:continued:

```
vm$ ifconfig
eth0      Link encap:Ethernet  HWaddr 08:00:27:2d:60:65
          inet addr:10.0.2.3   Bcast:10.0.2.255  Mask:255.255.255.0
          inet6 addr: fe80::a00:27ff:fe2d:6065/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:25291 errors:0 dropped:0 overruns:0 frame:0
          TX packets:14148 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:12757518 (12.7 MB)  TX bytes:1200573 (1.2 MB)

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:61 errors:0 dropped:0 overruns:0 frame:0
          TX packets:61 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0
          RX bytes:5359 (5.3 KB)  TX bytes:5359 (5.3 KB)
vm$
```

???

The output is a little verbose, though. This text describes two "interfaces,"
one named "eth0" and another named "lo." Each interface has as associated "inet
addr"--this is a network address.

The address of the "eth0" interface (`10.0.2.3` in this case) is assigned by an
authority on the network (e.g. a router). It may change whenever the computer
joins a network.

In contrast, the address of the "lo" interface is defined by the system itself,
and it generally does not change. The name "lo" is short for "loopback," and
the address `127.0.0.1` is very typical.

For now, we'll focus on the loopback address.

---

# Loopback addresses & `127.0.0.1`

```
vm$ cat osi-traversal-loopback.txt
                .---------- 10.0.2.3 ----------.   .- 10.0.2.5 -.
                | curl 127.0.0.1    web server |   |            |
                |      V                ^      |   |            |
7. Application  |      |                |      |   |            |
6. Presentation |      |                |      |   |            |
5. Session      |      |                |      |   |            |
4. Transport    |      |                |      |   |            |
3. Network      |      |                |      |   |            |
2. Data Link    |      '----------------'      |   |            |
1. Physical     |                              |   |            |
                '------------------------------'   '------------'

...===== network =============================================...
vm$
```

???

When `curl`, web browsers, or other applications make requests to loopback
addresses, the system handles them separately. Instead of passing the request
on to the Physical layer (in effect, transmitting them on the network), the
system redirects them back "up" the network stack. This "loop" that the request
travels in is where the interface gets its name.

This behavior is convenient for developers when they wish to create consistent
environments to support their work. Even though the IP address assigned by the
network is subject to change, the loopback address and its behavior will remain
constant.

Many web projects define a "development" mode where servers listen on this
address because it allows every contributor to use the same commands, scripts,
and URLs. In fact, we'll use it to run a server right now.

---

# Running a web server

```
vm$ webserver
webserver: command not found
vm$ webserver --please
webserver: command not found
vm$
```

???

POSIX doesn't specify a standard web server utility, so there is no canonical
way to start a local server on Unix-like systems.

---

:continued:

```
vm$ which python3
/usr/bin/python3
vm$ python3 -m http.server --bind 127.0.0.1
Serving HTTP on 127.0.0.1 port 8000 ...
```

???

Practically speaking, however, many modern Unix-like environments are outfitted
with the Python programming platform. Python 3 contains a built-in module named
`http.server` which is great for testing purposes.

This application is not fit for use in production. Most web projects will
define their own development environment using other tools like "Apache" or
"nginx". Despite this, Python's `http.server` still demonstrates the core
concepts well, so we'll use it in this chapter.

Note that the server is running on "port 8000." We'll discuss ports later in
this chapter. For now, we'll simply account for this by adding `:8000` to the
end of our requests' addresses.

---

:continued:

```
vm$ python3 -m http.server --bind 127.0.0.1
Serving HTTP on 127.0.0.1 port 8000 ...
^Z
[1]+  Stopped                 python3 -m http.server --bind 127.0.0.1
vm$ bg 1
[1]+ python3 -m http.server --bind 127.0.0.1 &
vm$
```

???

The server is a long-running process, we we will want to issue other commands
while we run it. As discussed in :chapter:process-mgmt-1:, we can do this by
sending the server "job" to the background using `Ctrl` + `Z`. Be sure to use
`bg` to re-activate it, though!

---

:continued:

```
vm$ curl 127.0.0.1:8000
127.0.0.1 - - [28/Jul/2016 21:09:05] "GET / HTTP/1.1" 200 -
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Directory listing for /</title>
</head>
<body>
<h1>Directory listing for /</h1>
```

???

Now that the server is running in the background, we can use `curl` to verify
everything is working as expected. The server provided by Python should respond
to our request with an HTML document that lists the contents of the current
directory.

---

# `localhost`

```
vm$ host localhost
localhost has address 127.0.0.1
localhost has IPv6 address ::1
vm$ curl localhost:8000
127.0.0.1 - - [28/Jul/2016 21:09:05] "GET / HTTP/1.1" 200 -
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Directory listing for /</title>
</head>
<body>
<h1>Directory listing for /</h1>
```

???

The host name `localhost` is usually synonymous with the address `127.0.0.1`.
It's also a lot more intuitive, so you'll see it used in many web projects.

---

# Sharing on the network: loopback woes

```
vm$ cat osi-traversal-loopback-hidden.txt
                .-- 10.0.2.3 ---.   .-- 10.0.2.5 ----.
                | web server on |   |                |
                |   127.0.0.1   |   | curl 127.0.0.1 |
                |               |   |    V           |
7. Application  |               |   |    |           |
6. Presentation |               |   |    |           |
5. Session      |               |   |    |           |
4. Transport    |               |   |    |           |
3. Network      |               |   |    |       x   |
2. Data Link    |               |   |    '-------'   |
1. Physical     |               |   |                |
                '---------------'   '----------------'

...===== network ==================================...
vm$
```

???

The loopback IP address is great for most use cases. However, sometimes you may
want to accept traffic from other machines on the network (e.g. to share your
work-in-progress with a teammate).

Other systems cannot address your server using `127.0.0.1` for a number of
reasons. Firstly, they are most likely configured to recognize that address as
a loopback address. The request will never reach the network under these
conditions.

---

:continued:

```
vm$ cat osi-traversal-loopback-hidden.txt
                .-- 10.0.2.3 ---.   .-- 10.0.2.5 ----.
                | web server on |   |                |
                |   127.0.0.1   |   | curl 127.0.0.1 |
                |               |   |      V         |
7. Application  |               |   |      |         |
6. Presentation |               |   |      |         |
5. Session      |               |   |      |         |
4. Transport    |               |   |      |         |
3. Network      |               |   |      |         |
2. Data Link    |               |   |      |         |
1. Physical     |       x       |   |      |         |
                '-------^-------'   '------V---------'
                        |                  |
...===== network ==================================...
vm$
```

???

...but even in the rare case that the remote machine is *not* configured with
such a loopback address, it is very unlikely that the network has assigned
`127.0.0.1` to your system. Your machine will ignore such requests.

---

:continued:

```
vm$ cat osi-traversal-loopback-hidden.txt
                .-- 10.0.2.3 ---.   .-- 10.0.2.5 ---.
                | web server on |   |               |
                |   127.0.0.1   |   | curl 10.0.2.3 |
                |               |   |      V        |
7. Application  |               |   |      |        |
6. Presentation |               |   |      |        |
5. Session      |               |   |      |        |
4. Transport    |               |   |      |        |
3. Network      |       x       |   |      |        |
2. Data Link    |       |       |   |      |        |
1. Physical     |       |       |   |      |        |
                '-------^-------'   '------V--------'
                        |                  |
...===== network =================================...
vm$
```

???

This means that your peers are forced to address your machine by the IP address
assigned by the network. Recall that we determined this address using
`ifconfig` earlier in this chapter.

Unfortunately, even this will not solve the problem. While your system may
accept the message as it is transmitted on the network, the message will not be
routed to the server process because the server is not "bound" to the correct
interface (as we saw with `ifconfig`, it is using "lo" instead of "eth0").

---

# Sharing on the network: hard-coding an address

```
vm$ cat osi-traversal-loopback-hidden.txt
                .-- 10.0.2.3 ---.   .-- 10.0.2.5 ---.
                | web server on |   |               |
                |   10.0.2.3    |   | curl 10.0.2.3 |
                |       ^       |   |      V        |
7. Application  |       |       |   |      |        |
6. Presentation |       |       |   |      |        |
5. Session      |       |       |   |      |        |
4. Transport    |       |       |   |      |        |
3. Network      |       |       |   |      |        |
2. Data Link    |       |       |   |      |        |
1. Physical     |       |       |   |      |        |
                '-------^-------'   '------V--------'
                        |                  |
...===== network =================================...
vm$
```

???

One solution is to bind your server process to the IP address assigned by the
network. This technically works, but it also eschews the benefits we saw with
using a consistent address--every contributor will have to run the server in a
slightly different way, and they will have to re-start as the network
conditions change.

---

# Sharing on the network: `0.0.0.0`

```
vm$ cat osi-traversal-loopback-hidden.txt
                .---------- 10.0.2.3 ------------.   .-- 10.0.2.5 ---.
                |                  web server on |   |               |
                | curl 127.0.0.1     0.0.0.0     |   | curl 10.0.2.3 |
                |      V               ^  ^      |   |      V        |
7. Application  |      |               |  |      |   |      |        |
6. Presentation |      |               |  |      |   |      |        |
5. Session      |      |               |  |      |   |      |        |
4. Transport    |      |               |  |      |   |      |        |
3. Network      |      |               |  |      |   |      |        |
2. Data Link    |      '---------------'  |      |   |      |        |
1. Physical     |                         |      |   |      |        |
                '-------------------------^------'   '------V--------'
                                          |                 |
...===== network ==================================================...
vm$
```

???

This is where another "special" address comes into play: `0.0.0.0`. It is a
sort of "placeholder" that in some contexts means, "no particular address."
When a webserver is listening on that address, it will accept all requests it
receives, regardless of IP. This means not only that teammates will have access
to the server via the network-assigned IP address, but also that we can use
`127.0.0.1` when working within the environment itself.

Because of this, using `0.0.0.0` is usually the best option. However,
development environments are inherently unstable and sometimes insecure, so
exposing the server to the local network may not be advisable. When in doubt,
speak to the lead developer on the project.

---

# `/etc/hosts`

```
vm$ cat /etc/hosts
127.0.0.1	localhost
vm$
```

???

We'll make one final consideration for working with hosts in web development
projects: the "hosts file." This file defines a list of host-name-to-IP-address
pairs. The system will redirect requests to any host name listed to the
corresponding IP address.

---

:continued:

```
vm$ host zombo.com
zombo.com has address 69.16.230.117
zombo.com mail is handled by 0 zombo.com.
vm$ cat /etc/hosts
127.0.0.1	localhost
69.16.230.117	opengroup.org
vm$ curl opengroup.org
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Zombo.com</title>
  </head>
  <body>
```

???

While we could use this for general mischief, the functionality is limited to
the local machine--it won't effect anyone else on the network.

---

:continued:

```
vm$ cat /etc/hosts
127.0.0.1	localhost
192.168.33.40	api.local
vm$ curl api.local
{}
vm$
```

???

Some web projects require the use of special "development mode" domains. So in
practice, you may need to modify the `/etc/hosts` file depending on the needs
of your project.

Be aware that this file effects the entire system, so `sudo` is required to
edit it.

---

# Ports

![Photograph of a shipping port](ports.jpg)

["Port Chalmers,
Dunedin"](https://www.flickr.com/photos/flyingkiwigirl/14529051237/) by
[Shellie](https://www.flickr.com/photos/flyingkiwigirl/) is licensed under [CC
BY-NC-ND 2.0](https://creativecommons.org/licenses/by-nc-nd/2.0/)

???

All of the requests to our local server have been to an address that ends in
`:8000`. The colon character (`:`) designates the end of the host name and the
beginning of the **port number**. Ports allow servers to designate different
processes as "request handlers" for different requests.

---

:continued:

```
vm$ cat osi-traversal-ports.txt
                .-------- 10.0.2.3 -------.   .------- 10.0.2.5 ---------.
                | file server  API server |   | GET / HTTP   $.post('/') |
                | on port 80   on port 45 |   | 10.0.2.3:80  10.0.2.3:45 |
                |      ^          ^       |   |      V            V      |
7. Application  |      |          |       |   |      |            |      |
6. Presentation |      |          |       |   |      |            |      |
5. Session      |      |          |       |   |      |            |      |
4. Transport    |      '-----+----'       |   |      '-----+------'      |
3. Network      |            |            |   |            |             |
2. Data Link    |            |            |   |            |             |
1. Physical     |            |            |   |            |             |
                '------------^------------'   '------------V-------------'
                             |                             |
...===== network ======================================================...
vm$
```

???

In terms of the OSI model, ports are implemented in the "Transport" layer--on
the web, this is TCP.


For instance, a person browsing a web site might request a page from your
server using port 80. A process like Python's `http.server` might be
"listening" on this port, and if so, it would handle the request by responding
with the page.

Soon after that, some JavaScript on the page might issue an asynchronous
request to your server, this time using port 45. Your server would receive the
request, and at the Transport layer, it would be directed to the HTTP API
process listening on port 45.

---

# Well-known ports

| Port Number | Function |
|-------------|----------|
|    21       | FTP      |
|    22       | SSH      |
|    25       | SMTP     |
|    80       | HTTP     |
|    194      | IRC      |
|    443      | HTTPS    |

???

There are established conventions for running certain kinds of servers over
certain ports. This is why we don't need to write `:80` to the end of URLs in
web browsers or `curl`--because those applications operate using HTTP by
default, port 80 is assumed.

These numbers are simply convention, though. All port numbers are functionally
equivalent, and any server is free to ignore convention and (for instance) run
an IRC server on port 80.

---

# Dealing with privilege

```
vm$ python3 -m http.server --bind 127.0.0.1 5555
Serving HTTP on 127.0.0.1 port 5555 ...
^C
Keyboard interrupt received, exiting.
vm$ python3 -m http.server --bind 127.0.0.1 80
PermissionError: [Errno 13] Permission denied
vm$ sudo python3 -m http.server --bind 127.0.0.1 80
Serving HTTP on 127.0.0.1 port 80 ...
```

???

Despite their functional equivalence, Unix-like systems treat port numbers
below 1024 as "privileged." This means we'll need administrative rights to
start servers that listen on those ports. If your project requires a
low-numbered port, be prepared to use `sudo`. For development environments,
it's usually preferable to configure servers to listen on higher port numbers
like `3000`, `5000`, or `8080`.

You can experiment with these concerns by specifying a port number as a final
option to Python's `http.server` module.

---

# In Review

- Utilities
  - `host` - finds the IP address for a given host on the network, e.g. `host
    example.com`
  - `curl` - makes a web request and returns the response
  - `ifconfig` - learn about the system's network interfaces, including any IP
    addresses assigned by the network
  - `python3 -m http.server` - start a web server that offers all the files and
     directories in the current directory
- The IP address `127.0.0.1` is a "loopback" address: requests made to it will
  not reach the network but instead be redirected back into the system; using
  it reduces the variability between team members' development environments
- `localhost` is an alias for `127.0.0.1`
- Servers listening on the IP address `0.0.0.0` will respond to any request
  they receive, making it ideal for exposing your system's development server
  on the local network; be sure your server is safe for outside access before
  using this address
- The file at `/etc/hosts` is known as the "hosts file"; it defines system-wide
  network redirection rules; editing it requires administrative privileges
- A web server may listen on any port number; the default for HTTP is 80;
  listening on port numbers below 1024 requires administrative privileges
