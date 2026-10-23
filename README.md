# Khushi's Birthday Surprise 🎀

A little scrapbook-style birthday website. Plain HTML, CSS and JavaScript. No build step, no packages, no accounts.

## Run it
Double-click `index.html`, or from this folder run:

```
python3 -m http.server 8000
```
then open http://localhost:8000

## Replace or add photos
1. Put your photo in the `images/` folder.
2. In `index.html`, copy one `<figure class="polaroid"> ... </figure>` block inside `<div class="gallery">`, then change the `src`, `alt` and the caption text inside `<figcaption>`.
3. Change `--tilt:` (for example `-3deg` or `2deg`) to set how much the photo leans.

The "Little Moments, Big Memories" collage works the same way (`<div class="wall">`).
Photos are shown at full size and are never cropped.

## Edit the words
- **Letter:** the paragraphs inside `<div class="letter-text">` in `index.html`.
- **Timeline:** each `<li>` inside `<ol class="timeline">`. Swap in real memories whenever you like.
- **Quote cards:** the `<blockquote>` lines in the "Little Reminders" section.
- **Birthday wishes:** the `WISHES` list at the top of `script.js`.

## Music
Music never plays on its own. She taps the **Play music** button (top right). By default it plays a soft built-in music-box melody. To use your own song, add it as `audio/music.mp3` and set `const MUSIC_FILE = "audio/music.mp3";` at the top of `script.js`.

## Deploy (free)
- **Netlify:** go to app.netlify.com/drop and drag this whole folder onto the page.
- **Vercel:** install the CLI (`npm i -g vercel`) and run `vercel` inside this folder, or import the folder as a project with the framework set to "Other" and no build command.

Keep the folder structure as it is (`index.html`, `style.css`, `script.js`, `images/`) so every photo path keeps working.
