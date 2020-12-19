import Swiper, {Navigation, SwiperOptions} from 'swiper';
import * as _flatpickr from 'flatpickr';
import {Russian} from "flatpickr/dist/l10n/ru.js"
import {FlatpickrFn, Instance as FlatpickrInstance} from 'flatpickr/dist/types/instance';
const flatpickr: FlatpickrFn = _flatpickr as any;
import svg4everybody from 'svg4everybody';
import {getNextDay, validateInput, getHumanDate, calculatePrice} from './functions';
import {DESKTOP_WIDTH} from './constants';

/*
* Svg иконки
*/
svg4everybody();


/*
* Календарь
*/
const dateInputsField: HTMLInputElement = document.querySelector('#reservation-date-in');
const dateOtputsField: HTMLInputElement = document.querySelector('#reservation-date-out');

const today: Date = new Date();
const tomorrow: Date = getNextDay(new Date());
const mounth = new Date().setMonth(today.getMonth() + 1);

const calendarDateIn: FlatpickrInstance =  flatpickr(dateInputsField, {
  locale: Russian,
  dateFormat: 'd.m.Y',
  minDate: today,
  maxDate: mounth,
  onChange: (selectedDates) => {
    calendarDateOut.set('minDate', getNextDay(selectedDates[0]))
  }
})

const calendarDateOut: FlatpickrInstance = flatpickr(dateOtputsField, {
  locale: Russian,
  dateFormat: 'd.m.Y',
  minDate: tomorrow,
  maxDate: mounth
})

const dateInputsFieldPrice: HTMLInputElement = document.querySelector('#price-date-in');
const dateOtputsFieldPrice: HTMLInputElement = document.querySelector('#price-date-out');

const calendarDateInPrice: FlatpickrInstance =  flatpickr(dateInputsFieldPrice, {
  locale: Russian,
  dateFormat: 'd.m.Y',
  minDate: today,
  maxDate: mounth,
  onChange: (selectedDates) => {
    calendarDateOutPrice.set('minDate', getNextDay(selectedDates[0]))
  }
})

const calendarDateOutPrice: FlatpickrInstance = flatpickr(dateOtputsFieldPrice, {
  locale: Russian,
  dateFormat: 'd.m.Y',
  minDate: tomorrow,
  maxDate: mounth
})

const buttonCalculateReservation: HTMLLinkElement = document.querySelector('.reservation__calculate');
const buttonCalculatePrice: HTMLLinkElement = document.querySelector('.price__calculate');

buttonCalculateReservation.addEventListener('click', (e) => {
  e.preventDefault();

  if (!validateInput(dateInputsField) || !validateInput(dateOtputsField)) {
    return false; // нужно показать ошибку
  }

  const dateIn: Date = calendarDateIn.selectedDates[0];
  const dateOut: Date = calendarDateOut.selectedDates[0];

  const totalPrice: number = calculatePrice(dateIn, dateOut);

  showOverlay();
  showPopup(getHumanDate(dateIn), getHumanDate(dateOut), totalPrice);

  dateInputsField.value = '';
  dateOtputsField.value = '';
});

buttonCalculatePrice.addEventListener('click', (e) => {
  e.preventDefault();

  if (!validateInput(dateInputsFieldPrice) || !validateInput(dateOtputsFieldPrice)) {
    return false; // нужно показать ошибку
  }

  const dateIn: Date = calendarDateInPrice.selectedDates[0];
  const dateOut: Date = calendarDateOutPrice.selectedDates[0];

  const totalPrice: number = calculatePrice(dateIn, dateOut);

  showOverlay();
  showPopup(getHumanDate(dateIn), getHumanDate(dateOut), totalPrice);

  dateInputsFieldPrice.value = '';
  dateOtputsFieldPrice.value = '';
});


/*
* Оверлей
*/
const overlay: HTMLDivElement = document.querySelector('.overlay');

// открыть
const showOverlay = (): void => {
  overlay.classList.add('overlay_open');
};

// закрыть
const hideOverlay = (): void => {
  overlay.classList.remove('overlay_open');
};


/*
* Попап
*/
const popup: HTMLDivElement = document.querySelector('.popup');
const popupCloseButton: HTMLLinkElement = document.querySelector('.popup__close');
const dateInputField: HTMLInputElement = popup.querySelector('#dateIn');
const dateOutField: HTMLInputElement = popup.querySelector('#dateOut');
const priceField: HTMLInputElement = popup.querySelector('#price');

