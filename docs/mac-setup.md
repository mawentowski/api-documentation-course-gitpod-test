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

3. **Source the `.bash_profile`:**

   - Apply the changes by running:
     ```bash
     source ~/.bash_profile
     ```

4. **Verify SSH Agent:**
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
