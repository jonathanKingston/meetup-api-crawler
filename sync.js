"use strict";
const fs = require("fs");
const https = require("https");
const readline = require('readline');
let outputPath = "./";
if (process.argv.length > 2) {
  outputPath = process.argv[2] + "/";
}

const MEETUP_URL = "https://api.meetup.com";
const MEETUP_KEY = String(fs.readFileSync(`${outputPath}.auth_key`)).trim();
const MEETUP_GROUP = String(fs.readFileSync(`${outputPath}.meetup_group`)).trim();


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function padLeft(string, len) {
  string = String(string);
  while(string.length < len) {
    string = "0" + string;
  }
  return string;
}

function checkDir(path) {
  const pathDir = fs.existsSync(path);
  if (!pathDir) {
    fs.mkdirSync(path);
  }
  return path;
}

const EVENT_URL = `${MEETUP_URL}/${MEETUP_GROUP}/events?photo-host=secure&page=200&status=upcoming,past&key=${MEETUP_KEY}`;
checkDir(`${outputPath}events/`);
https.get(EVENT_URL, (res) => {
  let rawData = '';
  res.on('data', (chunk) => rawData += chunk);

  res.on('end', (d) => {
    const resJson = JSON.parse(rawData);
    resJson.forEach((event) => {
      // If the event isn't available to the public don't show
      if (event.visibility !== "public") {
        return;
      }
/* Commenting out for now as overcomplicates this
      const date = new Date(Number(event.time));
      const yearPath = checkDir(`./events/${date.getFullYear()}`);
      const month = date.getMonth() + 1;
      const monthPath = checkDir(`${yearPath}/${padLeft(month, 2)}`);
      const day = date.getDate();
      const dayPath = checkDir(`${monthPath}/${padLeft(day, 2)}`);
      const eventPath = checkDir(`${dayPath}/${event.id}`);
*/
      const eventPath = checkDir(`${outputPath}events/${event.id}`);
      // Write unique JSON file with pretty printing to reduce git diff noise
      fs.writeFileSync(`${eventPath}/details.json`, JSON.stringify(event, undefined, 2));
/*
      const profileFile = `${eventPath}/profile.json`;
      const profileFileExists = fs.existsSync(profileFile);
      if (!profileFileExists) {
        profileNeeded(event, profileFile);
      }
*/
    });
    process.exit();
  });
}).on("error", (e) => {
  console.log("e", e);
});

/*
function profileNeeded(event, profileFile) {
  console.log(`Speaker profile required for event: ${event.name}`);
  const profile = {
    name: "",
    github: "",
    twitter: "",
    website: "",
    description: ""
  };
  rl.question("Speakers name?", (name) => {
    profile.name = name;
    rl.question("Github profile?", (github) => {
      profile.github = github;
      rl.question("Website?", (website) => {
        profile.website = website;
        rl.question("Intro?", (intro) => {
          profile.description = intro;
          console.log(`Writing file to: ${profileFile}`);
          fs.writeFile(profileFile, JSON.stringify(profile, undefined, 2));
          rl.close();
        });
      });
    });
  });
}
*/
