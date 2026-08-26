/* ============================================================
   Main Entry Point
   Imports styles, reads config, injects dynamic content,
   initializes loading screen and scroll reveals.
   ============================================================ */

/* --- Style imports (order matters) --- */
import './styles/variables.css';
import './styles/base.css';
import './styles/animations.css';
import './styles/components.css';
import './styles/layout.css';
import './styles/hero.css';
import './styles/experience.css';
import './styles/smps.css';
import './styles/whyme.css';
import './styles/responsive.css';

/* --- Modules --- */
import { siteConfig, getDiscordUrl } from './data/siteConfig.js';
import { initScrollReveal } from './utils/scrollReveal.js';

/* =============================================================
   DOM READY
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  injectSocialButtons();
  injectAboutContent();
  injectExperienceContent();
  injectSkillBadges();
  injectSmpCards();
  injectWhyMeContent();
  initScrollReveal();
});

/* =============================================================
   Loading Screen
   Shows glitch animation, then exits after a short delay.
   ============================================================= */
function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;

  /* Prevent scrolling while loading */
  document.body.style.overflow = 'hidden';

  const totalDuration = 2200;

  setTimeout(() => {
    screen.classList.add('exit');
    document.body.style.overflow = '';

    /* Remove from DOM after transition completes */
    setTimeout(() => {
      screen.classList.add('hidden');
      screen.remove();
    }, 600);
  }, totalDuration);
}

/* =============================================================
   Social Buttons
   Generates buttons in both the nav and footer from config.
   ============================================================= */
function injectSocialButtons() {
  const navContainer = document.getElementById('nav-social');
  const footerContainer = document.getElementById('footer-social');

  siteConfig.socialLinks.forEach((link) => {
    const html = createSocialButtonHtml(link);

    if (navContainer) {
      navContainer.insertAdjacentHTML('beforeend', html);
    }
    if (footerContainer) {
      footerContainer.insertAdjacentHTML('beforeend', html);
    }
  });
}

function createSocialButtonHtml({ platform, url, icon }) {
  return `
    <a
      href="${url}"
      target="_blank"
      rel="noopener noreferrer"
      class="social-btn"
      aria-label="${platform}"
      title="${platform}"
    >
      ${icon}
    </a>
  `;
}

/* =============================================================
   About Me
   Shows configured text or a stylish placeholder if empty.
   ============================================================= */
function injectAboutContent() {
  const card = document.getElementById('about-card');
  if (!card) return;

  if (siteConfig.aboutText && siteConfig.aboutText.trim()) {
    card.innerHTML = `<p>${siteConfig.aboutText}</p>`;
  } else {
    card.innerHTML = `
      <div class="about-placeholder">
        <span>// About me — coming soon</span>
      </div>
    `;
  }
}

/* =============================================================
   Experience Text
   Injects the experience paragraph, splitting on newlines.
   ============================================================= */
function injectExperienceContent() {
  const panel = document.getElementById('experience-panel');
  if (!panel) return;

  const paragraphs = siteConfig.experienceText
    .split('\n\n')
    .filter((p) => p.trim())
    .map((p) => `<p>${p}</p>`)
    .join('');

  panel.innerHTML = paragraphs;
}

/* =============================================================
   Skill Badges
   Generates badges from the experienceSkills array.
   ============================================================= */
function injectSkillBadges() {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  const badges = siteConfig.experienceSkills
    .map(
      (skill, i) => `
      <span
        class="skill-badge"
        style="transition-delay: ${i * 60}ms"
      >
        ${skill}
      </span>
    `
    )
    .join('');

  grid.innerHTML = badges;
}

/* =============================================================
   SMP Cards
   Generates cards from the smpCards array.
   Empty entries render as polished placeholders.
   ============================================================= */
function injectSmpCards() {
  const grid = document.getElementById('smps-grid');
  if (!grid) return;

  const cards = siteConfig.smpCards
    .map((card, i) => {
      const isEmpty = !card.name && !card.description;

      if (isEmpty) {
        return `
          <div class="smp-card placeholder reveal" data-delay="${i * 80}">
            <span class="smp-num">0${i + 1}</span>
            <div class="smp-card-image">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15L16 10L5 21"/>
              </svg>
            </div>
            <div class="smp-placeholder-line"></div>
            <span class="smp-placeholder-text">Coming Soon</span>
          </div>
        `;
      }

      /* Filled card — gracefully handle missing optional fields */
      const imageHtml = card.image
        ? `<img src="${card.image}" alt="${card.name || 'SMP'}" loading="lazy" />`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15L16 10L5 21"/></svg>`;

      const roleHtml = card.role
        ? `<span class="smp-role">${card.role}</span>`
        : '';

      const linkHtml = card.link
        ? `<a href="${card.link}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost smp-link" style="padding:8px 18px;font-size:12px;">View</a>`
        : '';

      return `
        <div class="smp-card reveal" data-delay="${i * 80}">
          <span class="smp-num">0${i + 1}</span>
          <div class="smp-card-image">${imageHtml}</div>
          <h3>${card.name}</h3>
          <p>${card.description || ''}</p>
          ${roleHtml}
          ${linkHtml}
        </div>
      `;
    })
    .join('');

  grid.innerHTML = cards;
}

/* =============================================================
   Why Me? Content
   Injects the text with emphasis styling and Discord link.
   ============================================================= */
function injectWhyMeContent() {
  const panel = document.getElementById('whyme-panel');
  if (!panel) return;

  /* Replace the DISCORD_LINK placeholder with actual URL */
  const processedText = siteConfig.whyMeText.replace(
    'DISCORD_LINK',
    getDiscordUrl()
  );

  /* Split into paragraphs */
  const paragraphs = processedText
    .split('\n\n')
    .filter((p) => p.trim())
    .map((p) => `<p>${p}</p>`)
    .join('');

  panel.innerHTML = `<div class="whyme-text">${paragraphs}</div>`;
}