// открыть
const showPopup = (dateIn: string, dateOut: string, price: number): void => {
  dateInputField.value = dateIn;
  dateOutField.value = dateOut;
  priceField.value = price + ' ₽';

  popup.classList.add('popup_open');
};

// закрыть
const hidePopup = (): void => {
  dateInputField.value = '';
  dateOutField.value = '';
  priceField.value = '';

  popup.classList.remove('popup_open');
};

popupCloseButton.addEventListener('click', (e)=> {
  e.preventDefault();

  hidePopup();
  hideOverlay();
});


/*
* Управление видео
*/
const video: HTMLVideoElement = document.querySelector('video');
const videoPlayButton: HTMLLinkElement = document.querySelector('.gallery__video-play')
const videoInfoContainer: HTMLDivElement = document.querySelector('.gallery__video-info');

videoPlayButton.addEventListener('click', (): void => {
  videoInfoContainer.classList.add('gallery__video-info_hide');
  video.play();

  video.addEventListener('click', () => {
    video.pause();
    videoInfoContainer.classList.remove('gallery__video-info_hide');
  });
});


/*
* Управление меню
*/
const openMenuButton: HTMLLinkElement = document.querySelector('.header__btn-open');
const closeMenuButton: HTMLLinkElement = document.querySelector('.header__btn-close');
const headerContainer: HTMLDivElement = document.querySelector('.header__container');
const logo: HTMLDivElement = document.querySelector('.logo');
const promoWrapper: HTMLDivElement = document.querySelector('.promo__wrapper');
const body: HTMLBodyElement = document.querySelector('body');

// открыть
openMenuButton.addEventListener('click', (e) => {
  e.preventDefault();

  headerContainer.classList.add('header__container_open');
  logo.classList.add('logo_hide');
  openMenuButton.classList.add('header__btn-open_hide');
  promoWrapper.classList.add('promo__wrapper_hide');
  body.classList.add('no-scroll');
});

// закрыть
closeMenuButton.addEventListener('click', (e) => {
  e.preventDefault();

  headerContainer.classList.remove('header__container_open');
  logo.classList.remove('logo_hide');
  openMenuButton.classList.remove('header__btn-open_hide');
  promoWrapper.classList.remove('promo__wrapper_hide');
  body.classList.remove('no-scroll');
});

const submenu: HTMLUListElement = document.querySelector('.menu__submenu');
const subenuLink: HTMLLinkElement = document.querySelector('.menu__item_submenu');


/*
* Управление подменю
*/

// нажатие на телефоне
subenuLink.addEventListener('click', (e) => {
  e.preventDefault();

  if (window.innerWidth < DESKTOP_WIDTH) {
    if (!submenu.classList.contains('active')) {
      submenu.classList.add('active');
      submenu.style.height = 'auto';

      const height = submenu.clientHeight + 'px';
      submenu.style.height = '0px';

      setTimeout(() => {
        submenu.style.height = height;
      }, 0);

    } else {
      submenu.style.height = '0px';

      submenu.addEventListener('transitionend', () => {
        submenu.classList.remove('active');
      }, {
        once: true
      });
    }
  }
});

// наведение на телефоне
if (window.innerWidth >= DESKTOP_WIDTH) {
  let timeout: any;

  subenuLink.addEventListener('mouseenter', () => {

    if (submenu.classList.contains('active')) {
      clearTimeout(timeout);
    }

    submenu.classList.add('active');
  });

  subenuLink.addEventListener('mouseleave', () => {
    timeout = setTimeout(() => {
      submenu.classList.remove('active');
    }, 500 );

  });
}



/*
* Слайдер фотогалереи
*/

Swiper.use([Navigation]);

const swiperParams: SwiperOptions = {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 20,
  centeredSlides: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    576: {
      slidesPerView: 3
    },
    992: {
      slidesPerView: 6,
      centeredSlides: false
    },
  }
};

let slider: any;

if (window.innerWidth >= DESKTOP_WIDTH) {
  slider = new Swiper('.swiper-container', swiperParams);
}

// Mutation Observer?
window.addEventListener('resize', () => {
  if (window.innerWidth >= DESKTOP_WIDTH) {
    if (!slider) {
      slider = new Swiper('.swiper-container', swiperParams);
    }
  } else {
    slider.destroy(true, true);
    slider = null;
  }
})

import './maps.ts';
