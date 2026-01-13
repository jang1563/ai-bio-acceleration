/**
 * AI-Accelerated Biological Discovery - Main Application
 * =======================================================
 * Handles navigation, scroll effects, and interactions
 */

// =====================================================
// PROGRESS BAR
// =====================================================

function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
}

// =====================================================
// NAVIGATION
// =====================================================

function setupNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateProgressBar();
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =====================================================
// ACTIVE SECTION HIGHLIGHTING
// =====================================================

function setupSectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// =====================================================
// PARAMETER TOOLTIPS
// =====================================================

function setupTooltips() {
    const paramRows = document.querySelectorAll('.param-row[data-tooltip]');

    paramRows.forEach(row => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = row.dataset.tooltip;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 0.85rem;
            max-width: 300px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            line-height: 1.5;
        `;

        row.style.position = 'relative';
        row.appendChild(tooltip);

        row.addEventListener('mouseenter', (e) => {
            const rect = row.getBoundingClientRect();
            tooltip.style.top = '-10px';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -100%)';
            tooltip.style.opacity = '1';
        });

        row.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
}

// =====================================================
// COPY BIBTEX
// =====================================================

function copyBibTeX() {
    const bibtex = `@misc{aibiomodel2026,
  title = {AI-Accelerated Biological Discovery: A Quantitative Analysis},
  author = {AI Bio Acceleration Model Project},
  year = {2026},
  url = {https://ai-bio-acceleration.github.io},
  note = {Accessed: ${new Date().toISOString().split('T')[0]}}
}`;

    navigator.clipboard.writeText(bibtex).then(() => {
        const btn = document.querySelector('.copy-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#28A745';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Make copyBibTeX available globally
window.copyBibTeX = copyBibTeX;

// =====================================================
// ANIMATE ON SCROLL
// =====================================================

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.summary-card, .tier-card, .takehome-card, .bottleneck-card, .resource-card'
    );

    const observerOptions = {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(el);
    });
}

// =====================================================
// PIPELINE STAGE INTERACTIONS
// =====================================================

function setupPipelineInteractions() {
    const stages = document.querySelectorAll('.pipeline-stage');

    const stageDetails = {
        1: {
            name: 'Target Identification',
            description: 'AI analyzes multi-omics data to identify disease-relevant targets',
            acceleration: '3.2x',
            mechanisms: ['Pattern recognition in genomic data', 'Literature mining', 'Knowledge graph analysis']
        },
        2: {
            name: 'Target Validation',
            description: 'AI predicts target druggability and off-target effects',
            acceleration: '2.8x',
            mechanisms: ['Protein structure prediction', 'Pathway analysis', 'Biomarker identification']
        },
        3: {
            name: 'Lead Discovery',
            description: 'AI generates and screens virtual compound libraries',
            acceleration: '4.1x',
            mechanisms: ['Generative chemistry', 'Virtual screening', 'De novo design']
        },
        4: {
            name: 'Lead Optimization',
            description: 'AI optimizes ADMET properties and selectivity',
            acceleration: '3.5x',
            mechanisms: ['Property prediction', 'Multi-objective optimization', 'Synthesis planning']
        },
        5: {
            name: 'Preclinical',
            description: 'AI predicts toxicity and selects animal models',
            acceleration: '2.4x',
            mechanisms: ['Toxicity prediction', 'PK/PD modeling', 'Species translation']
        },
        6: {
            name: 'Phase I Trials',
            description: 'AI optimizes dosing and patient selection',
            acceleration: '1.8x',
            mechanisms: ['Dose optimization', 'Safety monitoring', 'Biomarker tracking']
        },
        7: {
            name: 'Phase II Trials',
            description: 'AI enables adaptive trial designs',
            acceleration: '2.2x',
            mechanisms: ['Adaptive randomization', 'Endpoint prediction', 'Patient stratification']
        },
        8: {
            name: 'Phase III Trials',
            description: 'AI improves enrollment and reduces dropouts',
            acceleration: '1.9x',
            mechanisms: ['Site selection', 'Real-world evidence', 'Predictive enrichment']
        },
        9: {
            name: 'Regulatory Approval',
            description: 'AI assists regulatory submission and review',
            acceleration: '1.5x',
            mechanisms: ['Document automation', 'Comparability analysis', 'Risk assessment']
        },
        10: {
            name: 'Deployment',
            description: 'AI optimizes manufacturing and distribution',
            acceleration: '2.1x',
            mechanisms: ['Process optimization', 'Supply chain prediction', 'Pharmacovigilance']
        }
    };

    stages.forEach(stage => {
        stage.addEventListener('click', () => {
            const stageNum = parseInt(stage.dataset.stage);
            const details = stageDetails[stageNum];

            if (details) {
                // Create or update modal
                let modal = document.getElementById('stageModal');
                if (!modal) {
                    modal = createStageModal();
                }

                updateStageModal(modal, details);
                modal.style.display = 'flex';
            }
        });
    });
}

function createStageModal() {
    const modal = document.createElement('div');
    modal.id = 'stageModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        padding: 20px;
    `;

    modal.innerHTML = `
        <div class="modal-content" style="
            background: white;
            border-radius: 12px;
            padding: 32px;
            max-width: 500px;
            width: 100%;
            position: relative;
        ">
            <button class="modal-close" style="
                position: absolute;
                top: 16px;
                right: 16px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #777;
            ">&times;</button>
            <h3 class="modal-title" style="margin-bottom: 8px; color: #1a1a1a;"></h3>
            <p class="modal-acceleration" style="
                color: #2E86AB;
                font-weight: 600;
                margin-bottom: 16px;
            "></p>
            <p class="modal-description" style="
                color: #555;
                margin-bottom: 16px;
                line-height: 1.6;
            "></p>
            <div class="modal-mechanisms">
                <h4 style="font-size: 0.9rem; color: #777; margin-bottom: 8px;">AI Mechanisms:</h4>
                <ul style="
                    list-style: none;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                "></ul>
            </div>
        </div>
    `;

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close on button click
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });

    document.body.appendChild(modal);
    return modal;
}

