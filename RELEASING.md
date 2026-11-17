# Publishing a new add-on version to Harry's app

The app reads `releases.json` from this site. The newest release must come first.

1. Copy the build to `releases/HarrysEquestrian_v<version>.mcaddon`. Keep only the last 3 builds in the folder.
2. Add an entry to the top of `releases.json`:

```json
{
  "latest": "4.0.7",
  "releases": [
    {
      "version": "4.0.7",
      "date": "2026-11-18",
      "file": "releases/HarrysEquestrian_v4.0.7.mcaddon",
      "notes_for_harry": ["Short, happy lines Harry can read, no ids", "One line per change"],
      "fixed": ["HBT-1234"],
      "status": { "HBT-5678": "Daddy's working on it" }
    }
  ]
}
```

- `fixed` lists the report codes from Harry's emails that this release fixes. His "My reports" list then shows "Fixed in 4.0.7".
- `status` (optional) shows a short note on reports that aren't fixed yet.
- Older entries can keep their `fixed` lists. Their `file` can point to a build that has since been removed.

3. Commit to `main`, then run `git push origin main` and `git push origin main:gh-pages`. Pages serves the `gh-pages` branch.

The app shows a gold "New version X is ready!" button on the title screen. It opens Harry's notes and a Download button. On the iPad, Safari downloads the file; Harry taps it and picks Minecraft.
