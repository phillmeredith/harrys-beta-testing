# Publishing a new add-on version to Harry's app

The app reads `releases.json` from this site. The newest release must come first.

1. Copy the build to `releases/HarrysEquestrian_v<version>.mcaddon`. Keep only the last 3 builds in the folder.
   Also copy the same file to `archive/HarrysEquestrian_v<version>.mcaddon` and never delete anything in `archive/` (Phill, 2026-11-18: Harry likes knowing every version is saved). Git stores the two identical copies once.
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
- Never delete old entries: the app's "Previous versions" page lists every entry in releases.json with its date, notes_for_harry and fixed codes, newest first. Each entry needs a `date` (YYYY-MM-DD).
- When you remove an old build from `releases/`, change that entry's `file` to its `archive/` path, so Harry can still download it. Only use null when no build exists at all (3.0.15 was a world template, with no .mcaddon).
- `archive/` holds every build (about 600 MB). To keep clones quick, clone without it: `git clone --depth 1 --filter=blob:none --no-checkout <repo> dir && cd dir && git sparse-checkout set --no-cone '/*' '!/archive/' && git checkout main`, then add a new build with `git add --sparse archive/<file>`. GitHub Pages serves up to 1 GB, so there is room for about 40 more builds; after that, ask Phill before adding more.

3. Commit to `main`, then run `git push origin main` and `git push origin main:gh-pages`. Pages serves the `gh-pages` branch.

The app shows a gold "New version X is ready!" button on the title screen. It opens Harry's notes and a Download button. On the iPad, Safari downloads the file; Harry taps it and picks Minecraft.

## Follow-ups ("Not quite right?")

When a request is marked fixed (its code is in a release's `fixed`), Harry can send one follow-up per request per release from Previous requests. He can also send one per version from the version panel.

- The email subject contains `Follow-up on <version>:` and the body starts with `FOLLOW-UP`. It reuses the original code (version-level ones use `HBT-Vnnn`).
- Follow-ups do not use Harry's one-a-day report. Handle them before new reports.
- Once a follow-up is sent, the app shows "Daddy's looking again" until a newer release lists the code in `fixed` again (or in `status`).


## Harry's tracker emails (from 2026-11-18)
Harry can open any sent report to see where it's up to. Two new kinds of email come from it, and neither uses his daily report:
- `[Harry's Beta Testing] CONFIRMED · report HBT-xxxx · release X`: Harry checked the fix and says it works. There's nothing to build. Label it Done.
- `[Harry's Beta Testing] MORE INFO · report HBT-xxxx`: Harry added detail to a report that isn't fixed yet. Read it together with the original email for that code before building it.

## Update names (from 2026-11-18)
The app groups versions into named updates by their first two numbers (4.0.x is "Foals and Flying"). New features bump the middle number (4.1.0) and fixes bump the last one (4.1.1). When you start a new x.y, add its name under `"update_names": {"4.1": "Name"}` at the top level of releases.json. The built-in names are in src/releases.js (UPDATE_NAMES).
