'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const header = document.querySelector('.header')
const sections = document.querySelectorAll('.section');
const slides = document.querySelectorAll('.slide');

const section1 = document.querySelector('#section--1');
const containerNav = document.querySelector('.nav')
const parentLink = document.querySelector('.nav__links');
const link = document.querySelectorAll('.nav__link');

const containerDot = document.querySelector('.dots');
const operationTab = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const contents = document.querySelectorAll('.operations__content');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

/////////////////////////////////////////////////////////
// Modal
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
overlay.addEventListener('click', closeModal)

btnCloseModal.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////////////////
// Scroll
btnScrollTo.addEventListener('click', function() {
  section1.scrollIntoView({ behavior: 'smooth' });
})

parentLink.addEventListener('click', function(e) {
  e.preventDefault();
  const click = e.target;
  
  if (!click.classList.contains('nav__link')) return;

  const id = click.getAttribute('href');
  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
})

/////////////////////////////////////////////////////////////
// Tabbed Component
operationTab.addEventListener('click', function(e) {
  e.preventDefault();

  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  contents.forEach(content => content.classList.remove('operations__content--active'));
  clicked.classList.add('operations__tab--active');

  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})

////////////////////////////////////////////////////////////
// Menu Fade Animation (How to pass arguments in event handlers)
const fade = function(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(sibling => {
      if (sibling !== link) sibling.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}
containerNav.addEventListener('mouseover', fade.bind(0.5));
containerNav.addEventListener('mouseout', fade.bind(1));

/////////////////////////////////////////////////////////////////
// Sticky Navigation
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function() {
//   if (window.scrollY > initialCoords.top) {
//     containerNav.classList.add('sticky')
//   } else {
//     containerNav.classList.remove('sticky')
//   }
// })

const navHeight = containerNav.getBoundingClientRect().height;

const stickyNav = function(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) containerNav.classList.add('sticky');
  else containerNav.classList.remove('sticky');

}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////////////////////////////////
// Section Hidden

const revealSection = function(entries, observer) {
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target)
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section)
});

//////////////////////////////////////////////////////////////
// Lazy loading

const imgTargets = document.querySelectorAll('img[data-src]');

const lazyLoad = function(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img')
  })

  observer.observe(entry.target);
}

const imgObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0, 
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

////////////////////////////////////////////////////////////////////
// Slider
let curSlide = 0;
const maxSlide = slides.length - 1;

const goToSlide = function(slide) {
  slides.forEach((slid, i) => slid.style.transform = `translateX(${100 * (i - slide)}%)`);
}

// Create Dots
const createDots = function() {
  slides.forEach((slide, i) => {
    containerDot.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`) 
  })
}

const activateDot = function(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

// NextSlide
const nextSlide = function() {
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
}

// PerviousSlide
const prevSlide = function() {
  if (curSlide <= 0) {
    curSlide = maxSlide
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
}

const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0); 
}
init();

// Event handlers
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') prevSlide();
  // if (e.key === 'ArrowRight') nextSlide();
  e.key === 'ArrowRight' && nextSlide();   // Short Circuiting
})

containerDot.addEventListener('click', function(e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    activateDot(slide)
    goToSlide(slide);
  }
})