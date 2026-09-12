// ============ LIVE FACEBOOK EMBED (optional) ============
// Facebook's Page Plugin refuses to render without a registered Facebook App ID —
// it returns "Error: Unowned Facebook Pages are not supported" instead of a feed.
// Getting an App ID takes ~2 minutes at developers.facebook.com/apps, needs only a
// Facebook login (NOT page-admin rights), and is free. Paste it below and reload —
// no other code changes needed, the live timeline will appear inside the Follow Us
// card automatically. Leave blank to keep today's static "This Week" card as-is.
const FB_APP_ID = '';

if (FB_APP_ID) {
  const fbRoot = document.createElement('div');
  fbRoot.id = 'fb-root';
  document.body.prepend(fbRoot);

  const sdkScript = document.createElement('script');
  sdkScript.async = true;
  sdkScript.defer = true;
  sdkScript.crossOrigin = 'anonymous';
  sdkScript.src = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0&appId=${FB_APP_ID}`;
  document.body.appendChild(sdkScript);

  const mount = document.getElementById('fbLiveEmbed');
  if (mount) {
    mount.style.display = 'block';
    mount.innerHTML = `<div class="fb-page"
      data-href="https://www.facebook.com/pages/Yesterdays-Bar-Grill/136270043220222"
      data-tabs="timeline" data-width="500" data-height="600"
      data-small-header="true" data-adapt-container-width="true"
      data-hide-cover="false" data-show-facepile="false"></div>`;
  }
}

// ============ NAV SCROLL STATE ============
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ============ PAGE TABS ============
const pageSections = document.querySelectorAll('.page-section');
const tabLinks = document.querySelectorAll('[data-tab]');
const validTabs = Array.from(pageSections).map(s => s.id);

function activateTab(tabId, scrollUp) {
  if (!validTabs.includes(tabId)) return;
  pageSections.forEach(s => s.classList.toggle('active', s.id === tabId));
  tabLinks.forEach(a => a.classList.toggle('active', a.dataset.tab === tabId));
  if (scrollUp) {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }
}

const heroEl = document.getElementById('home');
const homeLogoLink = document.querySelector('.nav__logo');

tabLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tabId = link.dataset.tab;
    activateTab(tabId, true);
    history.replaceState(null, '', '#' + tabId);
    heroEl.classList.add('hero--compact');
  });
});

if (homeLogoLink) {
  homeLogoLink.addEventListener('click', () => {
    heroEl.classList.remove('hero--compact');
  });
}

const initialTab = validTabs.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'about';
activateTab(initialTab, false);

// ============ GALLERY SLIDESHOW ============
const galleryPhotos = [
  { src: 'assets/hero-storefront.avif', alt: "Yesterday's Bar & Grill storefront" },
  { src: 'assets/patio.jpg', alt: "Yesterday's Bar & Grill patio seating" },
  { src: 'https://img1.wsimg.com/isteam/ip/ddb56216-83db-4108-bee1-dd2efe0a9e7f/IMG_0143.JPG/:/cr=t:12.5%25,l:0%25,w:100%25,h:75%25/rs=w:1400,h:613,cg:true', alt: 'Pool table at Yesterday\'s Bar & Grill' },
  { src: 'https://img1.wsimg.com/isteam/ip/ddb56216-83db-4108-bee1-dd2efe0a9e7f/IMG_1148.jpg/:/cr=t:43.61%25,l:0%25,w:100%25,h:56.39%25/rs=w:1400,h:788,cg:true', alt: 'Brunch plate at Yesterday\'s Bar & Grill' }
];
let galleryIndex = 0;
const galleryPhotoEl = document.getElementById('galleryPhoto');
const galleryCounterEl = document.getElementById('galleryCounter');
const gallerySlideEl = document.getElementById('gallerySlide');
const galleryPrevBtn = document.getElementById('galleryPrev');
const galleryNextBtn = document.getElementById('galleryNext');

function renderGallerySlide() {
  const photo = galleryPhotos[galleryIndex];
  galleryPhotoEl.style.opacity = 0;
  setTimeout(() => {
    galleryPhotoEl.src = photo.src;
    galleryPhotoEl.alt = photo.alt;
    galleryPhotoEl.style.opacity = 1;
  }, 150);
  galleryCounterEl.textContent = `${galleryIndex + 1} / ${galleryPhotos.length}`;
}

function goToNextSlide() {
  galleryIndex = (galleryIndex + 1) % galleryPhotos.length;
  renderGallerySlide();
}
function goToPrevSlide() {
  galleryIndex = (galleryIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
  renderGallerySlide();
}

if (gallerySlideEl) gallerySlideEl.addEventListener('click', goToNextSlide);
if (galleryNextBtn) galleryNextBtn.addEventListener('click', goToNextSlide);
if (galleryPrevBtn) galleryPrevBtn.addEventListener('click', goToPrevSlide);

// ============ MOBILE MENU ============
const burgerBtn = document.getElementById('burgerBtn');
const closeMobileMenu = document.getElementById('closeMobileMenu');
const mobileMenu = document.getElementById('mobileMenu');

burgerBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
closeMobileMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ============ TABS ============
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ============ MARQUEE SEAMLESS LOOP ============
const track = document.getElementById('marqueeTrack');
if (track) {
  track.innerHTML += track.innerHTML; // duplicate content for infinite scroll illusion
}

// ============ REVEAL ON SCROLL ============
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ============ FOOTER YEAR ============
document.getElementById('year').textContent = new Date().getFullYear();
