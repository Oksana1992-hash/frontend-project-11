import 'bootstrap/dist/css/bootstrap.min.css'
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
}

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('#url-input'),
  submit: document.querySelector('[type="submit"]'),
  feedback: document.querySelector('.feedback'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
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

      validate(url, watchedState.feeds, i18nextInstance)
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
    updatePosts(watchedState)
  })