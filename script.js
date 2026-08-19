// ============ ALWAYS START AT THE TOP ============
// If the page loads with a URL hash (e.g. "#about"), browsers automatically
// jump straight to that section on load, skipping past the hero entirely.
// Since our own tab-switching code sets a hash on every navigation, simply
// reloading the page (or revisiting a saved/shared link) would land partway
// down the page instead of at the top. We still honor the hash to pick the
// right tab (further down), but always force the scroll position itself
// back to the very top so the hero is never skipped.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});
// Real devices can take longer to finish loading images/fonts than a local
// test does, and the page's height (and any lingering hash-jump) can keep
// shifting during that time. Keep re-asserting the top position briefly
// after load, but stop the instant the person actually tries to scroll —
// this only ever corrects an unwanted automatic jump, never fights a real
// scroll gesture.
let scrollLockUntil = Date.now() + 1500;
let userInteracted = false;
['touchstart', 'wheel', 'keydown'].forEach(evt => {
  window.addEventListener(evt, () => { userInteracted = true; }, { passive: true, once: true });
});
function enforceScrollTop() {
  if (userInteracted || Date.now() > scrollLockUntil) return;
  if (window.scrollY > 0) window.scrollTo(0, 0);
  requestAnimationFrame(enforceScrollTop);
}
requestAnimationFrame(enforceScrollTop);

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
  if (tabId === 'menu') resetMenuSubtabs();
  if (scrollUp) {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }
}

function resetMenuSubtabs() {
  const foodBtn = document.querySelector('.tab-btn[data-tab="food"]');
  const foodPanel = document.getElementById('food');
  if (!foodBtn || !foodPanel) return;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === foodBtn));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p === foodPanel));
}

const heroEl = document.getElementById('home');
const homeLogoLink = document.querySelector('.nav__logo');

tabLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tabId = link.dataset.tab;
    activateTab(tabId, !link.dataset.anchor);
    history.replaceState(null, '', '#' + tabId);
    heroEl.classList.add('hero--compact');
    if (link.dataset.anchor) {
      const doScroll = () => {
        const target = document.getElementById(link.dataset.anchor);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      let scrolled = false;
      const scrollAfterSettle = () => {
        if (scrolled) return;
        scrolled = true;
        setTimeout(doScroll, 150);
      };
      const onTransitionEnd = (ev) => {
        if (ev.target !== heroEl) return;
        heroEl.removeEventListener('transitionend', onTransitionEnd);
        scrollAfterSettle();
      };
      heroEl.addEventListener('transitionend', onTransitionEnd);
      // fallback in case transitionend doesn't fire (e.g. hero already compact, no transition triggered)
      setTimeout(() => {
        heroEl.removeEventListener('transitionend', onTransitionEnd);
        scrollAfterSettle();
      }, 600);
    }
  });
});

if (homeLogoLink) {
  homeLogoLink.addEventListener('click', (e) => {
    e.preventDefault();
    activateTab('about', true);
    history.replaceState(null, '', '#home');
    heroEl.classList.remove('hero--compact');
    resetMenuSubtabs();
    const lb = document.getElementById('galleryLightbox');
    if (lb) lb.classList.remove('open');
    const mm = document.getElementById('mobileMenu');
    if (mm) mm.classList.remove('open');
  });
}

const initialTab = validTabs.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'about';
activateTab(initialTab, false);
window.scrollTo(0, 0);
requestAnimationFrame(() => window.scrollTo(0, 0));
setTimeout(() => window.scrollTo(0, 0), 150);
setTimeout(() => window.scrollTo(0, 0), 400);

