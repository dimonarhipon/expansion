"use strict";

new Swiper('.slider--clients', {
  navigation: {
    prevEl: '.slider--clients .slider__control .slider__prev',
    nextEl: '.slider--clients .slider__control .slider__next'
  },
  loop: true,
  slidesPerView: 6,
  watchOverflow: true,
  grabCursor: true,
  pagination: {
    el: '.swiper-pagination',
    type: 'fraction',
  },
  scrollbar: {
    el: '.swiper-scrollbar'
  }
});

new Swiper('.slider--rating', {
  // navigation: {
  //   prevEl: '.slider--clients .slider__control .slider__prev',
  //   nextEl: '.slider--clients .slider__control .slider__next'
  // },
  slidesPerView: 4,
  grabCursor: true,
  pagination: {
    el: '.swiper-pagination',
    type: 'fraction',
  },
  scrollbar: {
    el: '.swiper-scrollbar'
  }
});
