const nav = document.querySelector('.navlist');
const btnForNav = document.querySelector('.bx-menu-alt-right');

const themeContainer = document.querySelector('.theme-container');
const themeContainerIcon = document.querySelector('.bx-search-alt');
const themeListItems = document.querySelectorAll('.item');
const defaultActive = document.querySelector('.default');

const btnTopSignIn = document.querySelectorAll('.btnToSignIn');
const btnRegister = document.querySelector('.btnRegister');
const btnToLogin = document.querySelector('.btnToLogin');


if(btnForNav) {
    btnForNav.addEventListener('click', () => {
        nav.classList.toggle('open-navlist');
        btnForNav.classList.toggle('bx-x');
    });
}

if(themeContainer) {
    themeContainer.addEventListener('click', (e) => {
        themeContainer.classList.toggle('open-theme-list')
    
        themeListItems.forEach(element => {
            element.addEventListener('click', () => {
                let themeContainerText = element.innerText;
                defaultActive.innerText = themeContainerText;
               
                if(themeContainerText === 'Light') {
                    document.body.classList.add('light');
                    document.body.classList.remove('dark');
                    document.body.classList.remove('game');
                } else if(themeContainerText === 'Dark') {
                    document.body.classList.remove('light');
                    document.body.classList.add('dark');
                    document.body.classList.remove('game');
                } else if(themeContainerText === 'Game') {
                    document.body.classList.remove('light');
                    document.body.classList.remove('dark');
                    document.body.classList.add('game');
                }
            })
        });
    });
}

btnTopSignIn.forEach(e => {
    e.addEventListener('click', () => {
        window.location.href = 'http://localhost:3000/login';
    })
})

if(btnRegister) {
    btnRegister.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'http://localhost:3000/register';
    })
}

if(btnToLogin) {
    btnToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'http://localhost:3000/login';
    })
}

TweenMax.from('.navlist, .logo-container', 2, {
    opacity: 0,
    y: -20,
    ease: Expo.easeInOut
});

TweenMax.from('.left-container', 2.5, {
    opacity: 0,
    x: -30,
    ease: Expo.easeInOut
});

TweenMax.from('.right-container', 3.5, {
    opacity: 0,
    x: 200,
    ease: Expo.ease
});

