// ===========================
// Hubspot suggestions
// ===========================
/* eslint-env browser */
const hsSearch = function (_instance) {
  const TYPEAHEAD_LIMIT = 3
  const KEYS = {
    TAB: 'Tab',
    ESC: 'Esc', // IE11 & Edge 16 value for Escape
    ESCAPE: 'Escape',
    UP: 'Up', // IE11 & Edge 16 value for Arrow Up
    ARROW_UP: 'ArrowUp',
    DOWN: 'Down', // IE11 & Edge 16 value for Arrow Down
    ARROW_DOWN: 'ArrowDown'
  }
  let searchTerm = ''
  const searchForm = _instance
  const searchField = _instance.querySelector('.header-search__form-input')
  const searchResults = _instance.querySelector('.header-search__suggestions')
  const searchOptions = function () {
    const formParams = []
    const form = _instance.querySelector('form')
    for (
      let i = 0;
      i < form.querySelectorAll('input[type=hidden]').length;
      i++
    ) {
      const e = form.querySelectorAll('input[type=hidden]')[i]
      if (e.name !== 'limit') {
        formParams.push(
          encodeURIComponent(e.name) + '=' + encodeURIComponent(e.value)
        )
      }
    }
    const queryString = formParams.join('&')
    return queryString
  }
  const debounce = function (func, wait, immediate) {
    let timeout
    return function () {
      const context = this
      const args = arguments
      const later = function () {
        timeout = null
        if (!immediate) {
          func.apply(context, args)
        }
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait || 200)
      if (callNow) {
        func.apply(context, args)
      }
    }
  }
  const emptySearchResults = function () {
    searchResults.innerHTML = ''
    searchField.focus()
    searchForm.classList.remove('header-search--open')
  }
  const ariaExpanded = function (val) {
    searchForm.querySelector('.header-search__form_internal-wrp').ariaExpanded = val
  }
  const fillSearchResults = function (response) {
    const items = []
    items.push(
      "<li id='results-for'>Results for \"" + response.searchTerm + '"</li>'
    )
    response.results.forEach(function (val, index) {
      items.push(
        "<li id='result" +
          index +
          "'><a href='" +
          val.url +
          "'>" +
          val.title +
          '</a></li>'
      )
    })

    emptySearchResults()
    searchResults.innerHTML = items.join('')
    searchForm.classList.add('header-search--open')
  }
  const getSearchResults = function () {
    const request = new XMLHttpRequest()
    const requestUrl =
      '/_hcms/search?&term=' +
      encodeURIComponent(searchTerm) +
      '&limit=' +
      encodeURIComponent(TYPEAHEAD_LIMIT) +
      '&autocomplete=true&analytics=true&' +
      searchOptions()

    request.open('GET', requestUrl, true)
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        const data = JSON.parse(request.responseText)
        if (data.total > 0) {
          fillSearchResults(data)
          trapFocus()
          ariaExpanded(true)
        } else {
          emptySearchResults()
          ariaExpanded(false)
        }
      } else {
        console.error('Server reached, error retrieving results.')
      }
    }
    request.onerror = function () {
      console.error('Could not reach the server.')
    }
    request.send()
  }
  const trapFocus = function () {
    const tabbable = []
    tabbable.push(searchField)
    const tabbables = searchResults.getElementsByTagName('A')
    for (let i = 0; i < tabbables.length; i++) {
      tabbable.push(tabbables[i])
    }
    const firstTabbable = tabbable[0]
    const lastTabbable = tabbable[tabbable.length - 1]
    const tabResult = function (e) {
      if (e.target === lastTabbable && !e.shiftKey) {
        e.preventDefault()
        firstTabbable.focus()
      } else if (e.target === firstTabbable && e.shiftKey) {
        if (searchForm.classList.contains('header-search--open')) {
          e.preventDefault()
        }
        lastTabbable.focus()
      }
    }
    const nextResult = function (e) {
      e.preventDefault()
      if (e.target === lastTabbable) {
        firstTabbable.focus()
      } else {
        tabbable.forEach(function (el) {
          if (el === e.target) {
            tabbable[tabbable.indexOf(el) + 1].focus()
          }
        })
      }
    }
    const lastResult = function (e) {
      e.preventDefault()
      if (e.target === firstTabbable) {
        lastTabbable.focus()
      } else {
        tabbable.forEach(function (el) {
          if (el === e.target) {
            tabbable[tabbable.indexOf(el) - 1].focus()
          }
        })
      }
    }
    searchForm.addEventListener('keydown', function (e) {
      switch (e.key) {
        case KEYS.TAB:
          tabResult(e)
          break
        case KEYS.ESC:
        case KEYS.ESCAPE:
          emptySearchResults()
          ariaExpanded(false)
          break
        case KEYS.UP:
        case KEYS.ARROW_UP:
          lastResult(e)
          break
        case KEYS.DOWN:
        case KEYS.ARROW_DOWN:
          nextResult(e)
          break
      }
    })
  }
  const isSearchTermPresent = debounce(function () {
    searchTerm = searchField.value
    if (searchTerm.length > 2) {
      getSearchResults()
      ariaExpanded(true)
    } else if (searchTerm.length === 0) {
      emptySearchResults()
      ariaExpanded(false)
    }
  }, 250)
  const init = (function () {// eslint-disable-line
    searchField.addEventListener('input', function (e) {
      if (searchTerm !== searchField.value) {
        isSearchTermPresent()
      }
    })
  })()
}

