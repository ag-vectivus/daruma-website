'use strict';

// Navigation Menu

(function() {
// IIFE, Navigation Menu behavior

  // DOM elements
  const navButton = document.querySelector('.js-navigation__button--show-menu');
  const navMenu = document.getElementById('js-navigation__menu');
  const navMenuList = 'navigation__menu-list';
  const dotNavMenuList = '.navigation__menu-list';
  const navMenuBar = 'navigation__menu-bar';
  const dotNavMenuBar = '.navigation__menu-bar';
  const eventElement = ['header', 'main', 'footer'];
  
  let navigationGuard = 0; // make sure that eventListeners are created only once

  const navBehavior = function() {
    // Check inner width and set navigation menu type

    if (window.innerWidth < 800) {
      // Create dropdown menu list (for narrower screeens)
      navMenu.classList.remove(navMenuBar);
      navMenu.classList.add(navMenuList);
      document.querySelector(dotNavMenuList).style.display='none';

      if (document.querySelector(dotNavMenuList) && navigationGuard != 1) {
      
        // click the button to show the menu
        navButton.addEventListener('click', function() {
          document.querySelector(dotNavMenuList).style.display='block', true;
        });

        // get cursor out of the menu list to hide it - dedicated for users using mouse
        document.querySelector(dotNavMenuList).addEventListener('mouseleave', function() {
          if (document.querySelector(dotNavMenuList) != null){
            document.querySelector(dotNavMenuList).style.display='none', true;
          };
        });

        // click any place on the website (exclusive nav) to hide the menu - dedicated for touchscreen
        for(let i = 0; i < eventElement.length; i++) {
          document.querySelector(eventElement[i]).addEventListener('click', function() {
            if (document.querySelector(dotNavMenuList) != null){
              document.querySelector(dotNavMenuList).style.display='none', true;
            };
          });
        };
      
        // focus out the last element of the menu list to hide it - dedicated for keyboard users
        navMenu.lastElementChild.addEventListener('focusout', function() {
          if (document.querySelector(dotNavMenuList) != null){
            document.querySelector(dotNavMenuList).style.display='none', true;
          };
        });
      };

      navigationGuard++;

    } else {
      // Create horizontal menu bar (for wider screens)
      navMenu.classList.remove(navMenuList);
      navMenu.classList.add(navMenuBar);
      document.querySelector(dotNavMenuBar).style.display='flex';
    };
  };

  navBehavior();
  window.onresize = navBehavior;
}());



// Aside Curiosity

(function() {
  // IIFE, Curiosity slider

    // settings for slider
    const width = 270;
    const pause = 10000;

    // DOM element
    const slideContainer = document.querySelector('.curiosity__slides');

    let interval;
    function moveSlide() {
      // check the current slide and move next slide
      let maxMargin = -(width * (document.querySelectorAll('.curiosity__slide').length - 1));
      let marginLeftValue = getComputedStyle(slideContainer).marginLeft;
      if (marginLeftValue === `${maxMargin}px`) {
        // if it's the last slide - display first slide
        slideContainer.style.marginLeft='0';
      } else {
        // display next slide
        let newMargin = (parseInt(marginLeftValue, 10)) - width;
        slideContainer.style.marginLeft=`${newMargin}px`;
      };
    };

    function stopSlider() {
      clearInterval(interval)
    };
    
    function startSlider() {
      interval = setInterval(moveSlide, pause);
    };  
     
    // interaction with the user
    document.querySelector('.curiosity__slider').addEventListener('mouseover', stopSlider);
    document.querySelector('.curiosity__slider').addEventListener('mouseleave', startSlider);

    startSlider();
}());



// Aside Gallery

