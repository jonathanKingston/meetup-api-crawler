"use strict";
const fs = require("fs");

let outputPath = "./";
if (process.argv.length > 2) {
  outputPath = process.argv[2] + "/";
}

const eventsPath = `${outputPath}/events/`;
const eventFiles = fs.readdirSync(eventsPath);
const events = {};
const upcoming = [];
let nextEvent = null;
eventFiles.forEach((eventId) => {
  const event = JSON.parse(fs.readFileSync(`${eventsPath}${eventId}/details.json`));
  event._meta = {};
  const eventFiles = fs.readdirSync(`${eventsPath}${eventId}`);
  eventFiles.forEach((fileName) => {
    const file = fileName.replace(/[.]json$/, "");
    if (file == "details") {
      return;
    }
    if (file !== fileName) {
      const data = fs.readFileSync(`${eventsPath}${eventId}/${file}.json`);
      event._meta[file] = JSON.parse(data);
    }
  });
  events[event.id] = event;
  if (event.status === "upcoming") {
    upcoming.push(event.id);
  }
});

upcoming.sort((a, b) => {
  const eventA = events[a].time;
  const eventB = events[b].time;
  if (eventA < eventB) {
    return -1;
  }
  if (eventA > eventB) {
    return 1;
  }
  return 0;
});

if (upcoming.length > 0) {
  nextEvent = upcoming[0];
}

fs.writeFileSync(`${outputPath}/events.json`, JSON.stringify({
  nextEvent,
  upcoming,
  events
}, null, 2))
