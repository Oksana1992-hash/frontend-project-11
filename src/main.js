import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import setYupLocale from './utils/yupLocale.js'
import onChange from 'on-change'
import ru from './locales/rus.js'
import validate from './validation.js'
import render from './view.js'
import i18next from 'i18next'
import fetchRSS from './api/fetchRSS.js'
import parse from './utils/parse.js'

const state = {
  inputState: 'filling', // valid, invalid, filling
  inputValue: '',
  feeds: [],
  posts: [],
  error: null,
}

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('#url-input'),
  submit: document.querySelector('[type="submit"]'),
  feedback: document.querySelector('.feedback'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
  modalHeader: document.querySelector('.modal-header'),
  modalBody: document.querySelector('.modal-body'),
  modalButtons: document.querySelector('.btn-outline-primary'),
}

setYupLocale()

// i18next
const i18nextInstance = i18next.createInstance()
i18nextInstance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru,
  },
})

  .then(() => {
    // View (представление)
    const watchedState = onChange(state, (path) => render(path, state, elements, i18nextInstance))


    // Contoller (события)
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault()
      watchedState.inputState = 'filling'

      const formData = new FormData(e.target)
      const url = formData.get('url').trim()

      watchedState.inputValue = url

      validate(url, watchedState.feeds)
        .then((error) => {
          if (error) {
            watchedState.error = error
            watchedState.inputState = 'invalid'
            throw new Error(error)
          } else {
            watchedState.error = null
            return url
          }
        })
        .then((link) => {
          watchedState.inputState = 'sending'
          fetchRSS(link, i18nextInstance)
            .then((xml) => {
              const { feed, posts } = parse(xml, url, i18nextInstance)
              watchedState.feeds = [...watchedState.feeds, feed]
              watchedState.posts = [...watchedState.posts, ...posts]
              watchedState.inputState = 'valid'
            })
            .catch((error) => {
              watchedState.error = error.message
              watchedState.inputState = 'invalid'
              throw new Error(watchedState.error)
            })
        })
    })
    elements.posts.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-outline-primary')) {
        e.preventDefault()
        watchedState.activePostId = e.target.dataset.id
      }
    })
  })