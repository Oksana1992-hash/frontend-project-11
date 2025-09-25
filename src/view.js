function setClasses(element, classes, action = 'add') {
  classes.forEach((className) => {
    element.classList[action](className)
  })
}

function setTextContent(element, content = '') {
  element.textContent = content
}

function updateElement(element, textContent = '', classes = [], action = 'add') {
  setTextContent(element, textContent)
  setClasses(element, classes, action)
}

const renderInput = (state, elements, i18nextInstance) => {
  switch (state.inputState) {
    case 'filling':
      elements.submit.disabled = false
      updateElement(elements.input, '', ['is-invalid'], 'remove')
      updateElement(elements.feedback, '', ['text-danger', 'text-success'], 'remove')
      break
    case 'valid':
      elements.submit.disabled = false
      elements.input.value = ''
      updateElement(elements.input, '', ['is-invalid'], 'remove')
      updateElement(elements.feedback, i18nextInstance.t('status.success'), ['text-danger'], 'remove')
      updateElement(elements.feedback, '', ['text-success'], 'add')
      break
    case 'invalid':
      elements.submit.disabled = false
      elements.input.value = state.inputValue
      updateElement(elements.input, '', ['is-invalid'], 'add')
      updateElement(elements.feedback, state.error, ['text-success'], 'remove')
      updateElement(elements.feedback, '', ['text-danger'], 'add')
      break
    case 'sending':
      elements.submit.disabled = true
      elements.input.value = state.inputValue
      updateElement(elements.input, '', ['is-invalid'], 'remove')
      updateElement(elements.feedback, '', ['text-danger', 'text-success'], 'remove')
      break
    default:
      break
  }
}

const renderFeeds = (state, elements, i18nextInstance) => {
  updateElement(elements.feeds, '', []) // Очистка содержимого
  const card = document.createElement('div')
  card.classList.add('card', 'border-0')
  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  const cardTitle = document.createElement('h2')
  cardTitle.classList.add('card-title', 'h4')
  cardTitle.textContent = i18nextInstance.t('elements.feeds')

  elements.feeds.append(card)
  card.append(cardBody)
  cardBody.append(cardTitle)

  state.feeds.forEach(({ title, description }) => {
    const ul = document.createElement('ul')
    ul.classList.add('list-group', 'border-0', 'rounded-0')
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'border-0', 'border-end-0')
    const h3 = document.createElement('h3')
    h3.classList.add('h6', 'm-0')
    h3.textContent = title
    const p = document.createElement('p')
    p.classList.add('m-0', 'small', 'text-black-50')
    p.textContent = description

    card.append(ul)
    ul.append(li)
    li.append(h3)
    li.append(p)
  })
}

const renderPosts = (state, elements, i18nextInstance) => {
  updateElement(elements.posts, '', []) // Очистка содержимого
  const card = document.createElement('div')
  card.classList.add('card', 'border-0')
  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  const cardTitle = document.createElement('h2')
  cardTitle.classList.add('card-title', 'h4')
  cardTitle.textContent = i18nextInstance.t('elements.posts')

  elements.posts.append(card)
  card.append(cardBody)
  cardBody.append(cardTitle)

  state.posts.forEach(({ title, link, id }) => {
    const ul = document.createElement('ul')
    ul.classList.add('list-group', 'border-0', 'rounded-0')
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')
    const a = document.createElement('a')
    a.setAttribute('href', link)
    a.setAttribute('data-id', id)
    a.setAttribute('target', '_blank')
    a.setAttribute('rel', 'noopener noreferrer')
    a.classList.add('fw-bold')
    a.textContent = title
    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.setAttribute('data-id', id)
    button.setAttribute('data-bs-toggle', 'modal')
    button.setAttribute('data-bs-target', '#modal')
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
    button.textContent = i18nextInstance.t('elements.button')
    card.append(ul)
    ul.append(li)
    li.append(a)
    li.append(button)
  })
}

const renderModal = (state, elements) => {
  updateElement(elements.modalHeader, '', []) // Очистка содержимого
  updateElement(elements.modalBody, '', [])

  const activePost = state.posts.find((post) => post.id === state.activePostId)
  const { description, title } = activePost

  const h5 = document.createElement('h5')
  h5.classList.add('modal-title')
  h5.textContent = title
  const closeButton = document.createElement('button')
  closeButton.classList.add('btn-close', 'close')
  closeButton.setAttribute('type', 'button')
  closeButton.setAttribute('data-bs-dismiss', 'modal')
  closeButton.setAttribute('aria-label', 'Close')
  elements.modalBody.textContent = description

  elements.modalHeader.append(h5)
  elements.modalHeader.append(closeButton)
}

export default (path, state, elements, i18nextInstance) => {
  switch (path) {
    case 'inputState':
      renderInput(state, elements, i18nextInstance)
      break
    case 'feeds':
      renderFeeds(state, elements, i18nextInstance)
      break
    case 'posts':
      renderPosts(state, elements, i18nextInstance)
      break
    case 'activePostId':
      renderModal(state, elements)
      break
    default:
      break
  }
}