function updateStageModal(modal, details) {
    modal.querySelector('.modal-title').textContent = details.name;
    modal.querySelector('.modal-acceleration').textContent = `AI Acceleration: ${details.acceleration}`;
    modal.querySelector('.modal-description').textContent = details.description;

    const ul = modal.querySelector('.modal-mechanisms ul');
    ul.innerHTML = details.mechanisms.map(m => `
        <li style="
            padding: 8px 12px;
            background: #f5f5f5;
            border-radius: 6px;
            font-size: 0.9rem;
            color: #555;
        ">• ${m}</li>
    `).join('');
}

// =====================================================
// SHARE FUNCTIONALITY
// =====================================================

function setupShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent('AI-Accelerated Biological Discovery: A Quantitative Model');

    shareButtons.forEach(btn => {
        if (btn.classList.contains('twitter')) {
            btn.href = `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`;
        } else if (btn.classList.contains('linkedin')) {
            btn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
        }
    });
}

// =====================================================
// ACCORDION FUNCTIONALITY
// =====================================================

function setupAccordions() {
    const details = document.querySelectorAll('.method-detail');

    details.forEach(detail => {
        const summary = detail.querySelector('summary');

        summary.addEventListener('click', (e) => {
            // Close other open details
            details.forEach(other => {
                if (other !== detail && other.open) {
                    other.open = false;
                }
            });
        });
    });
}

// =====================================================
// KEYBOARD NAVIGATION
// =====================================================

function setupKeyboardNavigation() {
    const sections = ['summary', 'model', 'results', 'uncertainty', 'policy', 'methods'];
    let currentIndex = 0;

    document.addEventListener('keydown', (e) => {
        // Arrow keys to navigate sections (only when not in form/input)
        if (document.activeElement.tagName === 'INPUT' ||
            document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        if (e.key === 'ArrowDown' || e.key === 'j') {
            e.preventDefault();
            currentIndex = Math.min(currentIndex + 1, sections.length - 1);
            document.getElementById(sections[currentIndex])?.scrollIntoView({ behavior: 'smooth' });
        } else if (e.key === 'ArrowUp' || e.key === 'k') {
            e.preventDefault();
            currentIndex = Math.max(currentIndex - 1, 0);
            document.getElementById(sections[currentIndex])?.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// =====================================================
// PRINT FUNCTIONALITY
// =====================================================

function setupPrintButton() {
    // Add print button if needed
    window.addEventListener('beforeprint', () => {
        // Expand all accordions for printing
        document.querySelectorAll('.method-detail').forEach(d => d.open = true);
    });

    window.addEventListener('afterprint', () => {
        // Collapse accordions after printing
        document.querySelectorAll('.method-detail').forEach(d => d.open = false);
    });
}

// =====================================================
// LAZY LOADING FOR CHARTS
// =====================================================

function setupLazyCharts() {
    const chartContainers = document.querySelectorAll('.chart-container');

    const observerOptions = {
        rootMargin: '100px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    chartContainers.forEach(container => observer.observe(container));
}

// =====================================================
// INITIALIZE APP
// =====================================================

function initializeApp() {
    setupNavigation();
    setupSectionObserver();
    setupTooltips();
    setupScrollAnimations();
    setupPipelineInteractions();
    setupShareButtons();
    setupAccordions();
    setupKeyboardNavigation();
    setupPrintButton();
    setupLazyCharts();

    // Initial progress bar update
    updateProgressBar();

    console.log('AI Bio Acceleration Model - App initialized');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
