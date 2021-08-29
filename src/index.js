import './css/style.css';
import * as basicLightbox from 'basiclightbox';

import { form, galleryContainer, loadMoreBtn } from './js/refs';
import { fetchImageByName } from './js/apiService';
import GalleryMarkupTmpl from './templates/gallery.hbs';
import { info } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/confirm/dist/PNotifyConfirm.css';

const states = {
  page: 1,
  searchValue: '',
};

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
};

const observer = new IntersectionObserver(onClickLoadMore, options);

loadMoreBtn.style.visibility = 'hidden';

form.addEventListener('submit', onCLickSearch);
loadMoreBtn.addEventListener('click', onClickLoadMore);
galleryContainer.addEventListener('click', openImageModal);

async function onCLickSearch(e) {
  e.preventDefault();
  states.searchValue = e.currentTarget.elements.query.value.trim();
  states.page = 1;
  loadMoreBtn.style.visibility = 'hidden';
  if (!states.searchValue) {
    galleryContainer.innerHTML = '';
    info({
      title: 'Error',
      text: 'Empty query',
    });
    return;
  }
  states.searchValue = e.currentTarget.elements.query.value.trim();
  const imgInfo = await fetchImageByName(states.searchValue, states.page);
  if (imgInfo.length === 0) {
    galleryContainer.innerHTML = '';
    e.target.elements.query.value = '';
    info({
      title: 'Error',
      text: 'No matches',
    });
    return;
  }
  galleryContainer.innerHTML = GalleryMarkupTmpl(imgInfo);
  loadMoreBtn.style.visibility = 'visible';
}

async function onClickLoadMore() {
  states.page += 1;
  const imgInfo = await fetchImageByName(states.searchValue, states.page);
  galleryContainer.insertAdjacentHTML('beforeend', GalleryMarkupTmpl(imgInfo));
  //   galleryContainer.scrollIntoView({
  //     behavior: 'smooth',
  //     block: 'end',
  //   });
  if (imgInfo.length < 12) {
    loadMoreBtn.style.visibility = 'hidden';
  }
  if (states.page === 2) {
    observer.observe(loadMoreBtn);
  }
}

function openImageModal({
  target: {
    nodeName,
    dataset: { src },
  },
}) {
  if (nodeName !== 'IMG') {
    return;
  }
  basicLightbox
    .create(
      `
         <img src="${src}" width="800" height="600">
    `,
    )
    .show();
}
