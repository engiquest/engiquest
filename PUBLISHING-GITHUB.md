# Publish EngiQuest with GitHub Pages

Updated **21 October 2026**. Source: private [engiquest/engiquest](https://github.com/engiquest/engiquest), branch **main**. Intended address: **engiquest.org**, registered through **Domain.com**. GitHub Pages is the chosen website host.

**Current verified blocker:** the repository's **Settings → Pages** screen says: **“Upgrade or make this repository public to enable Pages.”** The repository remains private. To keep it private, the account owner must select an eligible paid GitHub plan. Making the source public is an alternative only if the user explicitly changes that preference; nothing here changes visibility. GitHub documents private-repository Pages support on Pro, Team and Enterprise plans. [Pages plan eligibility](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

**No live Pages deployment, domain routing or HTTPS has been verified.** A source upload and a successful local build are separate from a working public website. Resolve the plan blocker before changing website DNS.

## What the Pages edition includes

The Pages build exports browser-based labs, projects, quiz, Journey and CAD as static HTML, CSS and JavaScript. EngiBot is explicitly **written-guide-only** on this edition. GitHub Pages cannot run the `/api/engibot` Node route or keep an API key on a server. [GitHub Pages hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) and [Next.js static-export limits](https://nextjs.org/docs/app/guides/static-exports).

`npm run build:pages` prepares a separate staging export without the API route. The normal local application still supports optional server-side AI when configured. Never put API keys in the static export, browser code or GitHub Pages configuration; adding an Actions secret does not turn Pages into an API server.

## 1. Check the Pages build on Windows

Use the Node 24 LTS setup in [README.md](README.md). Open PowerShell and run these commands separately, stopping on any error:

```powershell
Set-Location 'C:\Users\anita\Developer\engiquest'
npm.cmd ci
npm.cmd test
npm.cmd run typecheck
npm.cmd run build:pages
npm.cmd run preview:pages
```

Use the browser address printed by the preview command. Keep the PowerShell window open while previewing; Ctrl+C stops it. If a port is unavailable, read the preview's error/address rather than stopping an unknown program. Open the site through this local web server, not by double-clicking an exported HTML file.

Check desktop and mobile layouts, field filtering, quiz results, a lab's scoring, project checklists, CAD modeling/JSON export, refresh persistence, and EngiBot's written guidance. These commands prepare and preview files locally; they do not publish. `npm run build` and `npm run start` remain the separate local Next.js server commands.

## 2. Keep source and credentials separate

The private repository already exists. Do not create a second repository or change its visibility. Source updates must reach **main**, including `.github/workflows/deploy-pages.yml`, `package-lock.json` and the Pages build scripts. Check the latest commit on GitHub before publishing.

The connected GitHub app's authentication is separate from PowerShell Git credentials. If you use GitHub Desktop, sign in and clone the existing repository into a **new empty folder**, such as `C:\Users\anita\Developer\engiquest-github`. Do not clone over the current project or force-push its older standalone history. Review intended changes before committing and pushing them.

Do not upload `.env.local`, other secrets, dependencies, build caches or logs. Keep `.env.example` blank. Pages needs no OpenAI credentials. The publishing workflow uses GitHub's scoped workflow permissions; do not paste a personal token into its YAML.

## 3. Enable Pages after the plan blocker is resolved

1. Sign into GitHub as **engiquest** and open [the repository's Pages settings](https://github.com/engiquest/engiquest/settings/pages).
2. Under **Build and deployment → Source**, choose **GitHub Actions**. Use the supplied workflow; do not add a competing Jekyll workflow or select a source branch for raw Next.js files.
3. Confirm `.github/workflows/deploy-pages.yml` exists on the repository's default branch **main**. It is intentionally triggered by **workflow_dispatch**. Pushing source alone does not publish this workflow.

The workflow builds static files, uploads the Pages artifact and deploys it using GitHub's Pages actions. [GitHub's custom-workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

When ready to publish, open **Actions**, select the workflow associated with **deploy-pages.yml**, choose **Run workflow**, select **main**, and run it. Opening the run shows its logs. Both build and deployment must succeed; then open the deployment URL shown by GitHub. Clicking **Run workflow** publishes or updates the site. [Manual workflow instructions](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow).

Without a custom domain, this project site's normal address is `https://engiquest.github.io/engiquest/`. The workflow reads `actions/configure-pages` output `base_path` so asset URLs match the active Pages address. **After adding, changing or removing a custom domain, run the workflow again** to rebuild paths for that address. This includes switching from `/engiquest/` to the root of `engiquest.org`.

## 4. Connect engiquest.org

Do this only once Pages is enabled and you are ready to publish. Start with GitHub's account-level **Settings → Pages → Add a domain** to verify **engiquest.org**. Copy the unique TXT record GitHub supplies into your DNS provider, return to GitHub and verify it; keep that TXT record afterward. [GitHub domain verification](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).

Then, in the **repository's Settings → Pages → Custom domain**, save **engiquest.org** before changing its website DNS. GitHub Actions publishing uses that setting; a `CNAME` file is not required. Point `www` to `engiquest.github.io` with no repository path. Configure the following records at the authoritative DNS provider:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | engiquest.github.io |

Optional IPv6 support uses four `AAAA` records at `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, and `2606:50c0:8003::153`. Keep the A records too. Use the registrar's root-host equivalent if it does not label it `@`. With both hostnames configured, GitHub redirects `www.engiquest.org` to the saved apex domain. [Official GitHub DNS values and custom-domain settings](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

In Domain.com's account, select **engiquest.org** and its DNS management page. Some accounts have moved to Network Solutions: its DNS interface has **Advanced DNS Records**, with **Advanced Tools → Manage** in the classic view. If the domain uses another provider's nameservers, make the records there instead. Keep unrelated email/MX, SPF/DKIM and verification records. Update conflicting website A/AAAA/CNAME entries for these hostnames only. [Domain.com transition information](https://www.networksolutions.com/help/article/faqs-domaindotcom-becoming-network-solutions) and [registrar DNS instructions](https://www.networksolutions.com/help/article/manage-dns-adns-records).

Run the publishing workflow again after saving the domain. When GitHub's DNS check passes and its certificate is ready, enable **Enforce HTTPS** in repository **Settings → Pages**. Test `https://engiquest.org` and `https://www.engiquest.org` in a browser. DNS/certificate changes can take time; use the displayed checks and actual records to diagnose problems. [GitHub HTTPS instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).

## 5. Diagnose publishing problems

| Symptom | Concrete next step |
| --- | --- |
| Pages still says to upgrade or make the repository public | Have the account owner activate an eligible plan for private-repository Pages. Keep the repository private unless the user explicitly decides otherwise. |
| No Run workflow button | Check that `deploy-pages.yml` with `workflow_dispatch` is on default branch main and that your account has write access. |
| Build/deploy fails | Open that Actions run and read the first failing step. Check Pages source is GitHub Actions and any displayed environment/permission restriction. |
| Page loads without styling, logo or images | Compare the published address with the configured custom domain, then rerun the workflow so `base_path` is rebuilt. |
| DNS check or HTTPS fails | Compare the authoritative A, optional AAAA, and www CNAME records with the table; inspect conflicting website records and GitHub's certificate message. |
| EngiBot offers written guides | This is the intended static-site behavior. API credentials cannot enable AI on Pages. |
| Progress is empty at the new address | Return to the original browser and address. Local, github.io and custom-domain storage are separate. |

Windows PowerShell can inspect DNS without Unix tools:

```powershell
Resolve-DnsName engiquest.org -Type NS
Resolve-DnsName engiquest.org -Type A
Resolve-DnsName engiquest.org -Type AAAA
Resolve-DnsName www.engiquest.org -Type CNAME
```

No AAAA answer is expected if you chose not to configure IPv6. Export progress and CAD files before switching addresses. Progress export is a readable archive; this version has no progress-import feature. Keep the local launcher workflow for offline/local development, and rerun the manual publishing workflow when a tested update is ready for the public site.