if (
  document.attachEvent
    ? document.readyState === 'complete'
    : document.readyState !== 'loading'
) {
  const searchResults = document.querySelectorAll('.header-search')
  Array.prototype.forEach.call(searchResults, function (el) {
    const hsSearchModule = hsSearch(el)// eslint-disable-line
  })
} else {
  document.addEventListener('DOMContentLoaded', function () {
    const searchResults = document.querySelectorAll('.header-search')
    Array.prototype.forEach.call(searchResults, function (el) {
      const hsSearchModule = hsSearch(el)// eslint-disable-line
    })
  })
}

// ===========================
// main header search form
// ===========================
function headerSearch () {
  const headerSearch = document.getElementById('headerSearch')
  if (!headerSearch) return

  const searchForm = headerSearch.querySelector('.header-search__form')
  const searchFormInput = headerSearch.querySelector('.header-search__form-input')
  const searchFormBtn = headerSearch.querySelector('.header-search__form-btn')
  const searchResults = headerSearch.querySelector('.header-search__suggestions')

  function showSearchForm (event, elem, isPreventDefault) {
    if (!elem.classList.contains('header-search--show')) {
      elem.classList.add('header-search--show')
      if (!document.body.classList.contains('open-search_wrp')) {
        document.body.classList.add('open-search_wrp')
      }
      if (searchForm.tabIndex === 0) {
        searchForm.tabIndex = -1
      }
      if (searchFormBtn.tabIndex === -1) {
        searchFormBtn.tabIndex = 0
      }
      if (searchFormInput.tabIndex === -1) {
        searchFormInput.tabIndex = 0
      }
      searchFormInput.focus()
      if (isPreventDefault) {
        event.preventDefault()
      }
    }
  }

  function hideSearchForm (event, elem, isPreventDefault) {
    if (elem.classList.contains('header-search--show')) {
      elem.classList.remove('header-search--show')
      if (document.body.classList.contains('open-search_wrp')) {
        document.body.classList.remove('open-search_wrp')
      }
      if (elem.classList.contains('header-search--open')) {
        elem.classList.remove('header-search--open')
        searchResults.innerHTML = ''
      }
      if (searchForm.tabIndex === -1) {
        searchForm.tabIndex = 0
      }
      if (searchFormBtn.tabIndex === 0) {
        searchFormBtn.tabIndex = -1
      }
      if (searchFormInput.tabIndex === 0) {
        searchFormInput.tabIndex = -1
      }
      searchFormInput.blur()
      searchFormInput.value = ''
      if (isPreventDefault) {
        event.preventDefault()
      }
    }
  }

  function showSearchFormBySbmBtn (event) {
    showSearchForm(event, headerSearch, true)
  }
  searchFormBtn.addEventListener('click', showSearchFormBySbmBtn, { once: false, passive: false })

  function showSearchFormByFocus (event) {
    showSearchForm(event, headerSearch, false)
  }
  searchFormInput.addEventListener('focus', showSearchFormByFocus, { once: false, passive: true })

  function showSearchFormByKeyEnter (event) {
    if (event.code === 'Enter') {
      showSearchForm(event, headerSearch, false)
    }
  }
  searchForm.addEventListener('keyup', showSearchFormByKeyEnter, { once: false, passive: true })

  function hideSearchFormByKeyEscape (event) {
    if (event.code === 'Escape') {
      hideSearchForm(event, headerSearch, false)
    }
  }
  document.addEventListener('keyup', hideSearchFormByKeyEscape, { once: false, passive: true })

  function hideSearchFormByBlur (event) {
    if (event.relatedTarget && !event.relatedTarget.closest('.header-search__form_wrp')) {
      hideSearchForm(event, headerSearch, false)
    }
  }
  searchFormInput.addEventListener('blur', hideSearchFormByBlur, { once: false, passive: true })
  searchFormBtn.addEventListener('blur', hideSearchFormByBlur, { once: false, passive: true })

  function hideSearchFormByClick (event) {
    if (!event.target.closest('.header-search__form_wrp')) {
      hideSearchForm(event, headerSearch, false)
    }
  }
  document.addEventListener('click', hideSearchFormByClick, { once: false, passive: true })
}

// ==============================================================================
// sets and updates header height (used for vertical dropdown position in desktop
// and navbar scrollbar in mobile), based on global-header-wrp height
// ==============================================================================
function headerHeight () {
  const root = document.documentElement
  if (!root) return
  const header = document.querySelector('.global-header_wrp')
  if (!header) return
  const mainNavigation = document.getElementById('mainNavigation')
  const mobileBreakpoint = getComputedStyle(root).getPropertyValue('--mobile_breakpoint')

  root.style.setProperty('--header-height', header.offsetHeight + 'px')

  window.addEventListener('resize', function () {
    // check if main navigation exists, check if our window size is below the mobile breakpoint,
    // check if main navigation is showing or collapsing (but not collapsed)
    if (mainNavigation &&
      window.innerWidth < mobileBreakpoint &&
      (mainNavigation.classList.contains('show') || mainNavigation.classList.contains('collapsing'))
    ) {
      // if so, don't set new value
    } else {
      root.style.setProperty('--header-height', header.offsetHeight + 'px')
    }
  }, true)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', headerSearch)
  document.addEventListener('DOMContentLoaded', headerHeight)
} else {
  headerSearch()
  headerHeight()
}
