# EngiQuest

EngiQuest is an editable engineering and STEM learning website for grades 6–12. It runs locally on Windows and includes 30 simulated labs, 18 guided at-home projects, a Three.js CAD studio, an interest quiz, career exploration and a saved learning journey. The supplied EngiQuest logo is included.

**Start with the local website.** You do not need a hosting account, a GitHub account or an AI API key to use its learning activities. EngiBot starts in clearly labeled written-guide mode when AI is not configured.

The intended working folder is:

```text
C:\Users\anita\Developer\engiquest
```

## October 2026 design update

Every visit opens three choices: Discover Your Path (20-question interest quiz), Choose Your Track, or immediate Quest DStudios. The top-left EngiQuest logo returns to these choices. Opening this screen does not reset your saved progress.

Each engineering field has its own illustrated environment, palette in dark and light mode, featured lab, CAD mission, and filtered activities. The theme carries into careers, Journey, the profile/mentor drawers, and the CAD controls and grid. Lab cards preview their actual simulation. Use the search box to find an activity within the active field.

For publishing the private GitHub source as a live Next.js website at **engiquest.org**, follow [PUBLISHING-GITHUB.md](PUBLISHING-GITHUB.md). GitHub stores the source; Vercel runs the server. GitHub Pages cannot run this complete app's API.

Keep the working project outside OneDrive, Dropbox and other synced folders. If you already have a different project at that path, choose a fresh folder such as `C:\Users\anita\Developer\engiquest-new`; do not merge or replace an existing project. Commands below use the intended folder; change the quoted path if you chose another one.

**On this computer:** the working folder is already prepared, and the launcher can use the verified local Node/npm helper. You can start with section 2. For a portable setup and the PowerShell publishing commands, install the standard Node LTS package below.

## 1. Install Node.js once

Node.js runs the website on your computer. npm, which comes with the usual Node installer, downloads the project's required packages.

