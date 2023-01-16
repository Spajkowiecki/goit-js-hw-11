import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;
const { log } = console;

const url = 'https://pixabay.com/api/';
const apiKey = '32705986-6617e254891a5833ed9977223';
const image_type = 'photo';
const orientation = 'horizontal';
const safeSearch = true;

const form = document.querySelector('form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const buttonUP = document.querySelector('.buttonUP');
const buttonMore = document.querySelector('.buttonMore');
const checkbox = document.querySelector('input[name=autoscroll]');

buttonUP.setAttribute('style', 'display: none');

let page = 1;
let images = 40;

let totalHits = 0;
var lightbox = new SimpleLightbox('.gallery a');

window.onload = () => {
  buttonMore.classList.add('disabled');
};

const drawImage = image => {
  gallery.insertAdjacentHTML(
    'beforeend',
    `<div class="photo-card">
    <a href=${image.largeImageURL}>
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    </a>
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

checkbox.addEventListener('change', () => {});

const getData = async (name, pageNumber) => {
  try {
    const response = await axios.get(
      `${url}?key=${apiKey}&fields=views,comments&q=${name}&image_type=${image_type}&orientation=${orientation}&safesearch=${safeSearch}&per_page=${images}&page=${pageNumber}`
    );
    const data = response.data.hits;
    totalHits = response.data.totalHits;
    lightbox.refresh();
    if (page <= 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }
    data.forEach(image => {
      drawImage(image);
    });
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

form.addEventListener('submit', async e => {
  e.preventDefault();

  let data = input.value.trim();
  if (data === '') {
    Notify.failure('The field is empty, write something.');
    return;
  } else {
    gallery.innerHTML = '';
    page = 1;
    getData(data, page);
  }
});

function toggleUpButton() {
  const headerHeight = document.querySelector('header').clientHeight;
  buttonUP.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
  if (window.scrollY >= headerHeight) {
    log('GREATER!');
    buttonUP.setAttribute('style', 'display: flex');
  } else {
    buttonUP.setAttribute('style', 'display: none');
  }
}

window.addEventListener('scroll', () => {
  log(window.scrollY);
  toggleUpButton();
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    totalHits -= page * images;
    if (totalHits <= 0) {
      Notify.failure('There are no images left');
    } else {
      if (checkbox.checked) {
        page++;
        getData(input.value.trim(), page);
        Notify.success(`Images left ${totalHits}.`);
      } else {
        buttonMore.classList.replace('disabled', 'enabled');
        buttonMore.addEventListener('click', () => {
          page++;
          getData(input.value.trim(), page);
          Notify.success(`Images left ${totalHits}.`);
        });
      }
    }
  }
});
