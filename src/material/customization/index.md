---
title: Customization (TODO)
---

This chapter has yet to be completed.




> If you open a shell or terminal (or switch to one), and it asks you to log in
> (Username? Password?) before it gives you a prompt, it's a login shell.

https://askubuntu.com/questions/155865/what-are-login-and-non-login-shells



- "Login" shell
  - Log in directly through a text terminal (e.g. starting up a system built as
    a server that has no graphical interface installed)
  - Log in remotely through a text connection (e.g. connecting to a system
    using `ssh`)
- "Non-login" shell
  -


There is some confusion on the web about the meaning behind a shell's "mode."
The best way to understand these distinctions is via two different considerations:

- The semantic meaning of the mode
- The effect the mode has on the shell's behavior

---

"Login" shells

- **Technical conditions** - one of:
  - the value of the `$0` variable begins with a "dash" character (`-`)
  - the shell was invoked with the `-l` option
- **Semantic meaning** - this process is a user's connection to the system
- **Effect** - shell runs startup scripts designated for "login" sessions

"Interactive" shells

- **Technical conditions** - one of:
  - invoked without options are present and the standard input is connected
    to a terminal
  - invoked with the `-i` option but not the `-c` option
- **Semantic meaning** - the standard input stream of this process is
  connected to a keyboard, and the user will enter commands over time
- **Effect** - shell runs startup scripts designated for "interactive"
  sessions

???

From this perspective


---

Interactive      |
                 |
-----------------+-------------+------------------|
                 |             |
Non-interactive  |             |
                 |             |
                 +-------------+-------------------
                      Login    |        Non-login

---

- Customization
  - Startup scripts
    - Interactive vs. non-interactive shells
    - Login vs. non-login shells
    - `source`
  - Aliases
