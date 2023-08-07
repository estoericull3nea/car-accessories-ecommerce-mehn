// ******************************************************************
// function setTheme(theme) {
//   let body = document.querySelector('body');
//   body.className = '';
//   body.classList.add(theme);
//   localStorage.setItem('theme', theme);
// }

// if (themeContainer) {
//   themeContainer.addEventListener('click', (e) => {
//     themeContainer.classList.toggle('open-theme-list');

//     themeListItems.forEach((element) => {
//       element.addEventListener('click', () => {
//         let themeContainerText = element.innerText;
//         defaultActive.innerText = themeContainerText;

//         if (themeContainerText === 'Light') {
//           document.body.classList.add('light');
//           setTheme('Light');
//           document.body.classList.remove('dark');
//           document.body.classList.remove('game');
//           allListItems.forEach((elem) => {
//             elem.style.color = 'black';
//           });
//         } else if (themeContainerText === 'Dark') {
//           document.body.classList.remove('light');
//           document.body.classList.add('dark');
//           allListItems.forEach((elem) => {
//             elem.style.color = 'white';
//           });
//           setTheme('Dark');
//           document.body.classList.remove('game');
//         } else if (themeContainerText === 'Game') {
//           document.body.classList.remove('light');
//           document.body.classList.remove('dark');
//           document.body.classList.add('game');
//           setTheme('Game');
//         }
//       });
//     });
//   });
// }

// window.onload = function () {
//   let theme = localStorage.getItem('theme');
//   defaultActive.innerText = 'Light';

//   if (theme === 'Light') {
//     document.body.classList.add('light');
//     document.body.classList.remove('dark');
//     document.body.classList.remove('game');
//     defaultActive.innerText = theme;
//   } else if (theme === 'Dark') {
//     document.body.classList.remove('light');
//     document.body.classList.add('dark');
//     document.body.classList.remove('game');
//     defaultActive.innerText = theme;
//   } else if (theme === 'Game') {
//     document.body.classList.remove('light');
//     document.body.classList.remove('dark');
//     document.body.classList.add('game');
//     defaultActive.innerText = theme;
//   }
// };
// ******************************************************************

// ******************************************************************
TweenMax.from('.left-container', 2.5, {
  opacity: 0,
  x: -30,
  ease: Expo.easeInOut,
})

TweenMax.from('.right-container', 3.5, {
  opacity: 0,
  x: 200,
  ease: Expo.ease,
})
// ******************************************************************

// ******************************************************************
$(document).ready(function () {
  let switches,
    n,
    next,
    id,
    duration = 2000,
    current = 0

  switches = $('.carousel input[name="switch"]')
  n = switches.length
  next = (current + 1) % n

  $(switches[current]).prop('checked', true)
  $('.nav_pills span:nth-child(' + (current + 1) + ')').addClass('animate')

  id = setInterval(function () {
    $(switches[next]).prop('checked', true)
    $('.nav_pills span:nth-child(' + (current + 1) + ')').removeClass('animate')
    current = next
    $('.nav_pills span:nth-child(' + (current + 1) + ')').addClass('animate')
    next = (current + 1) % n
  }, duration)

  $('.nav_pills span').click(function () {
    clearInterval(id)
    $('.nav_pills span:nth-child(' + (current + 1) + ')').removeClass('animate')
    current = $(this).index()
    next = (current + 1) % n
    $(switches[current]).prop('checked', true)
    $(this).addClass('animate')
    id = setInterval(function () {
      $(switches[next]).prop('checked', true)
      $('.nav_pills span:nth-child(' + (current + 1) + ')').removeClass(
        'animate'
      )
      current = next
      $('.nav_pills span:nth-child(' + (current + 1) + ')').addClass('animate')
      next = (current + 1) % n
    }, duration)
  })
})
// ******************************************************************
