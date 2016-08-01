---
title: Customization (TODO)
---

???

In this chapter, we'll look at various ways to customize the environment
provided by a Unix-like system. These techniques can help maintain awareness of
the system state, increase productivity, or simply make the terminal look
nicer.

---

# Re-cap: 

```
vm$ sh ./greet.sh
Hello.
vm$ ./greet.sh
./greet.sh: Permission denied
vm$ chmod +x ./greet.sh
vm$ ./greet.sh
Hello.
vm$
```

???

In :chapter:scripting:, we saw how a shell script could be invoked from the
command line. This pattern is much more convenient than using the script as
an input to the shell utility, but it hides an important detail: in both cases,
the script is executed as a standalone process.

---

# The hidden process

```
vm$ pwd
/home/sally
vm$ cat change-env.sh
#!/bin/bash
FOO=8
cd /
vm$ ./change-env.sh
vm$ echo [ $FOO ]
[ ]
vm$ pwd
/home/sally
vm$
```

???

If the script's purpose is to modify the *system* state (e.g. by modifying
files, starting processes, etc.), then this distinction is not very important.
However, if we want to use the script to modify the *environment*, then the
process boundary is a problem.

A script executed in this way might set environment variables or change
directories, but this will not effect the "calling" context. The goal of this
chapter is to automatically modify our shell's environment, so we'll need to
learn a new way of executing scripts before we can go any further.

---

# "Sourcing" files with `.`

```
vm$ help .
.: . filename [arguments]
    Execute commands from a file in the current shell.

    Read and execute commands from FILENAME in the current shell.
    The entries in $PATH are used to find the directory
    containing FILENAME. If any ARGUMENTS are supplied, they
    become the positional parameters when FILENAME is executed.

    Exit Status:
    Returns the status of the last command executed in FILENAME;
    fails if FILENAME cannot be read.
vm$
```

???

`.` (a.k.a. "dot") is a standard (though oddly-named) shell utility that does
exactly this.

---

:continued:

```
vm$ pwd
/home/sally
vm$ cat change-env.sh
#!/bin/bash
FOO=8
vm$ . change-env.sh
vm$ echo [ $FOO ]
[ 8 ]
cd /
vm$ pwd
/
vm$
```

???

Using the "dot" utility is essentially saying, "interpret the commands in this
file as though I entered them directly into this terminal window myself."

---

:continued:

```
vm$ cat change-prompt.sh 
# Set the command prompt to a Microsoft Windows-style
# value. It's just a bunch of characters, after all!
PS1='C:/> '
vm$ . change-prompt.sh 
C:/> 
```

???

We can use this right away to start writing scripts that customize our
environment. (Recall the `$PS1` variable discussed in
:chapter:command-invocation:.) Our current knowledge of customizations is
still limited, but even now, we can appreciate a problem with this approach.
Running a configuration script like this every time we logged in the system
would become tiresome very quickly.

Thankfully, we can instruct the system to automatically run our configuration
scripts on our behalf. Accomplishing this is somewhat more complicated than it
might seem at first, so we'll take some time to discuss the details before
returning to more customization options.

---

# Startup scripts

- bash: `~/.bash_profile`, `~/,bash_login`, `~/.profile`, `~/.bashrc`
- tcsh: `~/.tcshrc`, `~/.cshrc`, `~/.login`
- zsh:  `$ZDOTDIR/.zshenv`, `$ZDOTDIR/.zprofile`, `$ZDOTDIR/.zshrc`,
  `$ZDOTDIR/.zlogin`

???

To facilitate environment customation, every shell has a different set of
hidden files that it will execute as it initializes. The file we should modify
depends not only on the shell we are using, but also the "invocation mode" of
the shell.

---

# Shell invocation modes

```
vm$ cat shell-classifications.txt
                |     Login     |    Non-login    |
----------------+---------------+-----------------+
Interactive     |               |                 |
                |               |                 |
----------------+---------------+-----------------+
Non-interactive |               |                 |
                |               |                 |
----------------+---------------+-----------------+
vm$
```

???

Whether you are using `bash`, `sh`, `zsh`, or some other shell, all shells
recognize two orthogonal "invocation modes": interactive versus
non-interactive, and login versus non-login. These modes effect how the shell
behaves as it starts.

---

:continued:


> If you open a shell or terminal (or switch to one), and it asks you to log in
> (Username? Password?) before it gives you a prompt, it's a login shell.

https://askubuntu.com/questions/155865/what-are-login-and-non-login-shells

???

This is a frequently-discussed topic on the web, but even among those supplying
answers, there is some confusion about what this means.

---

# Shell invocation mode considerations

- The **conventional meaning** of the mode
- The **requirements** for a new shell process to qualify for this mode
- The **effect** the mode has on the shell's behavior

???

The best way to understand these distinctions is via three different
considerations.

---

# "Login" shells

- **Conventional meaning** - this process is a user's connection to the system
- **Requirements** - one of:
  - the value of the `$0` variable begins with a "dash" character (`-`)
  - the shell was invoked with the `-l` option
- **Effect** - the shell runs startup scripts designated for "login" sessions

---

# "Interactive" shells

- **Conventional meaning** - the standard input stream of this process is
  connected to a keyboard, and the user will enter commands over time
- **Requirements** - one of:
  - the shell was invoked without options and the standard input is connected
    to a terminal
  - the shell was invoked with the `-i` option but not the `-c` option
- **Effect** - the shell runs startup scripts designated for "interactive"
  sessions

???

We separate "conventional meaning" from "requirements" because given the
correct options, a shell can be run in any  "mode" regardless of the current
context. While it may be a little technical, it's not magic!

---

# Shell invocation modes: conventional examples

```
vm$ cat shell-classifications-examples.txt
                |     Login     |    Non-login    |
----------------+---------------+-----------------+
Interactive     | connecting    | opening a       |
                | via SSH       | terminal window |
----------------+---------------+-----------------+
Non-interactive | very rare     | running a       |
                | circumstances | shell script    |
----------------+---------------+-----------------+
vm$
```

???

These distinctions exist to allow for fine-grained control over how the system
prepares the environment in different contexts. However, the distinction
between "login" and "non-login" is largely a vestage from the past, when
terminals were slow and computing time was expensive. For our purposes, whether
or not a shell is a "login shell" will not be particularly relevant.

---

- Customization
  - Startup scripts
    - Interactive vs. non-interactive shells
    - Login vs. non-login shells
    - `source`
  - Aliases
