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
import uniqueId from 'lodash/uniqueId.js'

const state = {
  inputState: 'filling', // valid, invalid, filling, sending
  inputValue: '',
  feeds: [],
  posts: [],
  error: null,
  uiState: {
    modalPostId: null,
    viewedPostsId: [],
  }
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
    // Обновление RSS-потоков
    const updatePosts = (watchedState) => {
      const promises = watchedState.feeds.map((feed) => fetchRSS(feed.link)
        .then((xml) => {
          const addedPostLinks = watchedState.posts.map((post) => post.link)
          const { posts } = parse(xml, feed.link)
          const newPosts = posts.filter((post) => !addedPostLinks.includes(post.link))
          const postsWithId = newPosts.map((post) => ({
            ...post,
            id: uniqueId(),
            feedId: feed.id,
          }))
          watchedState.posts.unshift(...postsWithId)
          console.log(`Добавлено ${newPosts.length} новых постов для фида ${feed.id}`)
          return null
        })
        .catch((error) => {
          console.error(`Ошибка при получении данных из ${feed.id}:`, error.message || error)
          return null
        }))
      return Promise.all(promises)
        .finally(() => setTimeout(() => {
          console.log('Очередная проверка обновлений RSS-потоков')
          updatePosts(watchedState)
        }, 5000))
    }

    // View (представление)
    const watchedState = onChange(state, (path) => render(path, state, elements, i18nextInstance))


    // Contoller (события)
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault()
      watchedState.inputState = 'filling'

      const formData = new FormData(e.target)
      const url = formData.get('url').trim()

      watchedState.inputValue = url

      const existingLinks = watchedState.feeds.map((feed) => feed.link)
      validate(url, existingLinks, i18nextInstance)
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
          fetchRSS(link)
            .then((xml) => {
              const result = parse(xml, url)
              if (result === null) {
                throw new Error('errors.parseError')
              }
              const { feed, posts } = result
              const feedId = uniqueId()
              watchedState.feeds.push({ ...feed, id: feedId, link: url })
              const postsWithId = posts.map((post) => ({ ...post, id: uniqueId(), feedId }))
              watchedState.posts.unshift(...postsWithId)
              watchedState.inputState = 'valid'
            })
            .catch((error) => {
              const errorMessage = i18nextInstance.t(error.message)
              watchedState.error = errorMessage
              watchedState.inputState = 'invalid'
            })
        })
    })

    elements.posts.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-outline-primary')) {
        e.preventDefault()
        watchedState.uiState.modalPostId = e.target.dataset.id
        watchedState.uiState.viewedPostsId.push(e.target.dataset.id)
      }
    })
    updatePosts(watchedState)
  })
