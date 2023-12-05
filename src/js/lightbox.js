import SimpleLightbox from 'simplelightbox/dist/simple-lightbox.esm.js'
window.simpleLightbox = function (className, options) {
  return new SimpleLightbox(className, options)
}
