import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;
const { log } = console;

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const url = 'https://pixabay.com/api/';
const apiKey = '32705986-6617e254891a5833ed9977223';
const image_type = 'photo';
const orientation = 'horizontal';
const safeSearch = true;

const form = document.querySelector('form');
const input = document.querySelector('input');
const button = document.querySelector('button');
const gallery = document.querySelector('.gallery');

let page = 1;
let images = 40;

let totalHits;

const drawImage = image => {
  gallery.insertAdjacentHTML(
    'beforeend',
    `<div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <strong>LIKES</strong></br>
      <span>${image.likes}</span>
    </p>
    <p class="info-item">
      <strong>VIEWS</strong></br>
      <span>${image.views}</span>
    </p>
    <p class="info-item">
      <strong>COMMENTS</strong></br>
      <span>${image.comments}</span>
    </p>
    <p class="info-item">
      <strong>DOWNLOADS</strong></br>
      <span>${image.downloads}</span>
    </p>
  </div>
</div>`
  );
};

const getData = async name => {
  return await axios
    .get(
      `${url}?key=${apiKey}&fields=views,comments&q=${name}&image_type=${image_type}&orientation=${orientation}&safesearch=${safeSearch}&per_page=${images}&page=${page}`
    )
    .then(response => {
      totalHits = response.data.totalHits;
      return response.data.hits;
    });
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  let data = input.value;
  if (data !== '') {
    const promise = await getData(data);
    if (promise.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      if (gallery.firstChild) {
        gallery.innerHTML = '';
      }
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      promise.forEach(element => drawImage(element));
    }
  } else if (data === '') {
    Notiflix.Notify.info('Input field is empty');
  }
});
