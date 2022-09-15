## What is Swesence?

Swesence is a (web) application that you can run on your device, and it allows you to display your Nintendo Switch game on Discord using Rich Presence.

Built using Electron.js, Vue 3, and Element-Plus

## Installation

### Standalone

You can check out the [Releases](https://github.com/glitchcodes/Swesence/releases) and select your platform and architecture.
This is not recommended as your platform (especially macOS) may block the application from running.

### Manual

This is the recommended way but requires extra work.

**Requirements**
* Node.js (Tested with Node.js 16)
* NPM (Included in Node.js)
* Git

**Installation**
1. Clone this repository `git clone https://github.com/glitchcodes/Swesence.git`. (First time installation only)
2. Navigate into the folder `cd Swesence`
3. Install Dependencies `npm install`
4. Run the application `npm start`

**How to run the application again?**

Similar to the installation section but no need to install dependencies again

1. Make sure you're on the folder `cd Swesence`
2. Run the application `npm start`

## FAQ

### Where is xxx on the game list?
By default, the application comes with a list that I play often. There are two ways to add games on the list:

1. Open an issue and explain the game you want to be added.
2. Create your own Discord Application and edit the database file to your liking. (Recommended)

### The selected game doesn't have an icon!
If you've added a game into the database file yourself, the default Discord Application ID doesn't have an icon asset for that. You will need to create your own Discord Application and upload your icon assets there.

### "Update presence" is not working
Make sure the Discord Application ID is correct on the Settings. If unsure, you can try resetting the settings and restarting the application. Open an issue if the problem persists.

### How to remove my presence?
Simply close the application.


***Disclaimer: This project has no affiliation to Nintendo nor Discord***