Yar! There be treasure in these parts, and now's the time to grab it!

I see ya eyeing me wooden leg. You're right, I can't do this on me own. But
lest ye be gettin' an ideas about taking off with that treasure yourself,
remember I've got yer precious pet snail waiting in the galley. If I don't hear
word from you by midnight, I'll be feasting on escargot. Well it's just the one
animal, so not much of a feast, I suppose. It'll be mostly coconuts, like
always. Listen, what I'm trying to say is I'm going to eat your snail, okay? So
make it quick!

Follow the instructions in :chapter:vagrant: to get set up, then once you've
connected with `vagrant ssh`, you'll find a directory named `island` in your
"home" directory. Within that directory is a file named `turtle.txt`. Use `cat`
to read the contents and get your next step.

```
1. island/turtle.txt
   Go to the footpath, then go right, straight, left, and right. Read whatever
   you find there.
2. island/footpath/right/straight/left/right/sign.txt
   Go back 2 steps and straight 2 more.
3. island/footpath/right/straight/straight/straight/sign.txt
   Go to $MAGIC_PORTAL
4. island/cave/2/4?4/5 5-9/9:4[]4/0))1/2@!3/sand.txt
   You find yourself in an enclosed space, many directories inside the
   `island/cave/`.

   As you know, your current location is a directory on the file system. That
   directory is within another directory, which is in another directory, and so
   on.

   Your next location must be derived from your current location. Each
   directory that makes up your current location starts with a numeric digit.
   If `X` is the sum of those digits, go to `islance/cave/X` and speak to the
   cave dweller you find there.
5. island/cave/22/cave-dweller.txt
   There is a `book` in the `forest`. Read it.
6. forest/stream

```

Task                                            | Concept(s) tested
------------------------------------------------+------------------------------
- Follow the instructions in the .txt file in   | `ls`, `cat`
  the current directory                         |
- Move to $MAGIC_PORTAL                         |
- Move to a directory whose name is made up of  | `pwd`, directory separators
  the first letter in every directory in the    |
  current working directory                     |
- Move up X directories and down Y more         | `..`
- Given a file with an unordered list of        | `sort`
  directory names, move to the directory that   |
  comes last alphabetically                     |
- Find a file within a heavily nested directory | `tree`
