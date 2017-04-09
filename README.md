# Meetup parser

This updates the site by parsing data from Meetup, building dirs of all the events and asking for profile data.

# Setup

`.auth_key` is a file with just the key found at: https://secure.meetup.com/meetup_api/key/

`.meetup_group` is a file with just the group name you want. EG: "NottsJS"

# Sync
```
node sync.js
```

This will create a series of event dirs in `events/` which you can then populate with other *.json files in that directory.

Eg:
`events/23232323/other.json`


# Build
```
node build.js
```

The build script crawls all the events and merges aditional files for events into a _meta key. The output is one huge json file.