1. Open the [official Node.js download page](https://nodejs.org/en/download).
2. Choose **Node.js 24 LTS**, Windows, and the Windows Installer (`.msi`) for your computer. Most Windows PCs use x64; use ARM64 only if your PC is an ARM device.
3. Run the installer. Keep **npm package manager** and **Add to PATH** selected. You do not need WSL, Bash or a separate Unix environment.
4. After installation, open a **new** Windows PowerShell window from Start. Run these two commands, one at a time:

```powershell
node --version
npm.cmd --version
```

Both commands should print a version. Node should start with `v24.`. An existing supported Node 22 LTS installation must be at least 22.13.0; Node 24 LTS is the recommended version for this project. The locked packages were developed and checked with Node 24.19.0. Use the supplied `package-lock.json` rather than replacing packages with unrelated latest versions.

If a command is not recognized, finish installing Node 24 LTS and then open a new PowerShell window. Use `npm.cmd`, as shown here, to avoid PowerShell trying to run the `npm.ps1` script.

## 2. Open the local website

1. In File Explorer, open `C:\Users\anita\Developer\engiquest`. You can paste `%USERPROFILE%\Developer\engiquest` into its address bar.
2. If you received a ZIP, first right-click it and choose **Extract All** into a fresh folder. Open the extracted folder containing `package.json` and `Launch EngiQuest.cmd`. Do not run the launcher from inside the ZIP viewer.
3. Double-click **Launch EngiQuest.cmd**.
4. On first use, the launcher installs the exact locked dependencies. That step needs internet access. It checks the dependency files on later launches and reinstalls only when necessary.
5. Find **ENGIQUEST BROWSER ADDRESS** in the launcher window. Normally it is `http://127.0.0.1:3000`. The launcher opens the default browser after the website responds; you can also paste that exact address into your browser.
6. Keep the launcher window open while using the website. To stop, return to that window and press **Ctrl+C**. If Windows asks whether to terminate the batch job, answer **Y**.

The launcher changes into its own folder, so paths containing spaces are supported. It starts the development website and does **not** run the test suite on every launch. Errors remain visible. Running the local site does not publish it to the internet; it listens on your computer's loopback address.

**If port 3000 is occupied:** the launcher explains the conflict and checks the next nine ports. It does not stop another program. Always use the address it prints. If all ten are occupied, close another EngiQuest launcher that you recognize, or choose another starting port in PowerShell:

```powershell
Set-Location "$env:USERPROFILE\Developer\engiquest"
$env:ENGIQUEST_PORT = '3010'
& '.\Launch EngiQuest.cmd'
```

That setting lasts for the current PowerShell session. The port is part of the browser's storage address: progress at `127.0.0.1:3000` is separate from progress at `127.0.0.1:3010`. `localhost:3000` is also a different address from `127.0.0.1:3000`. Reuse the same browser and address to see the same progress.

## 3. Find your way around

- **Labs:** choose a field or All Disciplines, open a lab, read its objective and assumptions, adjust its controls, and check the solution. Each lab has Fundamentals, Optimization and Advanced Challenge levels. At-home builds include their own preparation experiment, materials, steps, safety guidance and checklist.
- **Quest DStudios:** start modeling immediately, or choose a guided quest. The field menu also filters the available quests.
- **EngiScope:** explore careers, courses, majors and official opportunity links for the active field. Salary cards use dated United States occupational wage statistics; percentile labels are not promises of entry-, mid- or senior-career pay.
- **My Journey:** see separate lab, CAD, project and quiz progress, badges, completion history and best scores. Repeating a completed activity improves the best score without creating duplicate completions.
- **Profile:** change your nickname, theme and active field, or retake the interest quiz. The 20-question quiz shows interest matches for all six fields. It does not predict aptitude or restrict which activities you can choose.
- **EngiBot:** read the selected activity's written guidance. Optional AI has a separate disclosure and consent step.

Tab moves between controls. Enter or Space activates focused buttons. The interface honors your operating system/browser preference to reduce motion. You can use the CAD object list, view buttons and numeric inspector without relying only on mouse gestures.

At-home activities are small classroom models, with adult help where stated. Never drink experimentally filtered water, connect homemade electronics to your body, use mains power in a homemade circuit, or replace the catapult's soft projectile with a hard object. The biomedical activities are not medical tests or devices.

## 4. Save your progress and models

Learning progress, quiz answers, theme, nickname, project checklists and optional build photos are stored in this browser's **local storage**. CAD autosaves and snapshots use separate records in the same browser. Startup waits for saved state to load before accepting changes.

There are no student accounts, server database or cloud synchronization. Data does not automatically move between computers, browsers, ports, local and published sites, preview URLs or custom domains. Private browsing, browser resets or clearing site data can remove it. Other people using the same browser profile can access its local data.

Use **My Journey → Export progress** to download a JSON archive. This version does **not** import progress archives; keep the export as a readable record, not as a promise of one-click restoration. It may include your nickname and locally stored project photos, so inspect it before sharing. Progress export does not include the separate CAD workspace.

Inside **Quest DStudios**:

- **Save snapshot** saves an additional model snapshot in this browser. **Load snapshot** restores it.
- **Export JSON** creates a portable, editable CAD backup. **Import JSON** loads an EngiQuest CAD JSON file after validation. Save or export the current model before importing another one.
- **Export STL** exports geometry for inspection in another 3D tool. STL does not retain EngiQuest object names, grouping or colors, and is not the editable backup format.

If you see a storage warning, export any accessible progress and CAD JSON promptly. If existing saved data cannot be read, avoid clearing storage or making further changes until the original record has been inspected. Exporting newly displayed default progress cannot recover an unreadable old record.

## 5. Use the CAD studio

Add a cube, cylinder, sphere, roof or extrusion. Select it in the canvas or the object list, then change its dimensions, center position, rotation and color in the inspector. Dimensions and positions use millimeters. Position snap can be off or set to 0.5, 1, 5 or 10 mm; the visible grid is 10 mm.

Drag to orbit, right-drag to pan, and use the wheel to zoom. On touch screens, one finger orbits and two fingers pan/zoom. The view and camera buttons provide alternatives. Shift-click or use the object checkboxes to select several parts.

For a real hole, select the solid **first**, then a second shape that overlaps it as the cutter. Click **Subtract hole**. The originals are replaced with a cut triangle mesh; Undo restores them. Extending the cutter fully through the solid makes a through-hole more reliable than leaving faces exactly touching.

Guided quests show ghost outlines and check part types, sizes, positions and rotations. They check geometry, not whether a real structure or device would be safe.

The CAD workspace has deliberate limits:

- Extrusions use built-in L and hexagon profiles. There is no arbitrary sketch drawing, sketch constraint solver, fillet, chamfer or Boolean union.
- Grouping makes parts select and move together; it does not fuse their surfaces. Align matches centers to the first selected part. Rotation edits rotate each selected part about its own center, not an entire assembly around a shared pivot.
- Hole subtraction can fail on tangent or nearly coincident surfaces. Inspect results after a cut. A cut mesh supports movement, rotation, color and scale, but has no editable feature history beyond Undo.
- Models are limited to 48 objects and bounded mesh sizes. Undo/Redo retains the most recent 32 edits during the current session. CAD JSON imports must be below 16 MB and pass validation.
- STL uses millimeter coordinates and may contain separate, overlapping shells. Inspect and repair it in a suitable slicer before printing. No manufacturability or structural certification is provided.

## 6. Run checks or a production build in PowerShell

The double-click launcher is enough for normal use. The commands below are for checking edits and preparing to publish. Stop the running local website first, then open PowerShell and enter the project folder:

```powershell
Set-Location "$env:USERPROFILE\Developer\engiquest"
```

Run each command separately. If one fails, stop and read that error before continuing:

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run typecheck
npm.cmd run build
npm.cmd run start -- --port 3000
```

`npm.cmd ci` installs exactly what the lockfile specifies. `npm.cmd test` runs the automated checks. `typecheck` checks TypeScript. `build` creates the production application. `start` serves that build at `http://127.0.0.1:3000`; keep this PowerShell window open and press Ctrl+C to stop it. If the port is occupied, use `--port 3010` and remember that browser storage will be separate.

For everyday source editing instead of a production build:

```powershell
npm.cmd run dev -- --port 3000
```

The main test runner is `scripts/test.mjs`. It bundles the TypeScript tests with esbuild before using Node's test runner, avoiding the `tsx` launcher issue observed in this Windows environment. Tests do not send real AI requests.

Recorded automated development checks include **51 passing tests**, **90 lab level solutions**, **150 lab boundary cases**, and **2,540 project preparation input combinations**. These checks validate models and behavior; they are not equivalent to testing every interaction in every browser. Consult [VERIFICATION.md](VERIFICATION.md) for the final browser checks and production-build result. This README does not claim a Vercel deployment or a live AI-account test has occurred.

## 7. Diagnose an error from its log

The launcher writes website startup/runtime output to `logs\launch.log` in the project. It keeps the preceding run in `logs\launch.previous.log`. Dependency-install errors are saved in the log and appear in the launcher window; a missing Node installation can fail before a log is created.

In File Explorer, open the project's `logs` folder and open `launch.log` with Notepad. Or, from the project folder in PowerShell:

```powershell
Get-Content '.\logs\launch.log' -Tail 80
```

To capture a dependency-install failure in a separate file:

```powershell
New-Item -ItemType Directory -Force '.\logs'
npm.cmd ci 2>&1 | Tee-Object -FilePath '.\logs\install.log'
```

| What you see | Concrete next step |
| --- | --- |
| `node` or `npm.cmd` is not recognized | Install Node 24 LTS with npm, then open a new PowerShell window and rerun the two version checks. |
| PowerShell says `npm.ps1` cannot run | Use `npm.cmd` exactly as shown; changing the system execution policy is unnecessary. |
| Browser says the page cannot be reached | Compare its address with **ENGIQUEST BROWSER ADDRESS**, then read `logs\launch.log` for the first startup error. The launcher window must still be running. |
| Port is in use | Use the alternate address the launcher prints, or choose `ENGIQUEST_PORT` as shown above. Do not stop an unknown process. |
| npm reports a connection, proxy or certificate error | Save the npm error and ask your network administrator to allow the required npm registry connection. Do not disable certificate verification. |
| A package is missing or installation was interrupted | Stop the website, run `npm.cmd ci` from the folder containing `package-lock.json`, and inspect any installation error. |
| `next start` says no production build exists | Run `npm.cmd run build` successfully before `npm.cmd run start`, or use the normal launcher for development. |
| CAD reports missing/lost 3D graphics support | Export CAD JSON if available, then use a current browser with WebGL/hardware acceleration enabled. A lost graphics context requires a page reload after saving. |
| Progress looks empty after changing the address | Return to the original browser profile and exact original host/port. The records are stored separately by address. |
| Storage is full or blocked | Export your visible progress and CAD model; stop adding photos. Avoid clearing site storage until you have kept the records you need. |
| EngiBot shows written-guide mode | That is the normal state without valid AI configuration. Labs, projects, CAD and Journey do not require an API key. |
| EngiBot reports an access-code, timeout or provider-account problem | Follow the displayed message. Check server-side settings if you own the site; use written guidance while resolving it. Never paste keys into chat or screenshots. |

When asking for help, include the exact error text, the command you ran, `node --version`, `npm.cmd --version`, and the browser address. Remove API keys, access codes and personal details. This gives enough evidence to investigate instead of repeatedly restarting without a diagnosis.

## 8. Optional EngiBot AI

**No live AI connection was verified for this delivery because no credentials were provided.** Written-guide mode is available without configuration. AI access requires a separate OpenAI API project, a usable model and any applicable billing; credentials belong to the site owner, not students.

If you are ready to configure it locally, copy `.env.example` to `.env.local` in the project folder. Do not overwrite an existing `.env.local`; open and edit the existing file instead. In File Explorer, enable file-name extensions so the file does not accidentally become `.env.local.txt`.

Fill these server-side variables with your own values:

```dotenv
OPENAI_API_KEY=
OPENAI_MODEL=
ENGIBOT_ACCESS_CODE=
```

`OPENAI_MODEL` must be an explicit Responses API text model available to your API project. There is no hidden default model. The access code is optional during local development, but must be **16–128 characters** whenever it is set. Production AI requires that code; without it, the server stays in written-guide mode. Use a long random code and share it only with intended users. Even `npm run start` is production mode and requires the code for AI.

Never add `NEXT_PUBLIC_` to these variable names. Never put real values in `.env.example`, source control, the source ZIP, browser JavaScript or the message box. After changing server environment settings, stop and start the local server once so it loads the new configuration.

The drawer asks permission before sending a filtered question, up to eight recent filtered chat messages and selected authored activity guidance to OpenAI. It does not send profile data, progress, build photos or CAD files. Common contact details are filtered in the browser and again on the server. Replies are filtered too. Filtering is imperfect, so students must not type names, school details, contact information, precise locations, passwords or health records.

The API uses `store: false`; this does **not** mean Zero Data Retention. Provider retention controls still apply. OpenAI's guidance for minors requires particular care, including Zero Data Retention before processing personal data from children under 13 or the applicable age of digital consent. Keep written-guide mode for that audience until the operator has an appropriate reviewed setup. This app does not provide verified age assurance or an institutional safeguarding workflow. [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data) and [under-18 guidance](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance).

The server has strict input limits, request timeouts, safe errors, and a limit of 12 requests per minute with two concurrent requests **per server process**. Those counters are independent across serverless instances. The shared access code is not individual student authentication. Public school use of AI needs suitable managed authentication, central abuse/budget controls and a privacy/safeguarding review. These limitations do not prevent using the local non-AI learning activities.

## 9. Publish to Vercel after local checks

**These are instructions for you to perform; the website has not been published by this README.** A Vercel account, internet access and an eligible hosting plan are required. Keep AI disabled for the first deployment. Review the local verification report and resolve failing checks before publishing.

The following path uses Windows PowerShell and does not require installing Git. Next.js is supported directly by Vercel. [Vercel's Next.js documentation](https://vercel.com/docs/frameworks/full-stack/nextjs).

1. Sign in or create an account at [Vercel](https://vercel.com). Open PowerShell in the project folder:

```powershell
Set-Location "$env:USERPROFILE\Developer\engiquest"
npx.cmd vercel@latest login
npx.cmd vercel@latest link
```

The first `npx.cmd` invocation may ask to download the Vercel command-line tool. Follow the browser sign-in, select your intended account/team, and create a new project named `engiquest` (or an unused name). Link this folder to that new project. This creates local `.vercel` metadata; keep it out of source archives. [Vercel CLI project setup](https://vercel.com/docs/projects/deploy-from-cli).

2. In the Vercel project dashboard, open **Settings → Build and Deployment**. Select **Node.js 24.x**. Vercel supports this LTS major and applies its patch updates. [Supported Vercel Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

3. Use the **Next.js** framework preset. The root directory must be the folder containing `package.json`, not `app` or `.next`. Use install command `npm ci` and build command `npm run build`; leave the framework's output-directory setting at its Next.js default. Vercel should detect the framework, but check the displayed settings before deploying. [Vercel build configuration](https://vercel.com/docs/builds/configure-a-build).

4. Leave AI variables unset for the first deployment so EngiBot uses written guidance. If you later enable AI, add `OPENAI_API_KEY`, an explicit `OPENAI_MODEL`, and a 16–128 character `ENGIBOT_ACCESS_CODE` in **Settings → Environment Variables** for the intended environments. Enter secrets in the dashboard, not in source files. Apply changes with a new deployment. [Vercel environment variables](https://vercel.com/docs/environment-variables).

5. From the same PowerShell folder, publish the initial deployment:

```powershell
npx.cmd vercel@latest deploy
```

**The first deployment of a new Vercel project can be production even without `--prod`.** Treat this command as publishing. Keep its address unshared while checking it and review the project's deployment-protection settings. After an initial production deployment exists, the ordinary deploy command creates previews. [Vercel's current first-deployment behavior](https://vercel.com/docs/projects/deploy-from-cli).

6. Open the returned HTTPS address on your desktop and phone. Check navigation, field filtering, quiz results, a lab's scoring, refresh persistence, a project checklist, CAD modeling/JSON export and written-guide mode. Vercel storage starts separately from local progress. These hosted checks must be performed; a successful upload alone does not establish that they passed.

7. For later changes, make and test the edits locally, then create and inspect a preview using the ordinary deploy command. When that version is ready to be public, publish production:

```powershell
npx.cmd vercel@latest deploy --prod
```

Review the deployment's build logs when a build fails and its runtime logs when a page or API request fails. Share the production address only after checking it. [Vercel deploy command](https://vercel.com/docs/cli/deploy).

You can instead connect a source repository through Vercel's Git integration. That supports automatic preview deployments and deployments from a selected production branch. Keep the provided lockfile, ignore dependencies/build caches and exclude credentials before pushing any repository. [Vercel Git deployment documentation](https://vercel.com/docs/git).

## 10. What is in the editable source

The project uses Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, Lucide React icons, React Context for saved learning state, and Three.js with mesh subtraction for CAD. `package-lock.json` records exact installed versions.

- `app` contains the application entry point, styling and server route.
- `components` contains the quiz, labs, project viewer, career and Journey screens, EngiBot and CAD workspace.
- `lib` contains the authored catalogues, learning models, persistence and privacy/server helpers.
- `public` contains the supplied logo and local static assets.
- `scripts` contains the Windows-friendly launcher support and test runner.
- `tests` contains automated behavior checks.

The shareable source ZIP excludes `node_modules`, `.next`, test/build caches, logs, `.vercel` metadata and private environment files. It includes `.env.example` with blank values. Anyone receiving it must extract it into a fresh folder, install Node 24 LTS and install dependencies before running it. Browser-stored learning progress and models are not automatically included in a source archive.

The simulations state their assumptions and are educational approximations. The complete classroom model catalogue is implemented, but it is not validated for real structural, flight, electrical, clinical or manufacturing decisions. External program dates, eligibility and prices can change; use the official links in EngiScope. The displayed salary data is explicitly dated May 2025 and sourced from BLS rather than labeled as guaranteed future earnings.

