const nav = document.querySelector(".navlist");
const btnForNav = document.querySelector(".bx-menu-alt-right");

const themeContainer = document.querySelector(".theme-container");
const themeContainerIcon = document.querySelector(".bx-search-alt");
const themeListItems = document.querySelectorAll(".item");
const defaultActive = document.querySelector(".default");

const btnTopSignIn = document.querySelectorAll(".btnToSignIn");
const btnRegister = document.querySelector(".btnRegister");
const btnToLogin = document.querySelector(".btnToLogin");

const signin = document.querySelector(".signin");
const test = document.querySelector(".test");



setTimeout(() => {
  signin.classList.remove("pop-up");

  if (!signin.classList.contains("pop-up")) {
    test.style.cssText = `
      background: rgba(0, 0, 0, 0.5);
      z-index: -1;
    `;
  }
}, 3000);

if (btnForNav) {
  btnForNav.addEventListener("click", () => {
    nav.classList.toggle("open-navlist");
    btnForNav.classList.toggle("bx-x");
  });
}

const shop_now = document.querySelector(".shop_now");
if (shop_now) {
  shop_now.addEventListener("click", () => {
    window.location.href = "http://localhost:3000/products";
  });
}

function setTheme(theme) {
  let body = document.querySelector('body')
  body.className = ''
  body.classList.add(theme)
  localStorage.setItem('theme', theme)
} 

if (themeContainer) {
  themeContainer.addEventListener("click", (e) => {
    themeContainer.classList.toggle("open-theme-list");

    themeListItems.forEach((element) => {
      element.addEventListener("click", () => {
        let themeContainerText = element.innerText;
        defaultActive.innerText = themeContainerText;

        if (themeContainerText === "Light") {
          document.body.classList.add("light");
          setTheme('Light')
          document.body.classList.remove("dark");
          document.body.classList.remove("game");
        } else if (themeContainerText === "Dark") {
          document.body.classList.remove("light");
          document.body.classList.add("dark");
          setTheme('Dark')
          document.body.classList.remove("game");
        } else if (themeContainerText === "Game") {
          document.body.classList.remove("light");
          document.body.classList.remove("dark");
          document.body.classList.add("game");
          setTheme('Game')
        }
      });
    });
  });
}

window.onload = function() {
  let theme = localStorage.getItem('theme')
  defaultActive.innerText = 'Light'

  if (theme === "Light") {
    document.body.classList.add("light");
    document.body.classList.remove("dark");
    document.body.classList.remove("game");
  defaultActive.innerText = theme

  } else if (theme === "Dark") {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
    document.body.classList.remove("game");
  defaultActive.innerText = theme

  } else if (theme === "Game") {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");
    document.body.classList.add("game");
  defaultActive.innerText = theme
  }
}

btnTopSignIn.forEach((e) => {
  e.addEventListener("click", () => {
    window.location.href = "http://localhost:3000/login";
  });
});

if (btnRegister) {
  btnRegister.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "http://localhost:3000/register";
  });
}

if (btnToLogin) {
  btnToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "http://localhost:3000/login";
  });
}

const topToggle = document.querySelector(".top-toggle");
const carItem = document.querySelectorAll(".car-item");
const selected = document.querySelector(".selected");
let itemSelected = "";
if (topToggle) {
  topToggle.addEventListener("click", () => {
    topToggle.classList.toggle("open-bottom");
    carItem.forEach((item) => {
      item.addEventListener("click", () => {
        itemSelected = item.innerText;
        displayPicked(itemSelected);
        selected.innerText = itemSelected;
        topToggle.classList.remove("open-bottom");
      });
    });
  });
}

