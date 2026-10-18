# EngiQuest verification and limitations

Redesign review: October 18, 2026 (America/Chicago). Original delivery review: October 9, 2026.

## October 18 redesign verification

- Implemented a three-choice opening screen: interest quiz, direct discipline selection, and immediate Quest DStudios. The logo returns to it. Startup still hydrates existing progress before any saved-state write.
- Added seven visual identities (All Disciplines and six fields), original code-based engineering illustrations, dark/light palettes, field-specific dashboards, featured labs, guided CAD mission links, and searchable activity cards with actual model previews. Shell, profile, careers, Journey and CAD controls follow the active identity. The Three.js background/grid update in place when the theme changes.
- **75 automated tests passed**, including the original model/persistence/AI/launcher suite and 24 theme tests covering field/quest links, safe fallback keys, and text/button contrast. These palette tests do not constitute a full accessibility audit.
- TypeScript and a production build passed on Windows with the locked dependencies.
- Actual browser checks: all six themed dashboards each showed five labs; Green Tech projects showed its three projects; search and empty-state recovery worked. All three welcome paths and logo navigation worked. Completed all 20 quiz questions and followed a result into Civil; six interest percentages and weighted points appeared. Refresh preserved completed quiz answers and field preference.
- On the mobile layout, tested the Airfoil lab failure and 100/100 success, an existing project checklist through refresh, Biomedical career filtering, Journey's single entries for repeated lab/CAD completions, and the explicit non-AI mentor disclosure. The measured content width was 375 CSS pixels with no horizontal overflow on the inspected lab/career views.
- In the actual browser, dimensioned a plate and cylinder, performed real mesh subtraction, passed the mechanical CAD geometry check, and exercised undo/redo. The light CAD canvas and controls updated with the selected discipline. Existing saved model data remained available.
- Desktop screenshots were captured at the 1440 × 1000 preview setting; mobile screenshots and the six discipline images are in the delivery's `redesign-verification` folder.

No live AI-provider call was made. Local browser checks are distinct from public hosting/domain verification. GitHub source and Vercel publishing instructions are in `PUBLISHING-GITHUB.md`.

## What is implemented

- Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, Lucide icons, React Context persistence, and Three.js CAD. The supplied logo is included.
- All six engineering fields and All Disciplines, a 20-question interest quiz, profile settings, dark/light themes, responsive layouts, and keyboard-operable controls.
- 30 distinct educational lab models, each with three checked levels, units, objectives, guidance, assumptions, feedback and saved best scores.
- 18 project guides with materials, build steps, safety notices, distinct preparation experiments, checklists, and optional local photos.
- CAD primitives, fixed-profile extrusions, camera controls, selection and numeric properties, grouping, alignment, actual mesh subtraction, undo/redo, autosave/snapshot, JSON import/export, STL export, and six geometry-checked guided quests with ghost outlines.
- Six sourced career guides; separate lab/CAD/project/quiz Journey progress, badges, completion history and JSON archive export.
- Authored EngiBot guides and an optional server-side OpenAI integration with explicit consent, contact-detail filtering, bounded requests and safe error handling.

## Checks actually performed

**Windows environment:** Windows 11 Home, build 26200, PowerShell; Node 24.19.0 and npm 12.2.0. The standard npm command was not initially available, so this computer's prepared working folder includes a local npm helper. That helper is excluded from the shareable ZIP. Installing standard Node 24 LTS supplies npm on another computer.

**Fresh installation:** Created `C:\Users\anita\Developer\engiquest` only after confirming that it did not exist. Its actual CMD launcher installed the locked packages and served HTTP 200 at `127.0.0.1:3000`. A later launch reused dependencies. With port 3000 occupied, a second real launcher explained the conflict, selected port 3001, and served HTTP 200 without stopping the first server. The launcher does not run tests at startup. npm reported zero known vulnerabilities at installation; this is a point-in-time registry result, not a security guarantee.

