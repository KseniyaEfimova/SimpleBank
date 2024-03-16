'use strict';

import { mainURL, fetchAccount, errorMessage } from './module.js';

document.addEventListener('click', function (e) {
  if (e.target.closest('.nav')) {
    toggleNavMenu(e);
  }
  if (e.target.hasAttribute('data-modal-target')) {
    openModal(e);
  }
  if (e.target.hasAttribute('data-close-button') || e.target.id === 'overlay') {
    closeModal();
  }
  if (e.target.closest('.operations__tab')) {
    switchTab(e);
  }

  if (e.target.hasAttribute('data-carousel-button')) {
    changeSlide(e);
  }
});

// *** Navigation ***

const navLinks = document.querySelector('.nav__links');
const navBar = document.querySelector('.nav__content');

// A Hamburger Menu
function toggleNavMenu(e) {
  const isToggleBtn = e.target.closest('.toggle-btn');
  const isNavLink = e.target.classList.contains('nav__link');

  if (isToggleBtn) {
    navBar.classList.toggle('active');
  } else if (isNavLink && navBar.classList.contains('active')) {
    navBar.classList.remove('active');
  }
}

//  Hover animation
const navLinksHoverEffect = function (e) {
  if (
    e.target.classList.contains('nav__link') &&
    !navBar.classList.contains('active')
  ) {
    const linkOver = document.querySelectorAll('.nav__link');

    linkOver.forEach(el => {
      if (el !== e.target) el.style.opacity = this;
    });
  }
};

navLinks.addEventListener('mouseover', navLinksHoverEffect.bind(0.4));
navLinks.addEventListener('mouseout', navLinksHoverEffect.bind(1));

// *** Modal window ***

const overlay = document.getElementById('overlay');

// Open modal window

function openModal(e) {
  const modalWindow = document.querySelector(e.target.dataset.modalTarget);
  if (modalWindow == null) return;
  if (e.target.modalTarget === '#login') {
    alert('используйте данные из файла "README.md. Пример : login Tom Colt, pin 1111"');
  }
  modalWindow.classList.add('active');
  overlay.classList.add('active');
}

// Close modal window

function closeModal() {
  const openedModalWindow = document.querySelector('.modal-window.active');
  if (openedModalWindow == null) return;
  openedModalWindow.classList.remove('active');
  overlay.classList.remove('active');
}

document.addEventListener('keydown', function (e) {
  const modals = document.querySelectorAll('.modal-window.active');
  if (e.key === 'Escape' && modals.length > 0) {
    modals.forEach(modal => closeModal(modal)); // ****
  }
});

// *** Operations tabs switching ***

function switchTab(e) {
  // Active tab
  const tabs = document.querySelectorAll('.operations__tab');
  const isTab = e.target.closest('.operations__tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  isTab.classList.add('active');
  // Active content
  const tabContents = document.querySelectorAll('.operations__content');
  tabContents.forEach(content => content.classList.remove('active'));

  const activeTabContent = document.querySelector(
    `.operations__content--${isTab.dataset.tab}`
  );
  activeTabContent.classList.add('active');
}

// *** Appearance of sections ***
const allSections = document.querySelectorAll('.section'); // Nodelist
const appearanceSection = function (entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(appearanceSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// *** Lazy Loading for img ***

const servicesImg = document.querySelectorAll('.services__img');

const LazyImgLoading = function (entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
};

const lazyLoadImgObserver = new IntersectionObserver(LazyImgLoading, {
  threshold: 0.35,
});

servicesImg.forEach(image => lazyLoadImgObserver.observe(image));

// *** slider dots ***

let dotIndex;

const createDots = function () {
  const carouselSlides = document.querySelectorAll('.slide');
  const carouselDotContainer = document.querySelector('.dots');
  carouselSlides.forEach(function (_, index) {
    carouselDotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
};

createDots();

// *** slider ***

function changeSlide(e) {
  const offset = e.target.dataset.carouselButton === 'left' ? -1 : 1;
  const slides = e.target.closest('.slider').querySelector('.slides');
  const activeSlide = slides.querySelector('[data-active]');
  let newIndex = [...slides.children].indexOf(activeSlide) + offset;

  if (newIndex < 0) newIndex = slides.children.length - 1;
  if (newIndex >= slides.children.length) newIndex = 0;

  slides.children[newIndex].dataset.active = true;
  delete activeSlide.dataset.active;

  dotIndex = newIndex;
  activateCurrentDot(dotIndex);
}

// activate current dot of slider
const activateCurrentDot = function (dotIndex) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${dotIndex}"]`)
    .classList.add('dots__dot--active');
};

activateCurrentDot(0);

// *** Login process ***

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', authenticateUser);

async function authenticateUser(e) {
  const loginUsernameInput = document.getElementById('name');
  const loginPinInput = document.getElementById('password');
  e.preventDefault();
  let accounts;
  try {
    accounts = await fetchAccount(mainURL);
  } catch (error) {
    console.error('Error:', error);

    errorMessage(`Error: Ошибка получения данных с сервера (${error})`);
    return;
  }

  const authenticatedUser = accounts?.find(
    account =>
      account.userName === loginUsernameInput.value ||
      account.pin === +loginPinInput.value
  );

  // Processing invalid data input
  switch (true) {
    case !authenticatedUser:
      const errorMessage =
        'Невозможно получить сведения об аккаунте. Unable to retrieve account information';
      alert(errorMessage);
      break;
    case authenticatedUser?.userName !== loginUsernameInput.value:
      alert(
        'Неверное имя логина. Проверьте реестр, пример: «Имя Фамилия».Incorrect Login Name. Check the register, example: "Name Lastname"'
      );
      break;
    case authenticatedUser?.pin !== Number(loginPinInput.value):
      alert('Неверный ПИН. Incorrect PIN');
      break;

    default:
      sessionStorage.setItem(
        'authenticatedUserId',
        JSON.stringify(authenticatedUser.id)
      );
      window.location.href = 'account.html';

      break;
  }
}
