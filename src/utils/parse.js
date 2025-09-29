import uniqueId from 'lodash/uniqueId.js'

export default (xml, url, feedId = uniqueId()) => {
  const posts = []

  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'text/xml')

  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    throw new Error('errors.parseError')
  }

  const items = doc.querySelectorAll('item')
  if (items.length === 0) {
    throw new Error('errors.noItems')
  }

  const feed = {
    id: feedId,
    link: url,
    title: doc.querySelector('channel > title')?.textContent ?? '',
    description: doc.querySelector('channel > description')?.textContent ?? ''
  }

  items.forEach((item) => {
    posts.push({
      feedId,
      title: item.querySelector('title')?.textContent?.trim() ?? '',
      description: item.querySelector('description')?.textContent?.trim() ?? '',
      link: item.querySelector('link')?.textContent?.trim() ?? '',
      id: uniqueId(),
    })
  })

  return { feed, posts }
}