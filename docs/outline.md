# Speaking \*nix outline

## 1 Introduction

- History
  - Multics
  - Bell Labs, 1970 (origin of Unix)
  - Unix Wars
  - POSIX/Single Unix Specification
  - "Unix-like"
- About this course
  - Our virtual machine
    - Vagrant and VirtualBox
    - Ubuntu distribution of GNU/Linux
  - Topic overview
- Setup instructions
  - Download and install VirtualBox
  - Download and install Vagrant
- Working with Vagrant
  - `vagrant up`
  - `vagrant ssh`
  - `vagrant halt`
  - `vagrant destroy`

## 2 Getting your bearings

- Traversing and inspecting the file system
  - `cd`, `ls`, `pwd`, `tree` (where available)
  - Special paths: `.`, `..`, `/`, `~`
  - `cat`, `less`, `sort`
  - **Exercise**: Treasure hunt
- Command invocation
  - `echo`
  - Options and arguments
    - Long versus short (convention)
    - `man`
  - Shell expansion
    - DIAGRAM: Command -> Shell -> Executable
    - Filename expansion (`*`)
    - Home expansion (`~`, as we've seen)
    - Quotation mark and backslash
  - Environment variables
    - VIDEO: "The Front Fell Off"
    - Built-in: HOME, PATH
    - `which`
    - `env`
    - Setting your own (with and without `export`)
    - Transitivity
  - **Exercise**: Invoker
- Process Management I
  - CTRL-C
  - CTRL-D
  - CTRL-Z and `fg`
- All about `sudo`
  - Intro to users and permissions (and `whoami`)
  - The `root` user
  - Dangers
  - Recognizing when it is necessary
  - Recognizing when it is *not* necessary
- Networking for Web Developers
  - OSI
  - Testing with `curl`
  - The `ifconfig` utility
  - "Loopback" addresses and `127.0.0.1`
  - The `0.0.0.0` address
  - `/etc/hosts`
  - Ports (common ports, priviledged ports)

## 3 Improving your workflow

- File management
  - Organization: `mv`, `rm`, `mkdir`
  - Inspection: `wc`, `grep`, `find`
  - Manipulation: `nano`, `sed`, `awk`
- The edges of a process
  - Standard input, standard output, standard error
  - Input redirection from file
  - Output redirection to file (truncating)
  - Output redirection to file (appending)
  - Exit status
- Process combination
  - Command substitution
  - Exit status and `$?`
  - Piping (plus `xargs`)
- Shells, scripting, and portability
  - Script usability
    - "execute" permission (and `chmod`)
    - Shebang
  - Source readability
    - Newlines
    - Comments
    - Long vs. short options, revisited
  - Built-ins: `if`, `[`, `exit`
  - Boolean logical operators: `&&`, `||`
  - Shell variables: `$0`, `$#`
- Customization
  - Startup scripts
    - Shell invocation modes (interactive vs. non-interactive; login vs.
      non-login)
    - `source`
  - Aliases
  - Shell variables (`$PATH`, `$PS1`, `$CDPATH`)
  - Maintaining dotfiles

## 4 Managing systems

- Process management II
  - Process IDs and `ps`, `top`
  - `kill`, `killall`
- Users and groups
  - `chown`, `groups`, `who`
- File system hierarchy standard
  - `/tmp` (and `mktemp`)
  - `/var/log` (and `tail`)
  - `/mnt`
  - `/opt`
- Scheduling (cron, upstart, init.d)
- Linux distributions & package managers
