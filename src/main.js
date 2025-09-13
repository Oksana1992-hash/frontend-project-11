import 'bootstrap/dist/css/bootstrap.min.css'

const form = document.querySelector('.rss-form')

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    alert('Форма отправлена!')
  })
}
