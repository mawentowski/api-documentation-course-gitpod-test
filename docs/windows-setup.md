# Windows Setup Instructions

This guide walks you through setting up Git Bash on Windows, configuring it as the default terminal, setting up SSH for GitHub, installing `curl`, and setting up Node.js and npm.

## Table of Contents

- [Windows Setup Instructions](#windows-setup-instructions)
  - [Table of Contents](#table-of-contents)
  - [1. **Install Git and Git Bash**](#1-install-git-and-git-bash)
  - [2. **Confirm the Path to Git Bash Executable**](#2-confirm-the-path-to-git-bash-executable)
  - [2. **Setting Git Bash as the Default Terminal in Windows Terminal**](#2-setting-git-bash-as-the-default-terminal-in-windows-terminal)
  - [3. **Setting Git Bash as the Default Terminal for VS Code**](#3-setting-git-bash-as-the-default-terminal-for-vs-code)
  - [5. Generate a SSH Key](#5-generate-a-ssh-key)
  - [4. **Adding SSH Agent to Your `.bash_profile`**](#4-adding-ssh-agent-to-your-bash_profile)
  - [4. **Copy the SSH Public Key to Clipboard:**](#4-copy-the-ssh-public-key-to-clipboard)
  - [5. **Add SSH Key to Your GitHub Account**](#5-add-ssh-key-to-your-github-account)
  - [6. **Install Node.js and npm**](#6-install-nodejs-and-npm)
  - [7. **Install `curl`**](#7-install-curl)

## 1. **Install Git and Git Bash**

1. **Download Git for Windows:**

   - Visit the [Git for Windows website](https://gitforwindows.org/) and download the installer.

2. **Run the Installer:**

   - Open the downloaded file to start the installation process.

3. **Follow the Installation Wizard:**

   - Click "Next" to proceed with the default options.
   - Choose the default installation location or select a different one if needed.
   - Select “Git Bash Here” and any other options you prefer.
   - Ensure that the option to "Use Git from the Windows Command Prompt" is selected.

4. **Complete the Installation:**

   - Click “Install” and then “Finish” once the installation is complete.

5. **Confirm Git and GitBash Installation:**

   - Search for Git Bash from the start menu to confirm it is properly downloaded
   - Open Git Bash and run:

   ```bash
   git --version
   ```

   - If Git is installed, this command will output the version number. If not, you'll see an error message indicating Git is not installed.
   - Exit the Git Bash terminal

## 2. **Confirm the Path to Git Bash Executable**

1. **Find the Git Bash Executable Path:**

   - Open "Windows Terminal" (search for it from the Start menu) and run the following command to locate the path to the `bash` executable:
     ```bash
     where bash
     ```

2. **Copy the Path:**

   - The output will typically show a path similar to:
     ```plaintext
     C:\Program Files\Git\bin\bash.exe
     ```
   - Copy this path, as you'll need it for the next step in configuring your terminal settings.

## 2. **Setting Git Bash as the Default Terminal in Windows Terminal**

1. **Open Windows Terminal:**

   - Open "Windows Terminal" (if it's not already open) in the Start menu and open it.

2. **Open Windows Terminal Settings:**

   - Click on the dropdown arrow next to the tabs or press `Ctrl + ,` to open the settings.

3. **Add a New Profile for Git Bash:**

   - In the Settings tab, click on "Profiles" in the left sidebar, then click "Add a new profile" or use the "Add new" button.
   - Choose "Command Line" from the options, which allows you to specify the path to the executable.

4. **Configure the Git Bash Profile:**

   - Set the "Name" to something recognizable like "Git Bash".
   - In the "Command line" field, enter the path to the `bash.exe` executable retrieved earlier.

5. **Set Git Bash as Default Profile:**

   - Go back to the "Startup" section on the left sidebar.
   - Set "Default profile" to the Git Bash profile you just created.

6. **Save Changes:**
   - Click "Save" or close the settings tab.

**Verify Git Bash as Default Terminal:**

- Open Windows Terminal. It should start with Git Bash as the default profile.

## 3. **Setting Git Bash as the Default Terminal for VS Code**

Prerequisites: You have copied the path to the `bash` executable to your clipboard (this was explained in a previous step).

1. **Open Settings in VS Code:**

   - Open VS Code and press `Ctrl + ,` to open the settings or go to `File > Preferences > Settings`.

2. **Search for Terminal Settings:**

   - Type "terminal" into the search bar to filter the relevant settings.

3. **Set Git Bash as Default Terminal:**

   - Locate "Terminal > Integrated > Shell: Windows".
   - Click "Edit in settings.json" to open the JSON configuration file.

4. **Add Git Bash Path:**

   - Add or update the configuration to set Git Bash as the default terminal. Insert the following JSON snippet, replacing the placeholder path with the actual path to the bash.exe executable that you copied earlier:

     ```json
     "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe"
     ```

5. **Save and Close:**

   - Save the `settings.json` file and close it.

6. **Verify Configuration:**

- Open a new terminal window in VS Code by clicking **Terminal** (from the top menu items) and select **New Terminal**.
- To confirm that you are using Git Bash, run:
  ```bash
  echo $SHELL
  ```
- The output should show a path similar to `/usr/bin/bash` if Git Bash is set up correctly. If you receive an error, it's likely there was an issue configuring Git Bash on Windows / VS Code.

## 5. Generate a SSH Key

Run the following command, replacing `your_email@example.com` with your GitHub email address:

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

Press `Enter` to accept the default file location. You can set a passphrase for added security if desired.

## 4. **Adding SSH Agent to Your `.bash_profile`**

1. **Open Your `.bash_profile`:**

   - Open Git Bash and use:
     ```bash
     nano ~/.bash_profile
     ```

2. **Add SSH Agent Lines:**

   - Add the following lines to the bottom of your `.bash_profile` file:
     ```bash
     # Start the SSH agent
     eval "$(ssh-agent -s)"
     # Add your SSH private key to the agent
     ssh-add ~/.ssh/id_rsa
     ```
   - To exit `nano`, press `Ctrl + O` to save and `Ctrl + X` to exit.

3. **Source the `.bash_profile`:**

   - Apply the changes by running:
     ```bash
     source ~/.bash_profile
     ```

4. **Verify the SSH Agent:**
   - Open a Git Bash terminal (if one is not already open) and check if the SSH agent is running by executing:
     ```bash
     ssh-add -l
     ```
   - This command should list your added SSH keys if everything is set up correctly.

## 4. **Copy the SSH Public Key to Clipboard:**

To display the contents of your public SSH key, run the following command:

```shell
cat ~/.ssh/id_rsa.pub
```

If the terminal outputs a long string beginning with `ssh-rsa`, the command was successful.

Copy this long string, as you'll need it for the next step.

## 5. **Add SSH Key to Your GitHub Account**

1. **Log In to GitHub:**

   - Go to [GitHub](https://github.com) and log in.

2. **Navigate to SSH Keys:**

   - Go to **Settings** > **SSH and GPG keys** > **New SSH key**.

3. **Add Your SSH Key:**
   - Paste your public SSH key (the contents of `id_rsa.pub`) into the key field and give it a descriptive title.
   - Click **Add SSH key** to save it.

## 6. **Install Node.js and npm**

1. **Download Node.js Installer:**

   - Visit the [Node.js website](https://nodejs.org/) and download the Windows Installer (LTS or Current version).

2. **Run the Installer:**

   - Open the downloaded file to start the installation process.

3. **Follow the Installation Wizard:**

   - Click "Next" to proceed with the default options.
   - Choose the default installation location or select a different one if needed.
   - Ensure that the option to install npm (Node Package Manager) is selected.
   - Click “Install” and then “Finish” once the installation is complete.

4. **Verify Installation:**
   - Open a new terminal in VS Code by selecting `Terminal` > `New Terminal` from the menu or using the shortcut `` Ctrl + ` `` (backtick).
   - Check Node.js version:
     ```bash
     node --version
     ```
   - Check npm version:
     ```bash
     npm --version
     ```
   - Both commands should output their respective versions, confirming that Node.js and npm are properly installed.

## 7. **Install `curl`**

1. **Download `curl`:**

   - Visit the [curl website](https://curl.se/windows/) and download the appropriate `curl` package for Windows.

2. **Extract and Install `curl`:**

   - Extract the downloaded ZIP file to a location of your choice.
   - Add the path of the extracted `curl` executable (e.g., `C:\path\to\curl\bin`) to your system's `PATH` environment variable:

     - Open the Start menu, search for "Environment Variables," and select "Edit the system environment variables."
     - Click the "Environment Variables" button.
     - In the "System variables" section, find the `Path` variable and

   - Click "Edit."
     - Click "New" and add the path to the `curl` executable.
     - Click "OK" to close all dialogs.

**Test `curl` Installation:**

- Open Git Bash and run a simple `curl` command to verify it’s working:
  ```bash
  curl https://jsonplaceholder.typicode.com/posts/1
  ```
- This command should return data from a free API endpoint, confirming that `curl` is installed and functioning correctly.