// const carBattery = document.querySelector(".car-battery");
const productsArea = document.querySelector(".products-area");
const show = document.querySelectorAll(".show");
function displayPicked(string) {
  if (string === "Car Battery") {
    show.forEach((item) => {
      item.style.cssText = `display: none !important;`;
    });

    productsArea.classList.add("car-battery");

    productsArea.classList.remove("car-brakes");
    productsArea.classList.remove("car-engine");
    productsArea.classList.remove("car-mags");
    productsArea.classList.remove("car-muffler");
    productsArea.classList.remove("car-brakes");
    productsArea.classList.remove("car-radiator");
    productsArea.classList.remove("car-steering-wheel");
  } else if (string === "Car Brakes") {
    productsArea.classList.add("car-brakes");

    productsArea.classList.remove("car-battery");
    productsArea.classList.remove("car-engine");
    productsArea.classList.remove("car-mags");
    productsArea.classList.remove("car-muffler");
    productsArea.classList.remove("car-radiator");
    productsArea.classList.remove("car-steering-wheel");
  } else if (string === "Car Engine") {
    productsArea.classList.add("car-engine");

    productsArea.classList.remove("car-battery");
    productsArea.classList.remove("car-brakes");
    productsArea.classList.remove("car-mags");
    productsArea.classList.remove("car-muffler");
    productsArea.classList.remove("car-radiator");
    productsArea.classList.remove("car-steering-wheel");
  } else if (string === "Car Mags") {
    productsArea.classList.add("car-mags");

    productsArea.classList.remove("car-battery");
    productsArea.classList.remove("car-brakes");
    productsArea.classList.remove("car-engine");
    productsArea.classList.remove("car-muffler");
    productsArea.classList.remove("car-radiator");
    productsArea.classList.remove("car-steering-wheel");
  } else if (string === "Car Muffler") {
    productsArea.classList.add("car-muffler");

    productsArea.classList.remove("car-battery");
    productsArea.classList.remove("car-mags");
    productsArea.classList.remove("car-brakes");
    productsArea.classList.remove("car-engine");
    productsArea.classList.remove("car-radiator");
    productsArea.classList.remove("car-steering-wheel");
  } else if (string === "Car Radiator") {
    productsArea.classList.add("car-radiator");

    productsArea.classList.remove("car-battery");
    productsArea.classList.remove("car-mags");
    productsArea.classList.remove("car-brakes");
    productsArea.classList.remove("car-muffler");
    productsArea.classList.remove("car-engine");
    productsArea.classList.remove("car-steering-wheel");
  } else if (string === "Car Steering Wheel") {
    productsArea.classList.add("car-steering-wheel");

    productsArea.classList.remove("car-battery");
    productsArea.classList.remove("car-mags");
    productsArea.classList.remove("car-radiator");
    productsArea.classList.remove("car-brakes");
    productsArea.classList.remove("car-muffler");
    productsArea.classList.remove("car-engine");
  }
}

// const payNowBtn = document.querySelector(".payNowBtn");
// if (payNowBtn) {
//   payNowBtn.addEventListener("click", () => {
//     console.log(req.user);
//   });
// }




TweenMax.from(".left-container", 2.5, {
  opacity: 0,
  x: -30,
  ease: Expo.easeInOut,
});

TweenMax.from(".right-container", 3.5, {
  opacity: 0,
  x: 200,
  ease: Expo.ease,
});

// ads js
$(document).ready(function () {
  let switches,
    n,
    next,
    id,
    duration = 2000,
    current = 0;

  switches = $('.carousel input[name="switch"]');
  n = switches.length;
  next = (current + 1) % n;

  $(switches[current]).prop("checked", true);
  $(".nav_pills span:nth-child(" + (current + 1) + ")").addClass("animate");

  id = setInterval(function () {
    $(switches[next]).prop("checked", true);
    $(".nav_pills span:nth-child(" + (current + 1) + ")").removeClass(
      "animate"
    );
    current = next;
    $(".nav_pills span:nth-child(" + (current + 1) + ")").addClass("animate");
    next = (current + 1) % n;
  }, duration);

  $(".nav_pills span").click(function () {
    clearInterval(id);
    $(".nav_pills span:nth-child(" + (current + 1) + ")").removeClass(
      "animate"
    );
    current = $(this).index();
    next = (current + 1) % n;
    $(switches[current]).prop("checked", true);
    $(this).addClass("animate");
    id = setInterval(function () {
      $(switches[next]).prop("checked", true);
      $(".nav_pills span:nth-child(" + (current + 1) + ")").removeClass(
        "animate"
      );
      current = next;
      $(".nav_pills span:nth-child(" + (current + 1) + ")").addClass("animate");
      next = (current + 1) % n;
    }, duration);
  });
});

// ads js
