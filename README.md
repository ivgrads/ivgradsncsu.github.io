# IVGrads@NCSU Website

## Events calendar
Upcoming events come from a public Google Calendar. Each one appears as a slide in the Events carousel, right after the Tuesday fellowship slide. Leaders add, edit, or delete events in Google Calendar, and the site updates on the next page load. There's no code change or redeploy.

What leaders see on the site:
- The next 4 upcoming events (change `maxEvents` in `app.js`).
- Each event's title, date and time, location, and the first ~220 characters of its description.
- A repeating event (for example, weekly) shows only its next occurrence.
- Until the calendar is set up, or if it can't load, the carousel shows the built-in slides only.
- If an event has an image attached, the slide shows that image instead of the color block. Attach it from Google Drive in the event's "Add attachment" option, then set that file's sharing to "Anyone with the link" (Viewer). If the image isn't shared publicly, the slide keeps the color block.
- The carousel advances every 4 seconds (`AUTOPLAY_MS` in `app.js`) and keeps going after the arrows, dots, or a swipe. It holds only while a keyboard user is tabbing inside it, and the pause button stops it. Visitors whose device is set to reduce motion start paused.

## Moments together (photo strip)
The scrolling photos live in `assets/gallery/`. To add one, save it as a JPG about 800px wide, put it in that folder, and add an `<li><img …></li>` line to the `#marquee-track` list in `index.html` with alt text describing the photo. Hovering over the strip pauses it, and so does the "Pause photos" button.

### One-time setup
1. Sign in to Google Calendar with the chapter account (ivgradsncsu@gmail.com).
2. Create a calendar: Settings → Add calendar → Create new calendar (e.g. "IVGrads Events").
3. In that calendar's settings, go to Access permissions for events and turn on "Make available to public" with "See all event details".
4. Under "Share with specific people or groups", add each leader with "Make changes to events". This is how leaders get access to add events.
5. Under "Integrate calendar", copy the Calendar ID (it looks like `...@group.calendar.google.com`).
6. Create an API key at https://console.cloud.google.com:
   - Create a project. Then go to APIs & Services → Library and enable "Google Calendar API".
   - Go to APIs & Services → Credentials → Create credentials → API key.
   - Edit the key. Under Application restrictions, choose "Websites" and add `https://ivgrads.github.io/*`. Under API restrictions, choose "Google Calendar API" only.
7. In `app.js`, fill in `GOOGLE_CALENDAR.id` and `GOOGLE_CALENDAR.apiKey`, then commit and push.

The API key is visible in the site's code. That's expected for this setup: the key only reads public calendars, and the restrictions in step 6 stop other sites from using it. Don't reuse this key for anything else.
