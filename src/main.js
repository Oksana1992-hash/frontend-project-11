import 'bootstrap/dist/css/bootstrap.min.css'
import onChange from 'on-change'
import validate from './validation.js'
import render from './view.js'

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

// View (представление)
const watchedState = onChange(state, () => render(watchedState, elements))

// Contoller (события)
elements.form.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = new FormData(e.target)
  const url = formData.get('url').trim()

  watchedState.inputValue = url

  validate(url, watchedState.feeds)
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
      watchedState.error = 'Неизвестная ошибка'
      watchedState.inputState = 'invalid'
    })
})