**Automated checks:** 51 tests passed with no failures or skipped tests. This includes 90 reachable lab-level solutions, 150 lab boundary/default evaluations and physical trend/truth-table checks; 2,540 project preparation combinations; state hydration/parsing and duplicate/best-score behavior; real CAD subtraction, invalid imports, geometric quest failure cases and STL geometry; mocked AI consent/authentication/redaction/timeout/body-limit/error behavior; and 11 launcher checks. Windows CMD fixtures verified paths containing spaces, ampersands, parentheses and exclamation marks, plus a visible nonzero exit. Those path fixtures used a small test child; the real application was separately started from the prepared folder.

**TypeScript and production:** The final source passed `tsc --noEmit` and `next build`. The generated site has the main page and a server-side `/api/engibot` route. The test harness and CSG dependency print deprecation warnings; these did not fail checks.

**Actual browser checks on October 5–6:** Desktop at 1440×1000 and mobile viewport at 390×844 in the Codex in-app browser on Windows. A starter page was opened before the larger features were added. Verified:

- All six field selections show five labs, three projects, one matching CAD quest and one career guide; All Disciplines restores the catalogues.
- Completed all 20 quiz questions and checked all six transparent interest percentages.
- Ran a failing and passing airfoil solution, repeated completion, and refreshed Journey without duplicate records. All 30 lab views were exercised; model-level tests cover all 90 solutions.
- Completed a preparation experiment and checklist, refreshed saved checks, and tested a local photo using the supplied logo as a fixture. No physical project was represented as actually built.
- Changed nickname and light theme, refreshed, and confirmed persistence; dismissed the profile drawer with Escape.
- Created a plate and cylinder, subtracted a real through-bore, passed the geometry quest, used undo/redo, saved/loaded a snapshot, added remaining shape types, grouped/ungrouped/aligned, used camera controls, and restored four objects after refresh.
- Rejected invalid CAD JSON without replacing the current model; imported valid JSON. Verified generated JSON, STL and Journey downloads on disk. The browser automation's download notification timed out, but the actual files were created and inspected.
- Checked mobile home, lab and CAD widths without horizontal page overflow; inspected dark and light layouts. Written-guide disclosure and project safety guidance were checked. No browser error logs were present in the final October 6 check.

On October 9, the browser tool rejected access to the existing local tab under its URL policy. It was not bypassed. Today's final checks are command-line checks. The small final addition that connects the selected CAD quest to EngiBot passed TypeScript/build checks but has **not** been rechecked interactively in the browser. Earlier browser results remain valid for the features listed above. Screenshots accompany the delivery outside the source ZIP.

## Remaining limitations and unverified items

- Live AI is **not verified**: no API credentials were supplied. Written-guide mode works without them. To enable real AI, follow README section 8 and supply your own server-side API key, supported model and production access code. No paid provider request was made during testing.
- No Vercel deployment or hosting account was used. README section 9 provides the publishing steps and required checks on the eventual hosted address.
- No Windows 10 machine, physical phone, Safari, full screen-reader audit, or OS reduced-motion setting was tested. Reduced-motion support is implemented in CSS and Framer Motion; mobile results are viewport tests on Windows.
- CAD uses bounded triangle meshes. There are no fillets, chamfers, arbitrary sketches, sketch constraints, Boolean unions or commercial CAD feature trees. Extrusions use L/hexagon profiles. STL may contain separate overlapping shells; inspect it before printing. Geometry checks are classroom targets, not structural or manufacturing validation.
- Simulations are disclosed educational approximations. They are not clinical, structural, flight or electrical design tools.
- Progress is local to one browser profile and exact website address, with no accounts or cloud sync. Journey export is an archive, with no progress-import interface; CAD JSON can be imported. Large photos or browser storage restrictions can prevent saving and produce a warning.
- Contact filtering is best effort. AI uses a shared classroom code and per-process rate limits, not individual accounts or distributed abuse controls. Public institutional AI use needs the additional operator work described in the README.

## Quick final check for the site owner

Open the prepared folder in File Explorer, double-click **Launch EngiQuest.cmd**, keep its window open, and open the printed address. In Quest DStudios select a field and open EngiBot: its guide should name that field's selected quest. This completes the one browser check blocked during the final review. Use the README for setup, logs, troubleshooting and Vercel publishing.

