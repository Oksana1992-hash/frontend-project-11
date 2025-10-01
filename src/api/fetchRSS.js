import axios from 'axios'

const getProxyUrl = (url) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get')
  proxyUrl.searchParams.set('disableCache', 'true')
  proxyUrl.searchParams.set('url', url)
  return proxyUrl.toString()
}

export default (url) => {
  const proxyUrl = getProxyUrl(url)

  return axios.get(proxyUrl)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('errors.network')
      }
      return response.data.contents
    })
    .catch(() => {
      throw new Error('errors.network')
    })
}
