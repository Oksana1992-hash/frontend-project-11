import * as yup from 'yup'

export default (url, existingLinks, i18nextInstance) => {
  const schema = yup.string()
    .required()
    .url()
    .notOneOf(existingLinks)

  return schema.validate(url)
    .then(() => null)
    .catch((error) => {
      const errorKey = error.message || 'errors.unknown'
      return i18nextInstance.t(errorKey)
    })
}