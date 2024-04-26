// global custom JS
document.addEventListener('DOMContentLoaded', (event) => {
  // Select the button text
  const buttonText = document.querySelector('.header-language-btn-text')
  if (buttonText.textContent === 'SV-SE') {
    buttonText.textContent = 'SV'
  }
  if (buttonText.textContent === 'DA-DK') {
    buttonText.textContent = 'DK'
  }

  // Select the list items
  const listItems = document.querySelectorAll('.header-language__list-item-link')
  listItems.forEach(item => {
    if (item.getAttribute('lang') === 'sv-se') {
      item.setAttribute('lang', 'SV')
      item.textContent = 'Svenska'
    } else if (item.getAttribute('lang') === 'da-dk') {
      item.setAttribute('lang', 'DK')
      item.textContent = 'Dansk'
    }
  })
})
