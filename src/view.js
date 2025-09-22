export default (state, elements, i18nextInstance) => {
  // Управление значением input зависит от состояния
  const shouldClearInput = state.inputState === 'valid' || state.inputState === 'filling'
  elements.input.value = shouldClearInput ? '' : state.inputValue

  // Очистка классов оповещения
  elements.feedback.classList.remove('text-success', 'text-danger')

  if (state.error) {
    // Ошибка: добавляем класс invalid, показываем текст ошибки
    elements.input.classList.add('is-invalid')
    elements.feedback.classList.add('text-danger')
    elements.feedback.textContent = state.error
  } else {
    // Нет ошибки: убираем класс invalid, показываем успешное сообщение при 'valid'
    elements.input.classList.remove('is-invalid')

    if (state.inputState === 'valid') {
      elements.feedback.classList.add('text-success')
      elements.feedback.textContent = i18nextInstance.t('status.success')
    } else {
      // При 'filling' и любых других состояниях feedback пустой
      elements.feedback.textContent = ''
    }
  }
}