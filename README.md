# Olven Tech — 12:00 AM Zero-AI Social Automation

This repository runs an unattended **12:00 AM daily GitHub Actions workflow** ([`.github/workflows/midnight-auto-post.yml`](.github/workflows/midnight-auto-post.yml)) that:

1. Connects to your Google Drive **`Posts By Day/`** folder (`1X6NaCcY99ShXMiUxyeO1xvA1bKI_k562`).
2. Finds the next unpublished `Day N` folder (tracked in [`state/published_days.json`](state/published_days.json), starting with **`Day 6`**).
3. Enforces the **Hard-Line Anti-AI & Algorithm Reach Gate** ([`lint_human_quality.py`](lint_human_quality.py)):
   - Blocks any caption containing em-dashes (`—`), formulaic `"Not X. Y."` LLM contrast hooks, or banned AI buzzwords (`delve`, `seamless`, `10x execution velocity`, `sovereign stack`, `unified data plane`, etc.).
   - Blocks any image containing Midjourney, DALL-E, Stable Diffusion, Imagen, or Firefly EXIF/C2PA metadata.
   - Blocks outbound `https://` links in the post body (which cause LinkedIn, X, and Meta algorithms to throttle feed reach by 40–70%) and hashtag stuffing (`>2` tags).
4. Publishes natively via the **Official OAuth APIs** ([`publish_day.py`](publish_day.py)) to **LinkedIn, X, Facebook, Instagram, and Threads**—supporting both Retina `.png` images and native H.264 `.mp4` videos.

---

## 3-Minute Setup to Activate 12:00 AM Auto-Posting

### Step 1: Push this repository to GitHub (`OlvenTech`)

```bash
git remote add origin https://github.com/OlvenTech/olven-social-automation.git
git push -u origin main
```

### Step 2: Add Your Platform API Secrets in GitHub

In your GitHub repository, go to **Settings → Secrets and variables → Actions → New repository secret** and add the following secrets:

| Secret Name | Where to Get It | Purpose |
| :--- | :--- | :--- |
| `GDRIVE_SERVICE_ACCOUNT_JSON` | Google Cloud Console → IAM & Admin → Service Accounts → Create Key (JSON). Share your `Posts By Day` Drive folder (Read-only) with the service account email. | Lets the 12:00 AM runner download the next `Day N` folder automatically. |
| `LINKEDIN_ORG_ID` | Numeric ID in your LinkedIn Company Page admin URL (`linkedin.com/company/<ORG_ID>/admin`). | Identifies the Olven Tech company page. |
| `LINKEDIN_ACCESS_TOKEN` | [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps) → Create App → Products: *Share on LinkedIn* & *Advertising API* → OAuth 2.0 token with `w_organization_social` scope. | Posts native images & `.mp4` videos to LinkedIn. |
| `X_USER_ACCESS_TOKEN` | [X Developer Portal](https://developer.x.com/) → App with Read & Write permissions → OAuth 2.0 User Access Token (`tweet.read`, `tweet.write`, `users.read`). | Publishes native posts to X (`POST /2/tweets`). |
| `FB_PAGE_ID` | Facebook Page → About → Page Transparency → Page ID. | Identifies the Olven Tech Facebook Page. |
| `FB_PAGE_ACCESS_TOKEN` | [Meta for Developers](https://developers.facebook.com/) → Business App → System User Page Access Token (`pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`). | Publishes native photos & Reels/videos to Facebook and Instagram. |
| `IG_USER_ID` | Meta Graph API Explorer: `GET /me/accounts?fields=instagram_business_account`. | Identifies the connected Instagram Business account. |
| `IG_PUBLIC_MEDIA_BASE_URL` | Public bucket or raw URL prefix hosting staged Instagram media for Meta Graph API ingestion. | Required by Meta's `/media` container endpoint. |
| `THREADS_USER_ID` | Meta Developer App → Threads API → User ID. | Identifies the Olven Tech Threads profile. |
| `THREADS_ACCESS_TOKEN` | Meta Developer App → Threads OAuth long-lived token (`threads_basic`, `threads_content_publish`). | Publishes daily posts to Threads. |

---

## Local Verification & Dry Run

Before midnight, you can test any `Day N` folder locally without posting:

```bash
# 1. Run the Anti-AI, Copyright & Algorithm Reach Linter
python3 lint_human_quality.py /path/to/day6

# 2. Run a dry-run across all 5 platforms
python3 publish_day.py /path/to/day6 --dry-run
```
