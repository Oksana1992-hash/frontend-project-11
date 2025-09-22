import 'bootstrap/dist/css/bootstrap.min.css'
import setYupLocale from './utils/yupLocale.js'
import onChange from 'on-change'
import ru from './locales/rus.js'
import validate from './validation.js'
import render from './view.js'
import i18next from 'i18next'

const state = {
  inputState: 'filling', // valid, invalid, filling
  inputValue: '',
  feeds: [],
  error: null,
}

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
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
    const watchedState = onChange(state, () => render(watchedState, elements, i18nextInstance))


    // Contoller (события)
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault()

      const formData = new FormData(e.target)
      const url = formData.get('url').trim()

      watchedState.inputValue = url

      validate(url, watchedState.feeds, i18nextInstance)
        .then((error) => {
          if (error) {
            watchedState.error = error
            watchedState.inputState = 'invalid'
          } else {
            watchedState.error = null
            watchedState.inputState = 'valid'
            watchedState.feeds.push(url)
          }
        })
        .catch(() => {
          watchedState.error = i18nextInstance.t('errors.unknown')
          watchedState.inputState = 'invalid'
        })
    })
  })