(function() {
  // IIFE, choose photos for the Aside Gallery and add them to the site

  // On this stage is important to name photos starting from 1 and ++nextPhoto.
  // As I don't want to use server side programming on this stage of that project - I've prepared less flexible version of taking photo - photo must be named in special way as it's written above.

  const gallery = document.querySelector('.gallery__grid');

  const numberOfPictures = 15; // !!!!!!! SET HERE NUMBER OF PICTURES
  const imageMiniatures = [];

  function generateNumber(min, max) {
    // generate random number in range from min to max, including min and max
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  (function chooseImages() {
    // IIFE, generate 9 numbers and add them to the array

    while (imageMiniatures.length < 9 || imageMiniatures === null) {

      let imageNumber = generateNumber(1, numberOfPictures);
      
      // check generated number to avoid repeating it

      let i = 0;
      while (i !== (imageMiniatures.length + 1)) {
        if (imageNumber === imageMiniatures[i]) {
          break;
        } else if (i === imageMiniatures.length) {
          imageMiniatures.push(imageNumber);
        } else {
          i++;
        }
      };
    };
  }());

  // Loop through images using numbers from the array and add them to the website aside gallery
  
  for(let i = 0; i < 9; i++) {

    const newImage = document.createElement('img');

    // Check the adress of current subdomain and set the relative url dependent of result
    // I have chosen this way to provide working this script properly in local depository
    // if (window.location.href.indexOf('/daruma-website/index.html') >= 0) {
    //   newImage.setAttribute('src', 'images/gallery/' + imageMiniatures[i] + '-Daruma-320w' + '.jpg');
    // } else {
    //   newImage.setAttribute('src', '../images/gallery/' + imageMiniatures[i] + '-Daruma-320w' + '.jpg');
    // }

    newImage.setAttribute('src', 'https://ag-vectivus.github.io/daruma-website/images/gallery/' + imageMiniatures[i] + '-Daruma-320w' + '.jpg');
    
    newImage.setAttribute('class', 'gallery__image');
    newImage.setAttribute('tabindex', '0');
    newImage.setAttribute('data-number', i);

    gallery.appendChild(newImage);
  }
}());

(function() {
  // IIFE - generate lightbox after click on image in aside gallery
  const lightboxImages = document.querySelectorAll('.gallery__image');

  function checkImageSize(clickedMiniature) {
    // check window size and set proper image
    if (window.innerWidth < 480) {
      return clickedMiniature
    } else if (window.innerWidth >= 480 && window.innerWidth < 800) {
      return clickedMiniature.replace('320', '480');
    } else if (window.innerWidth >= 800 && window.innerWidth < 1100) {
      return clickedMiniature.replace('320', '800');
    } else {
      return clickedMiniature.replace('320', '1100');
    };
  };

  function showLightboxImage() {
    // display clicked image in lightbox
      const clickedMiniature = this.getAttribute('src');
      const imageVersion = checkImageSize(clickedMiniature);
      document.querySelector('.lightbox__image').src=`${imageVersion}`;
      document.querySelector('.gallery__lightbox').style.display='block';

      // hide footer__up button to not display over lightbox
      document.querySelector('.footer__up-button').style.display='none';
  };

  lightboxImages.forEach(lightboxImage => lightboxImage
    .addEventListener('click', showLightboxImage));

  document.querySelector('.gallery__lightbox').addEventListener('click', function(){
    document.querySelector('.gallery__lightbox').style.display='none';

  // show footer__up button after closing lightbox
  document.querySelector('.footer__up-button').style.display='inline-block';
  });

  window.addEventListener('keydown', function(e){
    if (e.keyCode === 27) {
      document.querySelector('.gallery__lightbox').style.display='none';
      document.querySelector('.footer__up-button').style.display='inline-block';
    };
  });

  document.querySelector('.gallery__lightbox').addEventListener('click', function(e){
    if(e.target.querySelector == '.gallery__lightbox'){
      document.querySelector('.gallery__lightbox').className = '';
    }
  });
}());



// Footer

(function() {
  // IIFE, Show and hide list in footer.
  const footerParaDropdown = document.querySelectorAll('.js-footer__paragraph--dropdown');
  footerParaDropdown.forEach(footerPara => footerPara.addEventListener('click', function() {
    const footerPara = this;
      footerPara.nextElementSibling.classList.toggle('footer__paragraph--dropdown');
  }));
}());

(function() {
    // IIFE Show an information about unavailability of social media.
    const socialMediaButtons = document.querySelectorAll('.footer__end-button');
    socialMediaButtons.forEach(buttonId => buttonId.addEventListener('click', function() {
      let buttonId = this.getAttribute('data-buttonId');
      let buttonIdCapitalized = buttonId.charAt(0).toUpperCase() + buttonId.slice(1);
      alert(buttonIdCapitalized + ' nie jest w tym momencie dostępny.');
    }));
}());



// Global function - provide access for keyboard users

document.onkeydown = function(e) {
  // Allow to focus elements
  if(e.keyCode === 13) { // The Enter/Return key
    document.activeElement.click();
  }
};

// Global function - click footer up button to scroll to the top of the page

document.querySelector('.footer__up-button').addEventListener('click', function() {
  window.scrollTo({top: 0, behavior:'smooth'});
});