# Publish EngiQuest with GitHub and Vercel

Research and local inspection: **18 October 2026**. Source repository: **private [engiquest/engiquest](https://github.com/engiquest/engiquest)**, created and privacy verified in GitHub. Intended website: **`engiquest.org`**, registered through **Domain.com**. A source upload is separate from a successful deployment or domain connection; use the project's deployment status to verify hosting.

For the already-created repository, skip the repository-creation section below. In Vercel, import `engiquest/engiquest`, use branch `main`, framework **Next.js**, project root `./`, and Node.js **24.x**. Keep the default build/output settings. EngiBot works in written-guide mode without environment variables. Add AI credentials only through the hosting dashboard if you choose to enable it later.

The connected GitHub app can transfer source, but its login is not a Git password for PowerShell. Command-line Git authentication on this computer was checked and is unavailable. For future local Git sync, install/sign into GitHub Desktop and clone the repository into a **new empty folder** (for example `C:\Users\anita\Developer\engiquest-github`). Do not clone over the existing working project or force-push its older standalone history. The existing folder remains runnable with the launcher.

Use **GitHub to store the editable source**, **Vercel to run the Next.js website**, and your domain provider to point your chosen address to Vercel. Keeping the source repository private does not make the deployed website private; check the website's access settings separately.

## What was checked

- `C:\Users\anita\Developer\engiquest` is already a Git repository. At inspection it had a clean working tree, branch `master`, and no configured remote.
- Git `2.53.0.windows.3` works in the Codex environment. It comes from a bundled runtime; availability in an ordinary PowerShell window has not been verified.
- GitHub CLI (`gh`) was not available on PATH, so command-line GitHub authentication was not verified. The connected GitHub app has separately authenticated the **`engiquest`** account; the user has also reported browser sign-in. These are separate from Git credentials in PowerShell.
- The app has a Node.js `/api/engibot` route with dynamic `GET` and `POST` handlers. Its settings are not configured for a static export.

## Why GitHub Pages does not run this complete app

GitHub Pages serves static HTML, CSS and JavaScript. It does not run EngiQuest's Node server. [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

Next.js static exports support build-time `GET` output, but not a request-dependent `POST` API. Publishing the current project to Pages would therefore not provide the complete EngiBot integration. A separate static edition would need deliberate code changes and either written-guide-only mode or an externally hosted API. Merely switching on Pages or setting `output: 'export'` is insufficient. [Next.js static-export limits](https://nextjs.org/docs/app/guides/static-exports).

Vercel supports a full Next.js deployment, including the server route, so it fits the current application. [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs).

## 1. Check the local project

Open Windows PowerShell. Run these commands one at a time, stopping if one reports an error:

```powershell
Set-Location 'C:\Users\anita\Developer\engiquest'
git --version
node --version
npm.cmd --version
npm.cmd test
npm.cmd run typecheck
npm.cmd run build
git status --short
```

If Git is unavailable in this window, use the GitHub Desktop route below, or install Git for Windows before using command-line Git. Do not replace the project folder. Resolve actual test/build errors from their output before publishing.

Review the files being committed. Keep `package-lock.json`, the source, logo, launcher and blank `.env.example`. Exclude `.env.local`, other credentials, `node_modules`, `.next`, logs and `.vercel`. The current `.gitignore` already covers these paths; ignore rules do not remove a secret that was committed earlier.

## 2. Put the source on GitHub

The chosen GitHub owner is **`engiquest`**, repository name **`engiquest`**, visibility **Private**. If it has already been created or pushed for you, open [the intended repository](https://github.com/engiquest/engiquest) while signed in and skip duplicate creation.

The simplest manual route is [GitHub Desktop](https://desktop.github.com/):

1. Install it if needed and sign in to your intended GitHub account.
2. Choose **File → Add local repository** and select `C:\Users\anita\Developer\engiquest`.
3. Review and commit any intended pending source changes in the Changes view.
4. Click **Publish repository**. Use name **engiquest**, owner **engiquest**, and leave **Keep this code private** checked.
5. Publish, then open the repository on GitHub and verify that the source and lockfile appear.

No remote existed at inspection. If a remote now exists, use the existing repository instead of removing or replacing it. [GitHub's Desktop publishing steps](https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-an-existing-project-to-github-using-github-desktop?platform=windows).

**PowerShell alternative**, if Git authentication is already configured: create the empty private repository `engiquest/engiquest` on GitHub, unless it already exists. Do not add a README, license or `.gitignore` during creation because the local project already contains files. After the repository exists:

```powershell
git remote add origin 'https://github.com/engiquest/engiquest.git'
git push -u origin HEAD
```

These commands publish existing commits on your current branch. Commit intended changes first; if `origin` already exists, inspect it instead of running `remote add`. An authentication error means the push did not complete: sign in through the supported Git credential flow or use GitHub Desktop. Do not paste tokens into chat or source files. [GitHub's local-repository instructions](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

## 3. Run the website on Vercel

1. Sign in to Vercel. Select the correct account/team and choose **Add New → Project**.
2. Connect the **engiquest** GitHub account, grant Vercel access to the private **engiquest/engiquest** repository, and import it. If it is missing, check the GitHub integration's repository permissions. [Vercel GitHub integration](https://vercel.com/docs/git/vercel-for-github).
3. Use the **Next.js** framework preset and the directory containing `package.json` as the project root. Keep the framework's default output directory. Use `npm ci` to install and `npm run build` to build.
4. Set Node.js to **24.x** in project **Settings → Build and Deployment**. This major is currently supported. [Vercel Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
5. Leave AI environment variables unset initially; EngiBot will offer written guidance. Later AI setup requires server-side `OPENAI_API_KEY`, an explicit `OPENAI_MODEL`, and a 16–128 character `ENGIBOT_ACCESS_CODE` in Vercel's environment settings. Never put their real values in the repository. The project README describes the remaining AI/privacy limitations.
6. Click **Deploy**, which publishes a website. Open the resulting address and test it on desktop and mobile before sharing it.

Confirm the production branch under **Settings → Environments → Production → Branch Tracking**. The local branch was `master`; use the branch actually pushed. Pushes to that branch update the public deployment, while other branches normally produce previews. [Vercel Git deployment and branch settings](https://vercel.com/docs/git).

Check navigation, field filtering, quiz completion, lab feedback, refresh persistence, CAD rendering/JSON export, a project checklist, and written-guide mode. A green build does not prove these browser checks passed. Inspect Vercel build/runtime logs if something fails. No live AI request or hosted browser verification was performed as part of this research.

## 4. Link your own domain

The domain is **engiquest.org**, registered through **Domain.com**. Domain.com is transitioning accounts to Network Solutions, and its help site now redirects there. If your account has moved, use the Network Solutions account manager linked by the registrar; the transition itself does not require changing DNS. [Official Domain.com transition FAQ](https://www.networksolutions.com/help/article/faqs-domaindotcom-becoming-network-solutions).

1. In the deployed Vercel project, open **Settings → Domains → Add Domain** and enter **engiquest.org**. Add **www.engiquest.org** too and set it to redirect to **engiquest.org**.
2. Copy the exact record type, name and value Vercel displays. Do not copy another site's IP address or an old tutorial's DNS values.
3. In your registrar account, select **Domains → engiquest.org** and open its DNS-record management page. The Network Solutions interface offers **Advanced DNS Records**; its classic view places that under **Advanced Tools → Manage**. If the account says DNS is hosted elsewhere, edit records at that named provider instead. [Official DNS-management instructions](https://www.networksolutions.com/help/article/manage-dns-adns-records).
4. Add or update only the website records requested by Vercel: usually an A record for the root (`@`) and CNAME for `www`, using the displayed values. Keep unrelated email/MX and verification records. There is normally no need to transfer the domain or replace all its nameservers.
5. Add a verification TXT record if Vercel requests one. Recheck its domain status, then test **https://engiquest.org** and the **www** redirect. Live deployment, DNS routing and HTTPS are still unverified until those checks succeed.

[Vercel domain dashboard instructions](https://vercel.com/docs/domains/working-with-domains/add-a-domain) and [DNS setup guidance](https://vercel.com/docs/domains/set-up-custom-domain).

If verification fails, compare the displayed required records with the authoritative provider's records, including conflicting A/AAAA/CNAME entries. Do not repeatedly restart the app: DNS is separate from the local server.

Learning progress stays in each browser and website origin. The custom domain, Vercel address and local address each have separate saved progress. Export progress and CAD files before switching addresses; the progress export is an archive, and the app currently has no progress-import feature.
