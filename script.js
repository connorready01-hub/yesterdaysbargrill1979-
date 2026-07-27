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
    if (link.dataset.anchor) {
      requestAnimationFrame(() => {
        const target = document.getElementById(link.dataset.anchor);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
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
  { src: 'assets/gallery/gallery-60.jpeg', alt: 'Pool hall with multiple tables at Yesterday\'s Bar & Grill' },
  { src: 'assets/gallery/gallery-14.png', alt: 'Karbach Brewing sign with weekly specials' },
  { src: 'assets/gallery/gallery-41.png', alt: 'Vendor booth with hats and shirts at an outdoor event' },
  { src: 'assets/gallery/gallery-27.png', alt: 'Crawfish boil with corn and potatoes' },
  { src: 'assets/gallery/gallery-04.png', alt: 'Two Michelob Ultra beers' },
  { src: 'assets/gallery/gallery-45.png', alt: 'Musician playing guitar on stage at an outdoor event' },
  { src: 'assets/gallery/gallery-30.png', alt: 'Two friends posing by the crawfish boil setup' },
  { src: 'assets/gallery/gallery-19.png', alt: 'Group of friends walking through the patio' },
  { src: 'assets/gallery/gallery-38.png', alt: 'Guests sampling chili entries at a cook-off event' },
  { src: 'assets/gallery/gallery-09.png', alt: 'Bucket of beers on ice' },
  { src: 'assets/gallery/gallery-24.png', alt: 'Two wing baskets on an outdoor table' },
  { src: 'assets/gallery/gallery-16.png', alt: 'Bloody Mary with bacon and pickled garnishes' },
  { src: 'assets/gallery/gallery-42.png', alt: 'Vendor booth at an outdoor event' },
  { src: 'assets/gallery/gallery-22.png', alt: 'TVs and beer bottles at the bar' },
  { src: 'assets/gallery/gallery-02.png', alt: 'Friends holding drinks together on the patio' },
  { src: 'assets/gallery/gallery-33.png', alt: 'Bartender pouring a drink from a shaker tin' },
  { src: 'assets/gallery/gallery-46.png', alt: 'Basket of fried appetizers and dipping sauce' },
  { src: 'assets/gallery/gallery-12.png', alt: 'Two baskets of wings on an outdoor table' },
  { src: 'assets/gallery/gallery-25.png', alt: 'Cheeseburger and fries in a basket' },
  { src: 'assets/gallery/gallery-06.png', alt: 'Guests smiling on the patio' },
  { src: 'assets/gallery/gallery-39.png', alt: 'Bartender serving drinks at an outdoor booth' },
  { src: 'assets/gallery/gallery-20.png', alt: 'Singo Night Monday event flyer' },
  { src: 'assets/gallery/gallery-31.png', alt: 'Two friends smiling under a tree' },
  { src: 'assets/gallery/gallery-08.png', alt: 'Baskets of wings and canned drinks' },
  { src: 'assets/gallery/gallery-44.png', alt: 'Band performing on stage at an outdoor event' },
  { src: 'assets/gallery/gallery-28.png', alt: 'Two cans toasting on the patio' },
  { src: 'assets/gallery/gallery-17.png', alt: 'Live band performing on the covered patio' },
  { src: 'assets/gallery/gallery-13.png', alt: 'Guests watching a game on the TVs' },
  { src: 'assets/gallery/gallery-01.png', alt: 'Bartender pouring a drink at Yesterday\'s Bar & Grill' },
  { src: 'assets/gallery/gallery-47.png', alt: 'Spicy cocktail with hot sauce bottles' },
  { src: 'assets/gallery/gallery-34.png', alt: 'Assorted cocktails lined up on the patio table' },
  { src: 'assets/gallery/gallery-21.png', alt: 'Bacon cheeseburger with tater tots' },
  { src: 'assets/gallery/gallery-05.png', alt: 'Margaritas and cocktails on the patio table' },
  { src: 'assets/gallery/gallery-40.png', alt: 'Group photo with award certificates' },
  { src: 'assets/gallery/gallery-15.png', alt: '$1 wings basket' },
  { src: 'assets/gallery/gallery-23.png', alt: 'Pool balls and a menu on the pool table' },
  { src: 'assets/gallery/gallery-10.png', alt: 'Corn dogs on the pool table' },
  { src: 'assets/gallery/gallery-32.png', alt: 'Group photo with a folklorico dance troupe' },
  { src: 'assets/gallery/gallery-03.png', alt: 'Covered patio seating area' },
  { src: 'assets/gallery/gallery-29.png', alt: 'Three beer glasses at the bar' },
  { src: 'assets/gallery/gallery-43.png', alt: 'Championship chili team booth tent' },
  { src: 'assets/gallery/gallery-18.png', alt: 'Busch Light Apple boxes with an Aggie flag' },
  { src: 'assets/gallery/gallery-11.png', alt: 'Live musician performing on the patio' },
  { src: 'assets/gallery/gallery-26.png', alt: 'Two friends toasting with canned drinks on the patio' },
  { src: 'assets/gallery/gallery-07.png', alt: 'Bartender holding bottles of whiskey' },
  { src: 'assets/gallery/gallery-35.png', alt: 'Two friends toasting with red cans on the patio' },
  { src: 'assets/gallery/gallery-36.png', alt: 'Beer in a Texas A&M pint glass with a lime' },
  { src: 'assets/gallery/gallery-37.png', alt: 'Bloody Mary with bacon and pickled garnishes on the bar' },
  { src: 'assets/gallery/gallery-49.png', alt: 'Burger and fries with a Budweiser draft beer' },
  { src: 'assets/gallery/gallery-50.png', alt: 'Burger and fries next to a Budweiser draft with dart boards in the background' },
  { src: 'assets/gallery/gallery-51.png', alt: 'Two guests holding the Yesterdays sign at an outdoor event' },
  { src: 'assets/gallery/gallery-52.png', alt: 'Friends playing Singo at a table inside Yesterdays' },
  { src: 'assets/gallery/gallery-53.png', alt: 'Bartenders behind the bar with the game on in the background' },
  { src: 'assets/gallery/gallery-54.png', alt: 'Friends in Texas A&M jerseys sitting outside' },
  { src: 'assets/gallery/gallery-55.png', alt: 'Friends at the bar holding bottles' },
  { src: 'assets/gallery/gallery-56.png', alt: 'Two friends holding Miller High Life bottles' },
  { src: 'assets/gallery/gallery-57.png', alt: 'Group photo on the patio celebrating St. Patrick\'s Day' },
  { src: 'assets/gallery/gallery-58.jpeg', alt: 'Row of dartboards and scoreboards at Yesterday\'s Bar & Grill' },
  { src: 'assets/gallery/gallery-59.jpeg', alt: 'Shuffleboard table at Yesterday\'s Bar & Grill' }
];
let galleryIndex = 0;
const galleryGridEl = document.getElementById('galleryGrid');
const lightboxEl = document.getElementById('galleryLightbox');
const lightboxImgEl = document.getElementById('galleryLightboxImg');
const lightboxCounterEl = document.getElementById('galleryLightboxCounter');
const lightboxCloseBtn = document.getElementById('galleryLightboxClose');
const lightboxPrevBtn = document.getElementById('galleryLightboxPrev');
const lightboxNextBtn = document.getElementById('galleryLightboxNext');

function renderGalleryGrid() {
  galleryGridEl.innerHTML = galleryPhotos.map((photo, i) =>
    `<img src="${photo.src}" alt="${photo.alt}" loading="lazy" data-index="${i}">`
  ).join('');
  galleryGridEl.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', () => openLightbox(Number(img.dataset.index)));
  });
}

