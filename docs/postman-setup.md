To import Postman collections and environment variables from the `postman` directory, follow these steps:

### 1. **Open Postman**

1. **Launch Postman:**
   Open the Postman application on your computer. If you don’t have Postman installed, you can download it from the [Postman website](https://www.postman.com/downloads/).

### 2. **Import Postman Collection**

1. **Go to the Import Menu:**

   - Click on the **Import** button located in the top-left corner of the Postman app or use the shortcut `Ctrl + O` (Windows/Linux) or `Cmd + O` (Mac).

2. **Select the File:**
<comment>
It might be worth noting that the user must create a Postman account and log into that account via the app
in order to unlock the ability to import collections through any means other than a cURL command ("Paste cURL to import...").
Might also be worth ensuring Windows users that it is OK to click Allow Access if they encounter this [dialog](../windows_defender_firewall_2.PNG).
</comment>
   - In the Import dialog, choose the **Upload Files** tab.
  <comment>
  My version of Postman on Windows reads "Drop anywhere to import Or select _files_ or _folders_."
  _files_ and _folders_ being clickable options.
  </comment>
   - Click on **Choose Files** and navigate to your `postman` directory.

1. **Choose the Collection File:**
   - Select the `postman-collection.json` file and click **Open**.
   - Postman will upload and import the collection. You will see a confirmation once the import is successful.

### 3. **Import Environment Variables**
<comment>
I do not see an "Add a New Environment" option in the Environments drop-down at the top-right.
I do see a Create Environment option in the Environments tab on the left, but that seems to create an environment
from scratch via the Postman UI rather than via a file import.
Take a look at this screen capture [image](../postman.PNG).

I was able to create a new environment by importing the file in the exact same manner I imported the file for the collection.
</comment>
1. **Open the Environments Menu:**

   - Click on the **Environments** dropdown in the top-right corner of the Postman app or go to the **Manage Environments** option by clicking on the gear icon.

2. **Add a New Environment:**

   - In the Environments dialog, click on **Import**.
   - In the Import dialog, choose the **Upload Files** tab.

3. **Select the Environment Variables File:**

   - Click **Choose Files** and navigate to your `postman` directory.

4. **Choose the Environment Variables File:**
   - Select the `environment-variables.json` file and click **Open**.
   - Postman will upload and import the environment variables. You will see a confirmation once the import is successful.

### 4. **Select the Imported Environment**

1. **Choose the Environment:**
   - In the top-right corner of the Postman app, select the imported environment from the **Environments** dropdown. This ensures that the requests in your collection use the correct environment variables.

### Summary

1. **Import the Postman Collection:**

   - Go to **Import** > **Upload Files** > Select `postman-collection.json`.

2. **Import the Environment Variables:**

   - Go to **Manage Environments** > **Import** > **Upload Files** > Select `environment-variables.json`.

3. **Select the Imported Environment:**
   - Choose the environment from the top-right dropdown menu.

By following these steps, you’ll have successfully imported both the Postman collection and environment variables into your Postman workspace.