// ============ GALLERY SLIDESHOW ============
const galleryPhotos = [
  { src: 'assets/gallery/gallery-60.jpeg', alt: 'Pool hall with multiple tables at Yesterdays Bar & Grill' },
  { src: 'assets/gallery/gallery-62.png', alt: 'Yesterdays staff smiling with liquor bottles on the patio' },
  { src: 'assets/gallery/gallery-63.jpg', alt: 'Queen of Hearts Raffle flyer, every Sunday 1-4pm' },
  { src: 'assets/gallery/gallery-64.jpg', alt: 'Youth basketball team photo on the patio' },
  { src: 'assets/gallery/gallery-66.jpg', alt: 'Queen of Hearts Raffle drawing on the patio' },
  { src: 'assets/gallery/gallery-67.jpg', alt: 'Guest holding a raffle card at the Queen of Hearts drawing' },
  { src: 'assets/gallery/gallery-65.jpg', alt: 'Eley Buck Davis live music flyer at Yesterdays Bar & Grill' },
  { src: 'assets/gallery/gallery-70.jpg', alt: 'Chris Helms live music flyer at Yesterdays Bar & Grill' },
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
  { src: 'assets/gallery/gallery-01.png', alt: 'Bartender pouring a drink at Yesterdays Bar & Grill' },
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
  { src: 'assets/gallery/gallery-58.jpeg', alt: 'Row of dartboards and scoreboards at Yesterdays Bar & Grill' },
  { src: 'assets/gallery/gallery-59.jpeg', alt: 'Shuffleboard table at Yesterdays Bar & Grill' }
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

// ============ DIRECTIONS DROPDOWN ============
const directionsBtn = document.getElementById('directionsBtn');
const directionsPanel = document.getElementById('directionsPanel');
if (directionsBtn && directionsPanel) {
  directionsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    directionsPanel.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!directionsPanel.contains(e.target) && e.target !== directionsBtn) {
      directionsPanel.classList.remove('open');
    }
  });
}
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

// Safety net: some mobile browsers can be unreliable about firing IntersectionObserver
// callbacks in a timely way (especially right after a tab switch triggers a layout change).
// Force-reveal anything still hidden shortly after it should reasonably be visible, so
// content/photos never get stuck invisible waiting on an observer that didn't fire.
function forceRevealVisible() {
  document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
      el.classList.add('is-visible');
      revealObserver.unobserve(el);
    }
  });
}
setInterval(forceRevealVisible, 700);

// ============ FOOTER YEAR ============
document.getElementById('year').textContent = new Date().getFullYear();

// ============ TODAY'S DEALS POPUP ============
const dailyDeals = {
  0: { title: "Sunday Funday", items: ['<b>$10</b> Mimosa Pitcher', '<b>$3</b> Margaritas', '<b>$4.50</b> Bloody Mary', '<b>$1</b> Hotdogs', 'Free pool til 2pm · DJ Rob starts 2pm', 'Queen of Hearts Raffle 1–4pm · drawing at 4pm'] },
  1: { title: "Singo Night", items: ['<b>$4</b> Domestic Drafts + Freezer Shots', '<b>$2</b> Footlong Corndog', 'Singo (musical bingo) 7–10pm'] },
  2: { title: "Texas Night", items: ['<b>$5</b> Texas Liquor', '<b>$1 off</b> Texas Beer', '<b>$15</b> BOGO Yesterdays Burger', 'Free pool w/ college ID'] },
  3: { title: "Karaoke Night", items: ['<b>$3</b> Wells', '<b>$3.50</b> Domestic Bottles', '<b>½ off</b> Appetizers', 'Karaoke kicks off 8pm'] },
  4: { title: "Dollar Wing Day", items: ['<b>$5</b> Select Liquors', '<b>$5</b> Import Bottles', '<b>$1</b> Wings'] },
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
  const tourneyBtn = document.querySelector('.deals-popup__tourney-btn');
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
  if (tourneyBtn) tourneyBtn.addEventListener('click', closePopup);
  fabEl.addEventListener('click', openPopup);

  let alreadySeenToday = false;
  try { alreadySeenToday = sessionStorage.getItem('dealsPopupSeen') === String(today); } catch (e) {}

  if (alreadySeenToday) {
    fabEl.classList.add('show');
  } else {
    let triggered = false;
    window.addEventListener('scroll', () => {
      if (triggered) return;
      if (window.scrollY > window.innerHeight * 1.1) {
        triggered = true;
        openPopup();
      }
    }, { passive: true });
  }
}
initDealsPopup();


