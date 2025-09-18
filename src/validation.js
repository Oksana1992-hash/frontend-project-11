import * as yup from 'yup'

export default (url, feeds) => {
  const schema = yup.string()
    .required()
    .url('Ссылка должна быть валидным URL')
    .test(
      'is-unique',
      'RSS уже существует',
      (value) => !Array.isArray(feeds) || !feeds.includes(value),
    )

  return schema.validate(url)
    .then(() => null)
    .catch((err) => err.message)
}
