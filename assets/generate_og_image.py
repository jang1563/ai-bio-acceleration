#!/usr/bin/env python3
"""
Generate Open Graph image for social sharing (1200x630px)
Creates a visually compelling summary image for Twitter/LinkedIn/Facebook
"""

import numpy as np
from pathlib import Path

try:
    import matplotlib.pyplot as plt
    import matplotlib.patches as mpatches
    from matplotlib.patches import FancyBboxPatch, Rectangle
    HAS_MATPLOTLIB = True
except ImportError:
    HAS_MATPLOTLIB = False
    print("matplotlib not available, generating SVG fallback")

OUTPUT_DIR = Path(__file__).parent

# Colors
COLORS = {
    'primary': '#2E86AB',
    'primary_dark': '#1a5a7a',
    'accent': '#F18F01',
    'success': '#28A745',
    'warning': '#DC3545',
    'dark': '#1a1a1a',
    'light': '#f5f5f5',
    'white': '#ffffff',
}

def generate_og_image_matplotlib():
    """Generate OG image using matplotlib"""

    fig, ax = plt.subplots(figsize=(12, 6.3), dpi=100)
    fig.patch.set_facecolor(COLORS['dark'])
    ax.set_facecolor(COLORS['dark'])

    # Remove axes
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6.3)
    ax.axis('off')

    # Background gradient effect (simulated with rectangles)
    for i in range(20):
        alpha = 0.02 * (20 - i) / 20
        rect = Rectangle((0, 0), 12, 6.3,
                         facecolor=COLORS['primary'],
                         alpha=alpha * 0.5,
                         transform=ax.transData)
        ax.add_patch(rect)

    # Main title
    ax.text(0.5, 5.5, 'AI-Accelerated Biological Discovery',
            fontsize=32, fontweight='bold', color=COLORS['white'],
            ha='left', va='top', fontfamily='sans-serif')

    # Subtitle
    ax.text(0.5, 4.8, 'A Quantitative Model',
            fontsize=18, color=COLORS['primary'],
            ha='left', va='top', fontfamily='sans-serif')

    # Key stat box
    stat_box = FancyBboxPatch((0.5, 2.2), 4.5, 2.2,
                               boxstyle="round,pad=0.1,rounding_size=0.2",
                               facecolor=COLORS['primary'],
                               edgecolor='none',
                               alpha=0.9)
    ax.add_patch(stat_box)

    ax.text(2.75, 3.9, '3.4x – 9.2x',
            fontsize=36, fontweight='bold', color=COLORS['white'],
            ha='center', va='center', fontfamily='sans-serif')
    ax.text(2.75, 3.0, 'Acceleration by 2050',
            fontsize=14, color=COLORS['white'],
            ha='center', va='center', fontfamily='sans-serif', alpha=0.9)
    ax.text(2.75, 2.5, '80% Confidence Interval',
            fontsize=11, color=COLORS['white'],
            ha='center', va='center', fontfamily='sans-serif', alpha=0.7)

    # Secondary stats
    stats = [
        ('5.7x', 'Mean'),
        ('$47T', 'Value'),
        ('91.5%', 'AI Sensitivity'),
    ]

    for i, (value, label) in enumerate(stats):
        x = 5.8 + i * 2
        ax.text(x, 3.6, value,
                fontsize=24, fontweight='bold', color=COLORS['accent'],
                ha='center', va='center', fontfamily='sans-serif')
        ax.text(x, 2.9, label,
                fontsize=11, color=COLORS['light'],
                ha='center', va='center', fontfamily='sans-serif', alpha=0.8)

    # Bottom tagline
    ax.text(0.5, 1.2, 'Monte Carlo simulation • Sobol sensitivity analysis • Policy ROI rankings',
            fontsize=12, color=COLORS['light'],
            ha='left', va='center', fontfamily='sans-serif', alpha=0.6)

    # URL
    ax.text(11.5, 0.4, 'ai-bio-acceleration.github.io',
            fontsize=10, color=COLORS['primary'],
            ha='right', va='center', fontfamily='sans-serif')

    # Mini trajectory chart (simplified)
    years = np.linspace(0, 5, 50)
    baseline = 1 + years * 0.8 + 0.1 * years**2

    # Scale and position
    chart_x = years * 0.4 + 0.5
    chart_y = baseline * 0.15 + 0.3

    ax.fill_between(chart_x, chart_y * 0.7, chart_y * 1.3,
                    color=COLORS['primary'], alpha=0.2)
    ax.plot(chart_x, chart_y, color=COLORS['accent'], linewidth=2)

    plt.tight_layout(pad=0)

    # Save
    fig.savefig(OUTPUT_DIR / 'og-image.png',
                dpi=100,
                facecolor=COLORS['dark'],
                bbox_inches='tight',
                pad_inches=0)
    plt.close()

    print(f"Generated: {OUTPUT_DIR / 'og-image.png'}")