// ============ CALENDAR MODAL ============
const calendarDayOfWeekInfo = {
  0: { title: 'Sunday Funday & Queen of Hearts', text: "$10 Mimosa Pitcher, $3 Margaritas, $4.50 Bloody Mary, free pool til 2pm, DJ Rob starts 2pm, and the Queen of Hearts Raffle 1–4pm (drawing at 4pm)." },
  1: { title: 'Singo Night', text: 'Bingo with a musical twist, 7–10pm. $4 domestic drafts, $4 Fireball/Jäger/Skrewball/Texas Ranger, $2 footlong corndogs.' },
  3: { title: 'Karaoke Night', text: '$3 wells, $3.50 domestic bottles, and half off appetizers all night long.' },
  5: { title: 'Live Music Fridays', text: 'Live music 8–11pm on the patio, plus the full food & cocktail menu all night.' }
};
// special one-off event dates: key is "YYYY-M-D" (month is 0-indexed)
const calendarSpecialEvents = {
  '2026-7-22': { title: 'Pool & Dart Tournament', text: "Hosted by Aggieland Ducks Unlimited. Check-in 4:00pm, start 5:30pm. Pool $20 early / $25 after Aug 21st. Darts $10 early / $15 after Aug 21st. Cash prizes and merch." }
};

function renderCalendar() {
  const gridEl = document.getElementById('calendarGrid');
  const labelEl = document.getElementById('calendarMonthLabel');
  const detailEl = document.getElementById('calendarDetail');
  if (!gridEl || !labelEl) return;
  if (detailEl) { detailEl.classList.remove('show'); detailEl.innerHTML = ''; }

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  labelEl.textContent = `${monthNames[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = '';
  ['S','M','T','W','T','F','S'].forEach(d => {
    html += `<div class="calendar-grid__dow">${d}</div>`;
  });
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="calendar-grid__day calendar-grid__day--empty"></div>`;
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dow = new Date(year, month, day).getDay();
    const isToday = day === today.getDate();
    const key = `${year}-${month}-${day}`;
    const hasEvent = calendarDayOfWeekInfo[dow] || calendarSpecialEvents[key];
    let dots = '';
    if (dow === 0) dots += '<span class="calendar-dot calendar-dot--sun"></span>';
    if (dow === 1) dots += '<span class="calendar-dot calendar-dot--mon"></span>';
    if (dow === 3) dots += '<span class="calendar-dot calendar-dot--wed"></span>';
    if (dow === 5) dots += '<span class="calendar-dot calendar-dot--fri"></span>';
    if (calendarSpecialEvents[key]) dots += '<span class="calendar-dot calendar-dot--event"></span>';
    html += `<div class="calendar-grid__day${isToday ? ' calendar-grid__day--today' : ''}${hasEvent ? ' calendar-grid__day--has-event' : ''}" data-key="${key}" data-dow="${dow}">
      <span>${day}</span>
      <div class="calendar-grid__dots">${dots}</div>
    </div>`;
  }
  gridEl.innerHTML = html;

  gridEl.querySelectorAll('.calendar-grid__day--has-event').forEach(dayEl => {
    dayEl.addEventListener('click', () => {
      gridEl.querySelectorAll('.calendar-grid__day--selected').forEach(el => el.classList.remove('calendar-grid__day--selected'));
      dayEl.classList.add('calendar-grid__day--selected');
      const key = dayEl.dataset.key;
      const dow = Number(dayEl.dataset.dow);
      // prefer the specific one-off event over the recurring day-of-week info
      const info = calendarSpecialEvents[key] || calendarDayOfWeekInfo[dow];
      if (!info || !detailEl) return;
      const dayNum = dayEl.querySelector('span').textContent;
      detailEl.innerHTML = `
        <div class="calendar-detail__date">${monthNames[month]} ${dayNum}</div>
        <div class="calendar-detail__title">${info.title}</div>
        <div class="calendar-detail__text">${info.text}</div>
      `;
      detailEl.classList.add('show');
    });
  });
}


