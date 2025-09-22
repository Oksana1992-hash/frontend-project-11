import { setLocale } from 'yup'

export default () => {
  setLocale({
    mixed: {
      required: () => 'errors.required',
      notOneOf: () => 'errors.alreadyOnTheList',
    },
    string: {
      url: () => 'errors.url',
    },
  })
}