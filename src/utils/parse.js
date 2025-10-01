export default (xml) => {
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
    title: doc.querySelector('channel > title')?.textContent ?? '',
    description: doc.querySelector('channel > description')?.textContent ?? '',
  }

  doc.querySelectorAll('item').forEach((item) => {
    posts.push({
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    })
  })

  return { feed, posts }
}
