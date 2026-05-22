# CarryPass — Self-Hosted Edition

CarryPass is a privacy-first, offline-capable password manager and team vault PWA. This guide explains how to deploy your own copy so that you control the app files, the vault file, and the hosting environment.

> **Public reference deployment:** [carrypass.net](https://carrypass.net)

---

## Why Self-Host?

For teams using CarryPass with real shared credentials, self-hosting is the preferred deployment model if the team can maintain the deployment responsibly.

Self-hosting lets you:

- host the CarryPass app under your own domain
- distribute your own encrypted team vault
- manage your own members, teams, and credentials
- issue your own trusted-device onboarding QR codes
- avoid relying on a third-party CarryPass deployment for your operational vault

CarryPass remains client-side: hosting the app does **not** give the server access to plaintext passwords, member passwords, or decrypted credentials.

---

## Important Security Model

Before deploying, understand this boundary:

- CarryPass does not store plaintext credentials on the server.
- The vault file is encrypted and can be distributed as a static file.
- The browser must still trust the JavaScript files served by your deployment.
- Whoever controls the hosting environment could serve modified JavaScript.
- Self-hosting gives you control, but it also makes you responsible for deployment integrity, HTTPS, headers, backups, and updates.

For high-risk environments, review the code and deployed files carefully before use.

---

## Before You Start

You will need:

- a free account on one of: [GitHub](https://github.com), [Vercel](https://vercel.com), [Netlify](https://netlify.com), [Cloudflare](https://cloudflare.com), or your own web server
- a text editor such as Notepad, TextEdit, or preferably [VS Code](https://code.visualstudio.com/)
- a modern browser
- about 30 minutes for a basic deployment
- access to HTTPS for production use

---

## Step 1 — Download the Files

1. Go to the CarryPass repository on GitHub.
2. Click the green **Code** button.
3. Choose **Download ZIP**.
4. Unzip the downloaded file somewhere on your computer.
5. You should now have a folder containing the app files, including `index.html`, JavaScript files, CSS files, assets, and deployment configuration files.

Do not remove bundled libraries unless you know exactly what depends on them. CarryPass is designed to run without external CDN calls.

> ⚠️ **Service worker file list:** CarryPass caches files for offline use through its service worker. Every file listed in the service worker's cache/precache list must also exist on your server. If a listed file is missing, the service worker may fail to install or the app may not be available offline.

---

## Step 2 — Create Your Own Team Vault

The vault file is what makes your team deployment unique. It contains encrypted team data and must be created by you.

Create the vault in your **own local or self-hosted copy** of CarryPass. Do not create your production vault on the public reference deployment.

1. Open your downloaded/self-hosted CarryPass copy.
2. Go to the team/admin vault area.
3. If no vault file is present, CarryPass can start a new vault setup directly.
4. Create a new vault protected by your own secret admin/member password.
5. Create at least one admin/member record for yourself.
6. Finalize the member/admin record and generate the onboarding QR code.
7. Save the QR code securely or enroll your trusted device immediately.
8. Add teams, members, and credentials as needed.
9. Export/download the encrypted `team-vault.json` file.
10. Place the exported `team-vault.json` into the `/vault/` folder of your self-hosted copy.

> ⚠️ **Do not create production vaults on the public CarryPass reference deployment.** Use your own local or self-hosted copy so that your operational vault workflow stays under your control.

> ⚠️ **Keep your admin/member password and trusted-device QR safe.** CarryPass is designed so that lost secrets cannot be recovered by a server operator.

---

## Step 3 — Deploy Your Files

Choose one of the options below.

---

## Option A — GitHub Pages

GitHub Pages is a simple way to publish a static CarryPass deployment for personal use, testing, or small teams that are already comfortable with GitHub.

GitHub Pages is easy to use, but it has one important limitation: it does not provide the same level of custom HTTP header control as Vercel, Netlify, Cloudflare Pages, Apache, NGINX, or your own server.

If your deployment requires strict server-side security headers, use another hosting option where headers can be configured directly.

## Extra files you may need

The CarryPass application files are not listed here. This section only describes additional files that may be needed or useful for a GitHub Pages deployment.

### `.nojekyll`

Create an empty file named:

```txt
.nojekyll
```

Place it in the publishing root selected in GitHub Pages settings.

For example:

- if GitHub Pages publishes from the repository root, place `.nojekyll` in the repository root;
- if GitHub Pages publishes from `/docs`, place `.nojekyll` inside `/docs`.

This tells GitHub Pages not to process the site as a Jekyll project. For a static client-side app, this is usually the safest option.

It is especially useful if your project contains folders that begin with a dot, such as:

```txt
.well-known/
```

### Optional `.well-known/` folder

You may include a `.well-known/` folder if you want to publish standardized public metadata files.

Recommended structure:

```txt
.well-known/
├── README.md
├── security.txt
└── change-password
```

For self-hosted deployments, review these files before publishing them.

Do not publish a default `security.txt` unchanged. Replace the contact address, canonical URL, policy URL, and expiration date with values that belong to your own hosted instance.

If you do not want to publish a real security contact yet, use:

```txt
security.txt.example
```

instead of:

```txt
security.txt
```

### Optional `SECURITY.md`

You may add a `SECURITY.md` file to the repository root.

This file can explain:

- how to report security issues;
- what kind of reports are useful;
- what is in scope or out of scope;
- whether acknowledgments are offered;
- which contact address should be used.

If you publish `/.well-known/security.txt`, its `Policy:` field can point to this file.

Example:

```txt
Policy: https://github.com/yourname/yourrepo/blob/main/SECURITY.md
```

### Optional `CNAME`

Create a file named:

```txt
CNAME
```

only if you want to use a custom domain.

The file should contain only the domain name, for example:

```txt
example.com
```

Do not add `https://`, paths, or extra text.

## Basic deployment steps

1. Create a GitHub account if you do not already have one.
2. Create a new repository.
3. Upload your CarryPass files.
4. Add an empty `.nojekyll` file to the publishing root.
5. Optional: add `.well-known/` with reviewed public metadata files.
6. Optional: add `SECURITY.md`.
7. Optional: add `CNAME` if you use a custom domain.
8. Open the repository on GitHub.
9. Go to **Settings → Pages**.
10. Under **Build and deployment**, select **Deploy from a branch**.
11. Select the branch, usually `main`.
12. Select the publishing folder, usually `/root` or `/docs`.
13. Save and wait for GitHub Pages to publish the site.

Your site will usually become available at a URL similar to:

```txt
https://yourusername.github.io/yourrepository
```

If you use a custom domain, follow GitHub’s custom domain instructions and make sure your DNS settings are correct.

## Security notes

A GitHub Pages deployment should be treated as public.

Do not place secrets, private vault files, private keys, credentials, logs, personal data, or user-specific data in the repository.

GitHub Pages is suitable for hosting a static client-side app, but it is not the best choice if you need strict custom HTTP security headers.

For stricter deployments, prefer a host where you can configure headers such as:

```txt
Content-Security-Policy
Permissions-Policy
X-Frame-Options
Referrer-Policy
X-Content-Type-Options
```

## Official GitHub documentation

For the most accurate and up-to-date deployment instructions, use GitHub’s official documentation:

```txt
https://docs.github.com/pages/quickstart
```

For publishing source settings:

```txt
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
```


## Option B — Vercel

Best for users who want a simple deployment flow, private GitHub repositories, custom domains, and security headers.

1. Create a free account at [vercel.com](https://vercel.com).
2. Click **Add New** → **Project**.
3. Import your GitHub repository or upload the project directly.
4. Leave build settings empty/default because CarryPass is a static app.
5. Click **Deploy**.
6. Your site will be available at a URL such as:

```text
https://your-project-name.vercel.app
```

### Security Headers on Vercel

The repository may include a `vercel.json` file. If it does, review it before deployment. A recommended baseline is:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "no-referrer" },
        { "key": "Permissions-Policy", "value": "camera=(self), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=(), clipboard-read=()" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; frame-src 'none'; manifest-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';"
        }
      ]
    }
  ],
  "cleanUrls": false,
  "trailingSlash": false
}
```

`wasm-unsafe-eval` is required for Argon2id WebAssembly in the current browser environment. `camera=(self)` is needed if you use QR scanning through the camera.

### SRI Hashes on Vercel

If CarryPass uses Subresource Integrity (`integrity="..."`) on local scripts or styles, deployed files must match those hashes exactly.

Some platforms can transform files during deployment, which may cause SRI mismatches and prevent scripts from loading. If your repository includes an SRI update workflow, enable it only after reviewing what it does.

A typical workflow is:

1. Set a repository variable such as `VERCEL_URL`.
2. Allow GitHub Actions write permissions if the workflow commits updated hashes.
3. Push a change.
4. Let the workflow fetch deployed assets and update integrity hashes.

If you do not use SRI, this step is not needed. If you do use SRI, test the browser console after deployment and look for integrity-related errors.

---

## Option C — Netlify

Best for users who prefer drag-and-drop deployment.

1. Create a free account at [netlify.com](https://netlify.com).
2. From the dashboard, drag your CarryPass folder onto the deploy area.
3. Netlify will publish the site at a generated URL.
4. You can rename the site under **Site settings**.

### Security Headers on Netlify

Create a file named `_headers` in the root of your project:

```text
/*
  Cache-Control: public, max-age=0, must-revalidate
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(self), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=(), clipboard-read=()
  Content-Security-Policy: default-src 'self'; frame-src 'none'; manifest-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';
```

If you use SRI, disable asset optimization/minification features that modify JavaScript or CSS output.

---

## Option D — Cloudflare Pages

Best for teams that want a fast global CDN and good control over file delivery.

1. Create a free account at [cloudflare.com](https://cloudflare.com).
2. Go to **Workers & Pages**.
3. Create a new Pages project.
4. Connect your Git repository.
5. Leave build settings empty because CarryPass is a static app.
6. Deploy.
7. Your site will be available at a URL such as:

```text
https://your-project.pages.dev
```

### Security Headers on Cloudflare Pages

Create a file named `_headers` in the root of your project:

```text
/*
  Cache-Control: public, max-age=0, must-revalidate
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(self), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=(), clipboard-read=()
  Content-Security-Policy: default-src 'self'; frame-src 'none'; manifest-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';
```

> ⚠️ Disable features such as Auto Minify, Rocket Loader, or other HTML/JS/CSS rewriting features. These may break SRI hashes or alter security-sensitive files.

---

## Option E — Self-Hosted Server

Best for teams that already operate their own web server.

1. Copy all files from the unzipped CarryPass folder to your web root, for example:

```text
/var/www/html/
```

2. Configure the server to serve `index.html` as the default document.
3. Serve the site over HTTPS.
4. Make sure `.wasm`, `.js`, `.css`, `.json`, `.webmanifest`, and image files are served with correct MIME types.
5. Disable server-side transformations, minification, or injection.
6. Confirm that `/vault/team-vault.json` is served as a static JSON file.
7. Confirm that every file listed in the service worker cache/precache list exists at the expected path on the server.

### nginx Example Headers

Add inside the relevant `server {}` block:

```nginx
add_header Cache-Control "public, max-age=0, must-revalidate" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "no-referrer" always;
add_header Permissions-Policy "camera=(self), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=(), clipboard-read=()" always;
add_header Content-Security-Policy "default-src 'self'; frame-src 'none'; manifest-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';" always;
```

### Apache Example Headers

Enable the `headers` module, then add to your virtual host or `.htaccess`:

```apache
Header always set Cache-Control "public, max-age=0, must-revalidate"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set Referrer-Policy "no-referrer"
Header always set Permissions-Policy "camera=(self), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=(), clipboard-read=()"
Header always set Content-Security-Policy "default-src 'self'; frame-src 'none'; manifest-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';"
```

---

## Step 4 — Test Your Deployment

After deployment:

1. Open your deployed URL in a clean browser profile or private window.
2. Open the browser developer console.
3. Confirm there are no CSP, SRI, MIME type, or service worker errors.
4. Confirm the app loads correctly.
5. Confirm Argon2id works by completing login or registration.
6. Confirm QR scanning works if you need camera access.
7. Confirm `/vault/team-vault.json` loads successfully.
8. Confirm that every file listed in the service worker cache/precache list exists on the deployed server.
9. Install the PWA.
10. Turn off the internet connection and confirm the installed PWA still opens.
11. Confirm your trusted-device enrollment and vault access work as expected.

---

## Updating CarryPass

When a new CarryPass version is released:

1. Back up your current deployment.
2. Back up your `/vault/team-vault.json`.
3. Download the new CarryPass release.
4. Replace the app files.
5. Keep your own `/vault/team-vault.json` unless the release notes explicitly require migration.
6. Review changed CSP requirements if new files or browser features were added.
7. Recalculate SRI hashes if your deployment uses them.
8. Redeploy.
9. Test in a clean browser profile before telling team members to use the new version.

---

## Updating the Team Vault

When you change teams, members, credentials, or access:

1. Open the admin panel.
2. Make the required changes.
3. Export a fresh `team-vault.json`.
4. Replace the deployed `/vault/team-vault.json`.
5. Redeploy or upload the file.
6. Ask users to reload the app.

If the old vault file is cached, users may need to hard refresh or clear the PWA cache. Your `Cache-Control` header should use `max-age=0, must-revalidate` so that browsers check for updates.

---

## Backups

Back up at least:

- your latest `team-vault.json`
- any trusted-device recovery/export files you intentionally created
- the deployment version you are currently using
- documentation of who has admin/member access

Do not store admin/member passwords in plaintext next to the vault file.

---

## Important Notes

- Do not deploy demo vaults, demo passwords, or demo QR codes for real use.
- Do not modify cryptographic files unless you know exactly what you are doing.
- Use HTTPS in production.
- Keep the vault file backed up.
- Keep old vault files private; they may still contain credentials that were valid at the time of export.
- If a member is removed, rotate any underlying service passwords that the member may already have seen.
- If your hosting platform rewrites JavaScript, CSS, or HTML, disable that feature or SRI/CSP may break the app.
- Treat your hosting environment as trusted code delivery infrastructure.

---

## Troubleshooting

### The app opens but buttons do nothing

Check the browser console for:

- CSP errors
- SRI integrity mismatch errors
- MIME type errors
- blocked WebAssembly loading

### QR scanning does not work

Check that:

- the site is served over HTTPS
- camera permission is allowed
- the `Permissions-Policy` header allows `camera=(self)`

### Offline mode does not work

Check that:

- the service worker registered successfully
- the site was loaded once while online
- HTTPS is enabled
- the browser did not block service workers
- every file listed in the service worker cache/precache list exists on the server at the exact expected path
- no listed file returns `404`, an HTML error page, or the wrong MIME type

### The vault does not update

Check that:

- `/vault/team-vault.json` was replaced
- the browser is not using an old cached copy
- `Cache-Control` is set to `max-age=0, must-revalidate`
- users have reloaded the PWA

### Scripts are blocked after deployment

If you use SRI, verify that the deployed files match the hashes in `index.html`. If your host modifies files, disable modification or update the SRI hashes after deployment.

---

## License

See [LICENSE](LICENSE) for details.