def generate_og_image_svg():
    """Generate OG image as SVG (fallback if matplotlib not available)"""

    svg_content = '''<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2d2d2d;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#2E86AB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a5a7a;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg-gradient)"/>

  <!-- Decorative elements -->
  <circle cx="1100" cy="100" r="200" fill="#2E86AB" opacity="0.1"/>
  <circle cx="100" cy="530" r="150" fill="#F18F01" opacity="0.1"/>

  <!-- Main title -->
  <text x="60" y="120" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">
    AI-Accelerated Biological Discovery
  </text>

  <!-- Subtitle -->
  <text x="60" y="170" font-family="Arial, sans-serif" font-size="24" fill="#2E86AB">
    A Quantitative Model
  </text>

  <!-- Main stat box -->
  <rect x="60" y="220" width="400" height="200" rx="16" fill="url(#accent-gradient)"/>

  <text x="260" y="310" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="#ffffff" text-anchor="middle">
    3.4x – 9.2x
  </text>
  <text x="260" y="360" font-family="Arial, sans-serif" font-size="20" fill="#ffffff" opacity="0.9" text-anchor="middle">
    Acceleration by 2050
  </text>
  <text x="260" y="395" font-family="Arial, sans-serif" font-size="14" fill="#ffffff" opacity="0.7" text-anchor="middle">
    80% Confidence Interval
  </text>

  <!-- Secondary stats -->
  <g transform="translate(520, 280)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="#F18F01" text-anchor="middle">5.7x</text>
    <text x="0" y="40" font-family="Arial, sans-serif" font-size="16" fill="#cccccc" text-anchor="middle">Mean</text>
  </g>

  <g transform="translate(700, 280)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="#F18F01" text-anchor="middle">$47T</text>
    <text x="0" y="40" font-family="Arial, sans-serif" font-size="16" fill="#cccccc" text-anchor="middle">Value</text>
  </g>

  <g transform="translate(880, 280)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="#F18F01" text-anchor="middle">91.5%</text>
    <text x="0" y="40" font-family="Arial, sans-serif" font-size="16" fill="#cccccc" text-anchor="middle">AI Sensitivity</text>
  </g>

  <!-- Mini chart -->
  <path d="M 60 550 Q 200 520 350 480 T 550 400" stroke="#F18F01" stroke-width="3" fill="none"/>
  <path d="M 60 550 Q 200 520 350 480 T 550 400 L 550 550 L 60 550 Z" fill="#2E86AB" opacity="0.2"/>

  <!-- Bottom tagline -->
  <text x="60" y="590" font-family="Arial, sans-serif" font-size="16" fill="#888888">
    Monte Carlo simulation • Sobol sensitivity analysis • Policy ROI rankings
  </text>

  <!-- URL -->
  <text x="1140" y="600" font-family="Arial, sans-serif" font-size="14" fill="#2E86AB" text-anchor="end">
    ai-bio-acceleration.github.io
  </text>
</svg>'''

    with open(OUTPUT_DIR / 'og-image.svg', 'w') as f:
        f.write(svg_content)

    print(f"Generated: {OUTPUT_DIR / 'og-image.svg'}")


def main():
    print("Generating Open Graph image (1200x630)...")

    if HAS_MATPLOTLIB:
        generate_og_image_matplotlib()

    # Always generate SVG as backup
    generate_og_image_svg()

    print("\nDone! Use og-image.png for social sharing.")
    print("Update <meta property='og:image'> in index.html to point to the hosted URL.")


if __name__ == '__main__':
    main()
