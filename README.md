### A place for the few aops scripts I am willing to share with the public

First of all, you cannot easily run any of these scripts without a keyboard and mouse. If you really need a way you will need to look into how to run javascript code on the device you are on.

To run any of these scripts go to any artofproblemsolving.com page and run the following in the browser console:

`fetch('https://cdn.statically.io/gh/Mango-247/aops-scripts/main/file-name.js').then(r=>r.text()).then(eval)`

Replacing file-name with the name of the file. For example here is what you would run to use the counting bot:

`fetch('https://cdn.statically.io/gh/Mango-247/aops-scripts/main/counting-bot.js').then(r=>r.text()).then(eval)`

What this does is it fetches the code from statically (a javascript deliverer cdn), converts the response to text, and runs it. If you want to make sure the code being run is not mallicious you can go to the link in the fetch command and look over the code yourself. For example in the fetch for the counting bot above you would go to https://cdn.statically.io/gh/Mango-247/aops-scripts/main/counting-bot.js.

Here are the hotkeys to open the browser console for most devices and browsers:

### 1. Google Chrome
- **Windows/Linux**: `Ctrl + Shift + I` or `F12`
- **macOS**: `Cmd + Option + I`

### 2. Mozilla Firefox
- **Windows/Linux**: `Ctrl + Shift + I` or `F12`
- **macOS**: `Cmd + Option + I`

### 3. Microsoft Edge
- **Windows/Linux**: `Ctrl + Shift + I` or `F12`
- **macOS**: `Cmd + Option + I`

### 4. Safari (mac only)
- **macOS**: `Cmd + Option + I`
  - Safari's developer tools may need to be enabled first. Go to Safari > Preferences > Advanced, and check "Show Develop menu in menu bar."

### 5. Opera
- **Windows/Linux**: `Ctrl + Shift + I` or `F12`
- **macOS**: `Cmd + Option + I`

You can also right click > inspect > console to access the console on most browsers.

