# AI-Accelerated Biological Discovery - Webpage

A single-page web application presenting the quantitative model for AI's impact on biological discovery.

## Quick Start

```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Serve with Python
python -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Serve with Node
npx serve .
```

## Project Structure

```
webpage/
├── index.html          # Main webpage
├── supplementary.html  # Supplementary materials
├── styles.css          # All styles (responsive)
├── charts.js           # Chart.js visualizations
├── app.js              # Interactivity & navigation
├── data/
│   ├── parameters.csv       # Model parameters
│   ├── sobol_indices.csv    # Sensitivity analysis
│   ├── policy_roi.csv       # Policy rankings
│   └── disease_projections.csv
├── assets/
│   └── (images, og-image.png)
└── README.md
```

## Features

### Visualizations (5 Charts)
1. **Hero Chart** - Acceleration trajectories with scenario toggle
2. **Monte Carlo Distribution** - Histogram with 80% CI highlighting
3. **Sobol Sensitivity** - Horizontal bar chart showing parameter importance
4. **Disease Timeline** - Cure projections with/without AI
5. **Policy ROI** - Investment rankings by return

### Interactive Elements
- Sticky navigation with scroll progress
- Pipeline stage modals with AI mechanism details
- Collapsible methods accordion
- Keyboard navigation (j/k to scroll sections)
- Mobile-responsive design

### Content Sections
- Executive Summary
- Model Framework (10-stage pipeline)
- Results with uncertainty
- Uncertainty & Limitations
- Policy Recommendations
- Takehome Messages (Industry + University)
- Key Bottlenecks
- Methods & Data Sources

## Dependencies

- **Chart.js 4.x** - Loaded via CDN
- **Chart.js Annotation Plugin** - For reference lines
- **Google Fonts** - Inter, JetBrains Mono

No build step required - all vanilla HTML/CSS/JS.

## Deployment

### GitHub Pages
```bash
# Push to gh-pages branch
git subtree push --prefix webpage origin gh-pages
```

### Netlify
1. Connect repository
2. Set publish directory: `webpage/`
3. No build command needed

### Vercel
```bash
vercel --prod
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Targets

- Initial load: < 3 seconds
- First Contentful Paint: < 1.5 seconds
- Lighthouse Score: > 90

## License

MIT License - See main repository LICENSE file.

## Citation

```bibtex
@misc{aibiomodel2026,
  title = {AI-Accelerated Biological Discovery: A Quantitative Analysis},
  author = {AI Bio Acceleration Model Project},
  year = {2026},
  url = {https://ai-bio-acceleration.github.io}
}
```
