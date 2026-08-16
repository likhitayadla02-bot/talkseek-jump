# Talk Navigator

Build TalkFind — a web app that makes recorded talks (workshops, lectures, 

panels) searchable. Users upload a video, the app transcribes the speech 

into text with timestamps, and users can search any word or phrase to 

instantly find the moment it was spoken and jump straight to that point 

in the video.

Core flow: Upload Video → Transcribe to Text → Search → Click Result → 

Video Jumps to That Timestamp

Key screens:

1. Upload page — upload a video with a title

2. Library page — list of all uploaded talks

3. Search bar — search across all transcripts

4. Search results — show timestamp, session title, and matching text snippet

5. Video player — plays from the exact timestamp when a result is clicked

Use a clean, professional design with a navy and amber color scheme. 

Seed it with 2 sample talks and fake transcript data so the search and 

jump-to-timestamp flow works immediately as a demo, even before real 

transcription is connected.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://talkseek-jump.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b10f85cc-11c0-46f0-96bf-91225613c496).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
