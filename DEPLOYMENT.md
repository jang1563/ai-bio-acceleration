# Deployment Guide

## 1. GitHub Pages Deployment

### Option A: Automatic (via GitHub Actions)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages when you push to main.

**Steps:**
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Under "Build and deployment", select "GitHub Actions" as the source
4. Push any change to the `webpage/` directory to trigger deployment

### Option B: Manual Deployment

```bash
# From the repository root
git subtree push --prefix webpage origin gh-pages
```

Or configure GitHub Pages to deploy from the `webpage/` directory on the main branch.

---

## 2. Google Analytics Setup

### Step 1: Create a Google Analytics 4 Property

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click "Admin" → "Create Property"
3. Enter property name: "AI Bio Acceleration Model"
4. Select your country and timezone
5. Click "Create"

### Step 2: Get Your Measurement ID

1. In the new property, go to "Data Streams"
2. Click "Add stream" → "Web"
3. Enter your URL: `https://ai-bio-acceleration.github.io`
4. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 3: Update the Code

Replace `GA_MEASUREMENT_ID` in `index.html`:

```html
<!-- Before -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

<!-- After -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

Also update the `gtag('config', ...)` line:

```javascript
gtag('config', 'G-XXXXXXXXXX');
```

### Step 4: Verify Installation

1. Open your deployed site
2. Go to Google Analytics → Reports → Realtime
3. You should see yourself as an active user

---

## 3. Custom Domain (Optional)

### Using a Custom Domain with GitHub Pages

1. Purchase a domain (e.g., `ai-bio-acceleration.com`)

2. Add a CNAME file to the `webpage/` directory:
   ```
   ai-bio-acceleration.com
   ```

3. Configure DNS at your domain registrar:
   ```
   Type: CNAME
   Name: www
   Value: your-username.github.io

   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

4. In GitHub repo Settings → Pages → Custom domain, enter your domain

5. Enable "Enforce HTTPS"

6. Update all URLs in `index.html`:
   - `og:image`
   - `og:url`
   - `twitter:image`

---

## 4. Pre-Launch Checklist

### Content
- [ ] All charts loading correctly
- [ ] No broken links
- [ ] Parameter tooltips working
- [ ] Mobile responsiveness verified
- [ ] Print stylesheet tested

### SEO
- [ ] Title tag optimized
- [ ] Meta description set
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Canonical URL set

### Analytics
- [ ] Google Analytics installed
- [ ] Measurement ID replaced
- [ ] Realtime tracking verified

### Performance
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] CSS/JS minified (optional)
- [ ] Fonts preloaded

### Legal
- [ ] License clearly stated
- [ ] Citation format provided
- [ ] Data sources credited

---

## 5. Post-Launch Tasks

### Week 1
- [ ] Monitor Google Analytics for traffic
- [ ] Check for any console errors
- [ ] Share on Twitter/LinkedIn
- [ ] Submit to Hacker News

### Month 1
- [ ] Review analytics data
- [ ] Collect user feedback
- [ ] Fix any reported issues
- [ ] Consider adding new features

---

## Troubleshooting

### Charts not loading
- Check browser console for errors
- Verify Chart.js CDN is accessible
- Clear browser cache

### OG image not showing
- Use [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- Ensure image URL is absolute (starts with https://)
- Check image dimensions (1200x630 recommended)

### Mobile issues
- Test with Chrome DevTools device emulation
- Check viewport meta tag
- Verify touch targets are ≥44px

### Analytics not tracking
- Check for ad blockers
- Verify Measurement ID is correct
- Use Google Tag Assistant browser extension

---

## Support

For issues, open a GitHub issue or contact the maintainers.
