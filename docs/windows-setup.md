# Windows Setup Instructions

This guide walks you through setting a development environment on Windows.

## Table of Contents

- [Windows Setup Instructions](#windows-setup-instructions)
  - [Table of Contents](#table-of-contents)
  - [1. Install Git and Git Bash](#1-install-git-and-git-bash)
  - [2. Confirm Git and GitBash Installation](#2-confirm-git-and-gitbash-installation)
  - [3. Generate an SSH Key](#3-generate-an-ssh-key)
  - [4. Adding SSH Agent to Your `.bash_profile`](#4-adding-ssh-agent-to-your-bash_profile)
  - [5. Copy the SSH Public Key to Clipboard](#5-copy-the-ssh-public-key-to-clipboard)
  - [6. Add SSH Key to Your GitHub Account](#6-add-ssh-key-to-your-github-account)
  - [7. Install Node.js and npm](#7-install-nodejs-and-npm)
  - [8. Add Node.js to Your PATH](#8-add-nodejs-to-your-path)
  - [9. Verify Node.js Intallation](#9-verify-nodejs-intallation)
  - [10. Install `curl`](#10-install-curl)
  - [11. Test `curl` Installation](#11-test-curl-installation)
  - [Next Steps](#next-steps)

## 1. Install Git and Git Bash

1. **Download Git for Windows:**

   - Visit the [Git for Windows website](https://gitforwindows.org/) and download the installer.

2. **Run the Installer:**

   - Open the downloaded file to start the installation process.

3. **Follow the Installation Wizard:**

   The following list highlights only the essential steps of the installation process, rather than including every detail:

   - Click "Next" to proceed with the default options.
   - Choose the default installation location.
   - Select “Git Bash Here”.
   - Ensure that the option to "Use Git from the Windows Command Prompt" is selected.

4. **Complete the Installation:**

   - Click “Install” and then “Finish” once the installation is complete.

## 2. Confirm Git and GitBash Installation

1. Open **Visual Studio Code**:

   - Click on the **Start** button or press the Windows key on your keyboard.
   - Type "Visual Studio Code" or "VS Code."
   - Click on the **Visual Studio Code** application from the search results.

2. **Verify Git installation**:

   - Go to the top menu and click on **Terminal**.
   - Select **New Terminal** from the dropdown.
   - The next bullet applies to the video you see below.
   - On the bottom right-side, click the downward arrow next to the `+` icon and select `Git Bash`. See the video below (instead of `bash`, it will say `Git Bash`!):

   ![](gifs/select-gitbash.gif)

   - A Git Bash terminal opens.
   - To confirm Git installation, run:

   ```shell
   git --version
   ```

   Refer to the following video (watch the video until it repeats):

   ![](gifs/git-version.gif)

   If the command returns a Git version, the installation was successful. If not, there may have been an issue during installation. For help, visit the **SUPPORT - WINDOWS** > [# git-gitbash](https://discord.com/channels/1278288408795549716/1278295713742061579) channel.

3. **Verify GitBash installation**:

   - To confirm that you are using Git Bash, run the following command in the terminal:

     ```shell
     echo $SHELL
     ```

   - The output should show a path similar to `/usr/bin/bash` if Git Bash is set up correctly. If not, there may have been an issue configuring Git Bash as the default terminal in VS Code. For help, visit the **SUPPORT - WINDOWS** > [# git-gitbash](https://discord.com/channels/1278288408795549716/1278295713742061579) channel.

## 3. Generate an SSH Key

- With a **Git Bash** terminal open in Visual Studio Code, type the following:

  ```shell
  ssh-keygen -t rsa -b 4096 -C
  ```

  Don't hit ENTER yet!

- After the `-C`, you need to add a space, then write your GitHub email in quotation marks (i.e., the personal email you entered when setting up your GitHub account).

  The command so far looks like:

  ```shell
  ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
  ```

- After your email in quotation marks, you need to add a space, followed by the following characters: `-f ~/.ssh/id_GitHub_rsa`.
- The command in the terminal should now look like the following (except the email address should be your email):

  ```shell
  ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f ~/.ssh/id_GitHub_rsa
  ```

  Ensure the command above matches what is inside your terminal (except for the email). If it is not, hit `Ctrl + C` to cancel then start Step #2 over again.

- If the command is properly formatted, press `Enter` to accept the default file location.

- When prompted for a passphrase, press `Enter` again to skip adding a passphrase.
- Keep hitting `Enter` until you are returned to the command prompt. For example, when you have completed the process, you are returned to the command prompt:

  ```shell
  username@IN-username-W2 MINGW64 ~
  ```

  Your command prompt may appear slightly different. For instance, "username" will be replaced by your actual Windows username.

## 4. Adding SSH Agent to Your `.bash_profile`

1.  **Open .bash_profile**

- Ensure a Git Bash terminal is open in VS Code. To confirm that you are using Git Bash, run:

  ```shell
  echo $SHELL
  ```

- The output should show a path similar to `/usr/bin/bash`.
- Run the following command to open the `.bash_profile` file in the `nano` editor:

  ```shell
  nano ~/.bash_profile
  ```

2. **Add SSH Agent Lines**

- Copy the following code sample to your clipboard:

  ```shell
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/id_GitHub_rsa
  ```

- Add the code you copied to the bottom of your `.bash_profile` file:

  - Paste the code you copied into the open file.
  - Hit `Ctrl + O` to save the file.
  - Hit Enter to confirm.
  - Hit `Ctrl + X` to exit the editor.

  If you're strugging to add the specified lines to your `.bash_profile`, post a question to the **SUPPORT - WINDOWS** > [# git-gitbash](https://discord.com/channels/1278288408795549716/1278295713742061579) channel.

- In the terminal, type the following command and hit Enter:

  ```shell
  source ~/.bash_profile
  ```

3. **Verify the SSH Agent:**

- Check if the SSH agent is running by executing:

  ```shell
  ssh-add -l
  ```

- This command should list your added SSH keys if everything is set up correctly.

  If a list is not returned, there is likely was an issue configuring the SSH agent. You can post a question to **SUPPORT - Windows** > [# ssh](https://discord.com/channels/1278288408795549716/1278296342342664202) channel for help.

## 5. Copy the SSH Public Key to Clipboard

- Ensure a **Git Bash** terminal is open in Visual Studio Code.
- To display the contents of your public SSH key, run the following command:

```shell
cat ~/.ssh/id_GitHub_rsa.pub
```

- If the terminal outputs a long string beginning with `ssh-rsa`, the command was successful.
- Copy this string starting at `ssh-rsa`. For example, the copied string looks similar to the following (don't copy this one!):

```shell
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDJff1ovkl31I/G9WEPCZgPEI0YSkM9ZDFge/pVWgO4Dimt2R4AFB/wKrKjXhqBH1kuGCvY3E7RhKDHnovTslRQO5lyLhadgY7NIramRjjUItJxk39Bmdeuqgj+J/dRnths2JbZ/Fg1HdfGDEV2c7+ktank4ERhwnBfC1AykSMMYeU0B8fQg33IaQ7NHXDYPlw8/9uoYqJMtkTDEQyNlBsMt0ttragTk9XUpYj7X1dE+khQK2FiGcUNbTcCqR2YLFUtGtyHkzn6vmau3BO6cyphPUYdVFu3TEsBi02dWEBuskQwklT947Z8eQ9ZH05hIZxrVES6wc5q90AdBm856eSIviiwRg9BR4EXkm62eJgc6/gnAVEeb+8h/9O7dNDhnOJef2wwyO5qOVhY2xstFB//PFZddThAf95lbarZsFIeKuAl4Kba/KOoi1MgtskxmoadHIDapFP8U61ESZdseSinyr5TFs+k593tk+Z0dnzjzBx4PelTHxT6P/YZ6yUi5dFS5lkxH5YGUy1JAhN41l/IzQoHlcgT0oncIv49t1CpzFRL8hlu/d3VhObL3B5BVBJ0UaQffa0dWUUnpWzxcyFcE2+rkAvsdZ3htcwUIEgfUq0Gz4OjEMfv4YbQoIuq5DN7iJcyZfDYHQayzK6Lx5bP+M4tZ1vOVhqLUWqets5rUw== example@gmail.com
```

Be careful _not to copy the command prompt_ that appears after the string. For example, the following command prompt appears after the previous string—- avoid copying it (your command prompt will look different):

```shell
username@IN-username-W2 MINGW64 ~
```

## 6. Add SSH Key to Your GitHub Account

**Prerequisite**: You copied the public SSH key as instructed in the previous steps.

1. **Log In to GitHub:**

   - Go to [GitHub](https://github.com) and log in.

2. **Navigate to SSH Keys:**

   - Click your profile avatar.
   - Select **Settings**. Refer to the following video:

   ![](./gifs/avatar-settings.gif)

   - Go to **SSH and GPG keys**.
   - Click the green **New SSH key** button.

3. **Add Your SSH Key:**

   - Paste your public SSH key (the contents of `id_GitHub_rsa.pub`) into the key field and give it a descriptive title like "GitHub Public Key"
   - Click **Add SSH key** to save it.

   If you are having trouble adding your SSH key to GitHub, you can post to the **SUPPORT - Software** > [# github](https://discord.com/channels/1278288408795549716/1278293898204286987) channel for help.

## 7. Install Node.js and npm

1. **Download Node.js Installer:**

   - Visit the [Node.js website](https://nodejs.org/) and download the Windows Installer (LTS or Current version).

2. **Run the Installer:**

   - Open the downloaded file to start the installation process.

3. **Follow the Installation Wizard:**

   Note: The following list highlights only the essential steps of the installation process, rather than including every detail.

   - Click "Next" to proceed with the default options.
   - Choose the default installation location. Make a note of the default installation location (e.g., `C:\Program Files\nodejs)`)
   - Ensure that the option to install npm (Node Package Manager) is selected.
   - For the "Tools for Native Modules" screen, simply click Next without ticking the checkbox.
   - Click “Install” and then “Finish” once the installation is complete.

## 8. Add Node.js to Your PATH

Now, you'll need to add the Node.js path to the system PATH environment variable.

Here's how to do that:

1. **Open Environment Variables**:

- Press `Windows + R`, type `sysdm.cpl`, and hit **Enter**.
- Go to the **Advanced** tab and click on **Environment Variables**.

2. **Edit the PATH Variable**:

- In the **System Variables** section, scroll down and find the **Path variable**.
- Select **Path** and click **Edit**.

3. **Add the Node.js Path**:

- In the **Edit Environment Variable** dialog, click **New** and paste the path to your Node.js installation (e.g., C:\Program Files\nodejs).
- Click **OK** to save.

4. Restart your computer.

## 9. Verify Node.js Intallation

1. **Open a new terminal in VS Code**:

   - Open Visual Studio Code (if it is not already open).
   - Select `Terminal` > `New Terminal` from the menu.
   - On the right-side, click the downward arrow next to the `+` icon and select `Git Bash`. See the video below (instead of `bash`, it will say `Git Bash`!):

     ![](gifs/select-gitbash.gif)

   - A Git Bash terminal opens.

2. **Check Node.js version**:

   ```shell
   node --version
   ```

   3. Check npm version:

   ```shell
   npm --version
   ```

3. Both commands should output their respective versions, confirming that Node.js and npm are properly installed.

If those commands did not work, there is liklely an issue with your Node.js installation. You can post to the **SUPPORT - WINDOWS** > [# npm-node](https://discord.com/channels/1278288408795549716/1278296962340487209) channel for help.

## 10. Install `curl`

1. **Download `curl`:**

   - Visit the [curl website](https://curl.se/windows/) and download the appropriate `curl` package for Windows.

2. **Extract and Install `curl`:**

   Download curl: Go to the curl website and download the appropriate curl package for Windows

   Extract and Install curl: Extract the downloaded ZIP file to a location of your choice.

   - Add the path of the extracted `curl` executable (e.g., `C:\path\to\curl\bin`) to your system's `PATH` environment variable.
   - Open the Start menu, search for "Environment Variables," and select "Edit the system environment variables."
   - Click the "Environment Variables" button.
   - In the "System variables" section, find the `Path` variable and click "Edit."
   - Click "New" and add the path to the `curl` executable.
   - Click "OK" to close all dialogs.

## 11. Test `curl` Installation

1. **Open a new terminal in VS Code**:

   - Open Visual Studio Code.
   - Select `Terminal` > `New Terminal` from the menu.
   - On the right-side, click the downward arrow next to the `+` icon and select `Git Bash`. See the video below (instead of `bash`, it will say `Git Bash`!):

     ![](gifs/select-gitbash.gif)

   - A Git Bash terminal opens.
   - Run this simple `curl` command to verify it’s working:

     ```shell
     curl https://jsonplaceholder.typicode.com/posts/1
     ```

   - This command should return data from a free API endpoint, confirming that `curl` is installed and functioning correctly.

     If the command did not return data, there is liklely an issue with your curl installation. You can post to the **SUPPORT - WINDOWS** > [# curl](https://discord.com/channels/1278288408795549716/1278295767861297195) channel for help.

## Next Steps

Aftering completing the steps in this document, go to the [README - Cloning the Repository](https://github.com/mawentowski/api-documentation-course?tab=readme-ov-file#cloning-the-repository) section.
