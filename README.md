# CarryPass — Self-Hosted Edition

CarryPass is a privacy-first, offline-capable password manager and team vault PWA. This is the self-hosted version — you own your data, your vault, and your deployment.

> **Live demo:** [carrypass.net](https://carrypass.net)  

---

## Why Self-Host?

Self-hosting is the recommended option for **teams**. It lets you:

- Distribute your own **team vault** with your own **secret admin password**
- Issue your own **admin QR codes** to team members
- Keep everything under your control — no third party ever sees your vault

---

## Before You Start

You will need:

- A free account on one of: [GitHub](https://github.com), [Vercel](https://vercel.com), or [Netlify](https://netlify.com) — or your own web server
- A text editor (Notepad on Windows, TextEdit on Mac, or [VS Code](https://code.visualstudio.com/) recommended)
- About 30 minutes

---

## Step 1 — Download the Files

1. Go to this repository on GitHub
2. Click the green **Code** button → **Download ZIP**
3. Unzip the downloaded file somewhere on your computer — you will now have a folder with all the app files

---

## Step 2 — Set Up Your Team Vault

The vault file is what makes your deployment unique. It contains your team structure and is protected by your admin password.

1. Open the app in your browser first — you can open `index.html` directly from the unzipped folder, or use the live demo at [carrypass.net](https://carrypass.net)
2. Go to the **Admin** section
3. Log in with the **demo admin password** (shown on screen)
4. Create a **new team vault** with your own secret admin password — do not reuse the demo password
5. Add at least **one team member** — this also generates a fresh **admin QR code** for yourself
6. Export/download the new `team-vault.json` file
7. Place the downloaded `team-vault.json` into the `/vault/` folder inside your unzipped files, replacing the existing one

> ⚠️ **Keep your admin password safe.** It is not stored anywhere — if you lose it, you cannot recover the vault.

---

## Step 3 — Deploy Your Files

Choose one of the options below. All of them are free.

---

### Option A — GitHub Pages (Simplest)

Best for: personal use or small teams who are comfortable with GitHub.

> ⚠️ GitHub Pages does not support custom HTTP security headers. The app will still work, but you will not be able to add headers like `Content-Security-Policy`. If security headers matter to you, use Vercel or Netlify instead.

1. Create a free account at [github.com](https://github.com) if you don't have one
2. Click **+** → **New repository** — name it anything, e.g. `carrypass`
3. Set it to **Public** (required for free GitHub Pages)
4. Upload all your files: click **Add file** → **Upload files** → drag your entire unzipped folder contents in
5. Click **Commit changes**
6. Go to **Settings** → **Pages** (left sidebar)
7. Under **Source**, select **Deploy from a branch** → choose `main` → folder `/root` → click **Save**
8. Wait 1–2 minutes — your site will be live at `https://yourusername.github.io/carrypass`

---

### Option B — Vercel (Recommended)

Best for: anyone who wants security headers and a clean custom domain setup.

> ✅ Your GitHub repository can be **private** when deploying to Vercel — unlike GitHub Pages, Vercel does not require a public repo.

1. Create a free account at [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Choose **Import from GitHub** — connect your GitHub account and select your repository, or use **Deploy without a Git repository** to upload directly
4. Leave all settings as default — click **Deploy**
5. Your site will be live at `https://your-project-name.vercel.app` within a minute

#### Security Headers on Vercel

The repository already includes a `vercel.json` file — it is pre-configured and you do not need to create or edit it:

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
        { "key": "Permissions-Policy", "value": "camera=(self), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';"
        }
      ]
    }
  ],
  "cleanUrls": false,
  "trailingSlash": false
}
```

> `wasm-unsafe-eval` is required because CarryPass uses **Argon2id** for password hashing, which runs as a WebAssembly module. `camera=self` is needed for QR code scanning.

#### Automatic SRI Hash Updates on Vercel

Vercel may serve your files slightly differently than your local copies, which causes **SRI (integrity) hash mismatches** that silently block scripts from loading. The repository includes a GitHub Actions workflow that fixes this automatically after every push.

The workflow file is already included at `.github/workflows/update-sri.yml` and is **dormant by default** — it only activates once you set a repository variable. To enable it:

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **Variables** tab → **New repository variable**
2. Set:
   - Name: `VERCEL_URL`
   - Value: `https://your-deployment.vercel.app` (no trailing slash)
3. Go to **Settings** → **Actions** → **General** → **Workflow permissions** → select **Read and write permissions** → **Save**
4. Push any change — the workflow will wait for Vercel to finish deploying, then update your `index.html` hashes automatically

If you never set `VERCEL_URL`, the workflow does nothing. Non-Vercel users can ignore it entirely.

If you add new JS or CSS files later, add their filenames to the `FILES` list inside the workflow file.

> This workflow was created for Vercel, but the same SRI mismatch problem can occur on Netlify or Cloudflare Pages if asset optimization is enabled. If you experience SRI errors on those platforms, adapt the workflow by changing `BASE_URL` to your deployment URL. GitHub Pages serves files as-is and is not affected.

---

### Option C — Netlify

Best for: people who prefer a drag-and-drop experience.

1. Create a free account at [netlify.com](https://netlify.com)
2. From your dashboard, drag your entire unzipped folder onto the **"Drag and drop your site folder here"** area
3. Your site will be live instantly at a random URL like `https://random-name.netlify.app`
4. You can rename it under **Site settings** → **Site details** → **Change site name**

#### Adding Security Headers on Netlify

Create a file called `_headers` (no extension) in the root of your files with the following content:

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(self), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none';
```

---

### Option D — Cloudflare Pages

Best for: teams who want a fast global CDN with full control over security headers and no file transformation.

> ✅ Cloudflare Pages supports **private GitHub repositories** and gives you granular control over how your files are served — making it a solid alternative to Vercel.

1. Create a free account at [cloudflare.com](https://cloudflare.com)
2. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Connect your GitHub account and select your repository
4. Leave build settings blank — this is a static site with no build step
5. Click **Save and Deploy**
6. Your site will be live at `https://your-project.pages.dev` within a minute

#### Adding Security Headers on Cloudflare Pages

Create a file called `_headers` (no extension) in the root of your files — the same format as Netlify:

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(self), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none';
```

> ⚠️ In your Cloudflare Pages dashboard, go to **Settings** and make sure **Auto Minify** and **Rocket Loader** are **disabled** — these features can modify your files and break the app's integrity checks.

---

### Option E — Self-Hosted Server (nginx or Apache)

Best for: teams who already run their own server and want full control.

> Every server setup is different, so these are general steps. If you run into issues, your server's documentation is the best reference.

1. Copy all the files from your unzipped folder to your server's web root — typically `/var/www/html/` on Linux
2. Make sure your server is configured to serve `index.html` as the default document
3. Ensure your site is accessible over **HTTPS** — this is required for the PWA and service worker to function. [Let's Encrypt](https://letsencrypt.org/) provides free SSL certificates

#### Recommended Security Headers

Add these to your server configuration:

**nginx** — add inside your `server {}` block:
```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header Referrer-Policy "no-referrer";
add_header Permissions-Policy "camera=(self), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none';";
```

**Apache** — add to your `.htaccess` file:
```apache
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "DENY"
Header set Referrer-Policy "no-referrer"
Header set Permissions-Policy "camera=(self), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()"
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
```

---

## Step 4 — Test Your Deployment

Once your site is live:

1. Open your deployed URL in a browser
2. Check that the app loads correctly
3. Log in to the Admin section with your admin password
4. Verify your team vault and members are present
5. Install the PWA on your device — look for the **"Add to Home Screen"** prompt
6. Turn off your internet connection and reload — the app should still work offline

---

## Updating CarryPass

When a new version is released:

1. Download the new ZIP from this repository
2. Replace all files **except** your `/vault/team-vault.json` — keep your vault file
3. Re-upload/redeploy

---

## Important Notes

- **Do not modify the app files** unless you know what you are doing — the integrity of the security features depends on them being unchanged
- **Your vault file is the only thing that is unique to your deployment** — back it up
- **HTTPS is required** — the service worker and PWA features will not work without it

---

## License

See [LICENSE](LICENSE) for details.