const calendarStatBtn = document.getElementById('calendarStatBtn');
const calendarModal = document.getElementById('calendarModal');
const calendarModalClose = document.getElementById('calendarModalClose');

if (calendarStatBtn && calendarModal) {
  calendarStatBtn.addEventListener('click', () => {
    renderCalendar();
    calendarModal.classList.add('open');
  });
}
if (calendarModalClose) {
  calendarModalClose.addEventListener('click', () => calendarModal.classList.remove('open'));
}
if (calendarModal) {
  calendarModal.addEventListener('click', (e) => { if (e.target === calendarModal) calendarModal.classList.remove('open'); });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && calendarModal && calendarModal.classList.contains('open')) {
    calendarModal.classList.remove('open');
  }
});

// ============ ABOUT PAGE PHOTO ROTATION (changes weekly) ============
const aboutPhotoRotation = [
  { src: 'assets/gallery/gallery-62.png', alt: "Yesterdays staff smiling with liquor bottles on the patio" },
  { src: 'assets/gallery/gallery-54.png', alt: 'Friends in Texas A&M jerseys sitting outside' },
  { src: 'assets/gallery/gallery-56.png', alt: 'Two friends holding Miller High Life bottles' },
  { src: 'assets/gallery/gallery-06.png', alt: 'Guests smiling on the patio' },
  { src: 'assets/gallery/gallery-19.png', alt: 'Group of friends walking through the patio' },
  { src: 'assets/gallery/gallery-55.png', alt: 'Friends at the bar holding bottles' },
  { src: 'assets/gallery/gallery-35.png', alt: 'Two friends toasting with red cans on the patio' },
  { src: 'assets/gallery/gallery-31.png', alt: 'Two friends smiling under a tree' }
];
function initAboutPhotoRotation() {
  const imgEl = document.getElementById('aboutMainPhoto');
  if (!imgEl) return;
  // rolling week counter since the Unix epoch — increments every 7 days, same for everyone
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const choice = aboutPhotoRotation[weekNumber % aboutPhotoRotation.length];
  imgEl.src = choice.src;
  imgEl.alt = choice.alt;
}
initAboutPhotoRotation();

// ============ IMAGE FLYER LIGHTBOX (reusable) ============
const hiringFlyerBtn = document.getElementById('hiringFlyerBtn');
const tournamentStatBtn = document.getElementById('tournamentStatBtn');
const hiringFlyerLightbox = document.getElementById('hiringFlyerLightbox');
const hiringFlyerClose = document.getElementById('hiringFlyerClose');
const flyerLightboxImg = document.getElementById('flyerLightboxImg');

function openFlyerLightbox(src, alt) {
  if (!hiringFlyerLightbox || !flyerLightboxImg) return;
  flyerLightboxImg.src = src;
  flyerLightboxImg.alt = alt;
  hiringFlyerLightbox.classList.add('open');
}

if (hiringFlyerBtn) {
  hiringFlyerBtn.addEventListener('click', () => {
    openFlyerLightbox('assets/hiring-flyer.png', "Now Hiring — All Positions at Yesterdays Bar & Grill, apply in person");
  });
}
if (tournamentStatBtn) {
  tournamentStatBtn.addEventListener('click', () => {
    openFlyerLightbox('assets/gallery/gallery-61.jpg', "Aggieland Ducks Unlimited Pool & Dart Tournament flyer — Saturday August 22nd at Yesterdays Bar & Grill");
  });
}
if (hiringFlyerClose) {
  hiringFlyerClose.addEventListener('click', () => hiringFlyerLightbox.classList.remove('open'));
}
if (hiringFlyerLightbox) {
  hiringFlyerLightbox.addEventListener('click', (e) => {
    if (e.target === hiringFlyerLightbox) hiringFlyerLightbox.classList.remove('open');
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && hiringFlyerLightbox && hiringFlyerLightbox.classList.contains('open')) {
    hiringFlyerLightbox.classList.remove('open');
  }
});
