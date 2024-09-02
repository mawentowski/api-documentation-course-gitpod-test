# Mac Setup Instructions

This guide will help you set up a development environment on a Mac, including generating and adding SSH keys for GitHub.

## Table of Contents

- [Mac Setup Instructions](#mac-setup-instructions)
  - [Table of Contents](#table-of-contents)
  - [1. **Install Xcode Command Line Tools**](#1-install-xcode-command-line-tools)
  - [2. **Generate an SSH Key for GitHub**](#2-generate-an-ssh-key-for-github)
  - [3. **Add SSH Key to GitHub**](#3-add-ssh-key-to-github)
  - [4. **Configure SSH Agent in `.bash_profile`**](#4-configure-ssh-agent-in-bash_profile)
  - [5. **Configure SSH Agent in `.zshrc`**](#5-configure-ssh-agent-in-zshrc)
  - [6. **Install Additional Tools**](#6-install-additional-tools)

## 1. **Install Xcode Command Line Tools**

**Open Terminal:**

- You can open Terminal from `Applications > Utilities` or by searching for it in Spotlight (`Cmd + Space`, then type "Terminal").

**Install Xcode Command Line Tools:**

- Run the following command:

  ```bash
  xcode-select --install
  ```

- Follow the prompts to complete the installation.

**Verify Installation:**

- Run this command to check if Xcode Command Line Tools are installed:

  ```bash
  xcode-select --version
  ```

- Optionally, you can also check with:

  ```bash
  xcodebuild -version
  gcc --version
  ```

## 2. **Generate an SSH Key for GitHub**

1. **Generate a New SSH Key:**

   - Run the following command, replacing `your_email@example.com` with your GitHub email address:

     ```bash
     ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
     ```

   - Press `Enter` to accept the default file location. You can set a passphrase for added security if desired.

## 3. **Add SSH Key to GitHub**

1. **Copy SSH Key to Clipboard:**

   - Display the contents of your public SSH key with:

     ```bash
     cat ~/.ssh/id_rsa.pub
     ```

   - If a long string starting with `ssh-rsa` appears, the command worked. Copy this string for the next step.

2. **Add SSH Key to Your GitHub Account:**
   - Go to [GitHub](https://github.com) and log in.
   - Navigate to **Settings** > **SSH and GPG keys** > **New SSH key**.
   - Paste your SSH key into the key field and give it a descriptive title.
   - Click **Add SSH key** to save it.

<comment>
Bear in mind that the default shell implementation in new versions of MacOS is zsh, not bash. And not really because zsh
is the preferred shell implementation of users. It's a fine shell with several extra features that bash lacks, but the
reay reason it's now the default is MacOS has less to do with those extras and more to do with its permissive MIT-style
license. After Version 3 (which is still included in MacOS, by the way), bash is distributed under a "copyleft" GNU license,
which means it can't come prepackaged in MacOS without forcing Apple to open-source that operating system, which they don't
want to do, of course.

On my MacBook, I forgo the few extra features of zsh in favor of having a consistent shell implementation with most Linux
distributions. So I use bash v5 that I installed via Homebrew, not zsh or bash v3. But it's probably not worth it to
recommend that your MacOS users switch over to bash v5. zsh is apparently nearly perfectyl backwards compatible with bash v5,
so your users should have no problem executing shell scripts intended for bash v5 in zsh.

Anyway, zsh refers to different config files than bash. It uses `.z_profile` rather than `.bash_profile`, and `.zshrc` rather
than `.bashrc.`

In a perfect world, I would insist on a setup that guaranteed that all users leveraged the same major version of the same
shell implementation, but again, in this case, it's probably not worth the potential headache the setup might cause
your non-technical users. So I guess I'm recommending that you make the relatively safe assumption that all your MacOS users
will be using zsh, not bash, and remove any mention of bash from instructions you provide them.
</comment>

## 4. **Configure SSH Agent in `.bash_profile`**

1. **Open Your `.bash_profile`:**

   - In Terminal, run:

     ```bash
     nano ~/.bash_profile
     ```

2. **Add SSH Agent Configuration:**

   - Add these lines to the bottom of the file:

     ```bash
     # Start the SSH agent
     eval "$(ssh-agent -s)"
     # Add your SSH private key to the agent
     ssh-add ~/.ssh/id_rsa
     ```

   - Press `Ctrl + O` to save, then `Ctrl + X` to exit `nano`.

<comment>
This step is not needed if the user opens a new zsh process in terminal as part of Step 4,
assuming they have a command similar to this one in their `~/.z_profile`, which probably really ought
to. Check your `~/.z_profile` for reference.
```shell
test -f ~/.zshrc && . ~/.zshrc
```
I think you should get rid of this step and modify Step 4 to require the user to open a fresh terminal.
</comment>
1. **Source the `.bash_profile`:**

- Apply the changes by running:

     ```bash
     source ~/.bash_profile
     ```

2. **Verify SSH Agent:**
   - Run the following to check if the SSH agent is running and your key is added:

     ```bash
     ssh-add -l
     ```

## 5. **Configure SSH Agent in `.zshrc`**

1. **Open Your `.zshrc`:**

   - In Terminal, run:

     ```bash
     nano ~/.zshrc
     ```

2. **Add SSH Agent Configuration:**

   - Add these lines to the bottom of the file:

     ```bash
     # Start the SSH agent
     eval "$(ssh-agent -s)"
     # Add your SSH private key to the agent
     ssh-add ~/.ssh/id_rsa
     ```

   - Press `Ctrl + O` to save, then `Ctrl + X` to exit `nano`.

3. **Source the `.zshrc`:**

   - Apply the changes by running:

     ```bash
     source ~/.zshrc
     ```

4. **Verify SSH Agent:**
   - Run the following to check if the SSH agent is running and your key is added:

     ```bash
     ssh-add -l
     ```

<comment>
For non-technical users, I would just send them to https://nodejs.org to download an installer app, just as you
recommend in your instructions for Windows users.

Developers and other tech-savvy users will acquire Node.js via nvm (the Homebrew installation of which is not supported 
by the nvm team).
</comment>
## 6. **Install Additional Tools**

1. **Homebrew:**

   - Install Homebrew with:

     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```

   - Verify Homebrew installation with:

     ```bash
     brew --version
     ```

2. **Node.js and npm:**

   - Install Node.js with Homebrew:

     ```bash
     brew install node
     ```

   - Verify Node.js and npm installation with:

     ```bash
     node --version
     npm --version
     ```