function updateLightbox() {
  const photo = galleryPhotos[galleryIndex];
  lightboxImgEl.src = photo.src;
  lightboxImgEl.alt = photo.alt;
  lightboxCounterEl.textContent = `${galleryIndex + 1} / ${galleryPhotos.length}`;
}

function openLightbox(index) {
  galleryIndex = index;
  updateLightbox();
  lightboxEl.classList.add('open');
}

function closeLightbox() {
  lightboxEl.classList.remove('open');
}

function goToNextSlide() {
  galleryIndex = (galleryIndex + 1) % galleryPhotos.length;
  updateLightbox();
}
function goToPrevSlide() {
  galleryIndex = (galleryIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
  updateLightbox();
}

renderGalleryGrid();
if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', goToNextSlide);
if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', goToPrevSlide);
if (lightboxEl) lightboxEl.addEventListener('click', (e) => { if (e.target === lightboxEl) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightboxEl.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') goToNextSlide();
  if (e.key === 'ArrowLeft') goToPrevSlide();
});

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

// ============ TODAY'S DEALS POPUP ============
const dailyDeals = {
  0: { title: "Sunday Funday", items: ['<b>$10</b> Mimosa Pitcher', '<b>$4.50</b> House Bloody Mary', '<b>$1</b> Hotdogs', 'Free pool til 2pm · DJ Rob 1–4pm'] },
  1: { title: "Singo Night", items: ['<b>$4</b> Domestic Drafts + Freezer Shots', '<b>$2</b> Footlong Corndog', 'Singo (musical bingo) 7–10pm'] },
  2: { title: "Texas Night", items: ['<b>$5</b> Texas Liquor', '<b>$1 off</b> Texas Beer', '<b>$15</b> BOGO Yesterday\'s Burger', 'Free pool w/ college ID'] },
  3: { title: "Karaoke Night", items: ['<b>$3</b> Wells', '<b>$3.50</b> Domestic Bottles', '<b>½ off</b> Appetizers', 'Karaoke kicks off 8pm'] },
  4: { title: "Wing Night", items: ['<b>$5</b> Select Liquors', '<b>$5</b> Import Bottles', '<b>$1</b> Wings'] },
  5: { title: "Live Music Friday", items: ['Live band 8–11pm', 'Full food & cocktail menu all night', 'Patio seating, first come first served'] },
  6: { title: "Saturday on the Patio", items: ['Full food & cocktail menu', 'Pool, darts & shuffleboard all day', 'Brunch bar back tomorrow 10am–2pm'] }
};
const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function initDealsPopup() {
  const today = new Date().getDay();
  const deal = dailyDeals[today];
  if (!deal) return;

  const popupEl = document.getElementById('dealsPopup');
  const titleEl = document.getElementById('dealsPopupTitle');
  const listEl = document.getElementById('dealsPopupList');
  const closeBtn = document.getElementById('dealsPopupClose');
  const linkEl = document.getElementById('dealsPopupLink');
  const fabEl = document.getElementById('dealsFab');
  if (!popupEl) return;

  titleEl.textContent = `${dayNames[today]} — ${deal.title}`;
  listEl.innerHTML = deal.items.map(item => `<li>${item}</li>`).join('');

  // highlight today's card in the Daily Deals grid, if present
  document.querySelectorAll('.day-card').forEach(card => {
    card.classList.toggle('day-card--today', Number(card.dataset.day) === today);
  });

  function openPopup() {
    popupEl.classList.add('show');
    fabEl.classList.remove('show');
  }
  function closePopup() {
    popupEl.classList.remove('show');
    fabEl.classList.add('show');
    try { sessionStorage.setItem('dealsPopupSeen', String(today)); } catch (e) {}
  }

  closeBtn.addEventListener('click', closePopup);
  linkEl.addEventListener('click', closePopup);
  fabEl.addEventListener('click', openPopup);

  let alreadySeenToday = false;
  try { alreadySeenToday = sessionStorage.getItem('dealsPopupSeen') === String(today); } catch (e) {}

  if (alreadySeenToday) {
    fabEl.classList.add('show');
  } else {
    let triggered = false;
    window.addEventListener('scroll', () => {
      if (triggered) return;
      if (window.scrollY > window.innerHeight * 0.3) {
        triggered = true;
        openPopup();
      }
    }, { passive: true });
  }
}
initDealsPopup();

