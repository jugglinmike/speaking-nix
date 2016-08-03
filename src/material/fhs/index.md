---
title: Filesystem Hierarchy Standard (TODO)
---

```
vm$ cat fhs.txt
    bin/       usr/            var/
    boot/         bin/            account/
    dev/          include/        cache/
    etc/          lib/            crash/
    home/         local/          games/
    lib/             bin/         lib/
    media/           lib/         lock/
    mnt/             sbin/        log/
    opt/          sbin/           mail/
    root/         share/          opt/
    run/          src/            run/
    sbin/                         spool/
    srv/                          tmp/    
    tmp/
vm$
```

???

Spend enough time on a Unix-like system and you will stumble across an
intimidating tree of strangely-named directories with inscrutable purposes.

The Filesystem Hierarchy Standard is an attempt to document and normalize this
structure. It is maintained by [the Linux
Foundation](http://www.linuxfoundation.org/) and *not* [the Open
Group](http://www.opengroup.org/), so it is not part of POSIX nor a requirement
to qualify for the Unix trademark. It is, however, widely observed by Unix-like
system distributors and administrators.

---

This chapter is a high-level overview that explores the significance of each
directory for a system administrator.

---

# System Directories

```
vm$ cat fhs-system.txt
    bin/       usr/          * var/
  * boot/         bin/            account/
  * dev/          include/        cache/
    etc/          lib/            crash/
    home/         local/          games/
    lib/             bin/         lib/
    media/           lib/         lock/
    mnt/             sbin/        log/
    opt/             share/       mail/
    root/         sbin/           opt/
    run/          share/          run/
    sbin/                         spool/
    srv/                          tmp/    
    tmp/
vm$
```

---


# Application Directories

```
vm$ cat fhs-applications.txt
  * bin/       usr/          * var/
    boot/       * bin/            account/
    dev/        * include/        cache/
  * etc/        * lib/            crash/
    home/         local/          games/
  * lib/             bin/         lib/
    media/           lib/         lock/
    mnt/             sbin/        log/
    opt/             share/       mail/
    root/       * sbin/           opt/
    run/        * share/          run/
  * sbin/                         spool/
    srv/                          tmp/    
  * tmp/
vm$
```

- Applications
  - Binary (`bin/` or `sbin/`)
  - Dependencies
    - Library code (`lib/`)
    - Library code definitions (`include/`)
    - Static assets (`share/`)
  - Internal data files (`/var/`)
  - Configuration files (`/etc/`)
  - Runtime information (`/run/`)
- System
  - Devices (`/dev/`)
  - Startup (`/boot/`)
- Admins
  - User directories (`/home/`)
  - Mounting file systems (`/media/`, `/mnt/`)
  - Installing applications (`/opt/`, `/usr/local/`)
  - Root user (`/root/`)

---

---

Important considerations:

- Speed to start up (largely irrelevant in modern systems) - motivates `/` vs.
  `/usr`
- Administrator versus user - motivates `/bin` vs. `/sbin`
- Support for multiple achitectures - motivates `/usr/share`


- `/etc` - configuration files (`/etc/bash.bashrc`, `/etc/nginx/nginx.conf`,
  `/etc/apache2/sites-available`)
- `/usr/share` - static, architecture-independent application data--`lib` for
  non-code files (man pages, brushes for drawing programs, levels for games)
- `/var` - variable data files (static web sites, e-mail, log files)

---

- `/bin`
- `/lib
- `/sbin`


- `lib` vs. `include`? Why is there no `/include` directory?

---

- What does "local"/"locally installed" mean?

- Binaries
  - For everyone
	- `/bin/` - commands for use by admins and users that do not require other
	  filesystems; e.g. `cat`, `chmod`, `date`, `echo`, `kill`, `ls`, `mkdir`,
      `mv`, `ps`, `pwd`, `rm`, `sed`
	- `/usr/bin/` - most user commands; standard place for interpreters like
	  `perl` and `python`
  - For admins
	- `/sbin/` - system binaries; utilities used for system administration;
	  essential for booting, restoring, recovering, and/or repairing the
	  system; e.g.  `fsck`, `ipconfig`, `reboot`
    - `/usr/sbin/` - e.g. `adduser`, `chroot`, `cron`
