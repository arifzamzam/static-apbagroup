(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

    /**
   * Init swiper slider with 1 slide at once in desktop view
   */
  new Swiper('.slides-1', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  /**
   * Init swiper slider with 3 slides at once in desktop view
   */
  new Swiper('.slides-3', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 40
      },

      1200: {
        slidesPerView: 3,
      }
    }
  });

    /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Product Image Zoom and Thumbnail Functionality
   */

  function productDetailFeatures() {
    // Initialize Drift for image zoom
    function initDriftZoom() {
      // Check if Drift is available
      if (typeof Drift === 'undefined') {
        console.error('Drift library is not loaded');
        return;
      }

      const driftOptions = {
        paneContainer: document.querySelector('.image-zoom-container'),
        inlinePane: window.innerWidth < 768 ? true : false,
        inlineOffsetY: -85,
        containInline: true,
        hoverBoundingBox: false,
        zoomFactor: 3,
        handleTouch: false
      };

      // Initialize Drift on the main product image
      const mainImage = document.getElementById('main-product-image');
      if (mainImage) {
        new Drift(mainImage, driftOptions);
      }
    }

    // Thumbnail click functionality
    function initThumbnailClick() {
      const thumbnails = document.querySelectorAll('.thumbnail-item');
      const mainImage = document.getElementById('main-product-image');

      if (!thumbnails.length || !mainImage) return;

      thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
          // Get image path from data attribute
          const imageSrc = this.getAttribute('data-image');

          // Update main image src and zoom attribute
          mainImage.src = imageSrc;
          mainImage.setAttribute('data-zoom', imageSrc);

          // Update active state
          thumbnails.forEach(item => item.classList.remove('active'));
          this.classList.add('active');

          // Reinitialize Drift for the new image
          initDriftZoom();
        });
      });
    }

    // Image navigation functionality (prev/next buttons)
    function initImageNavigation() {
      const prevButton = document.querySelector('.image-nav-btn.prev-image');
      const nextButton = document.querySelector('.image-nav-btn.next-image');

      if (!prevButton || !nextButton) return;

      const thumbnails = Array.from(document.querySelectorAll('.thumbnail-item'));
      if (!thumbnails.length) return;

      // Function to navigate to previous or next image
      function navigateImage(direction) {
        // Find the currently active thumbnail
        const activeIndex = thumbnails.findIndex(thumb => thumb.classList.contains('active'));
        if (activeIndex === -1) return;

        let newIndex;
        if (direction === 'prev') {
          // Go to previous image or loop to the last one
          newIndex = activeIndex === 0 ? thumbnails.length - 1 : activeIndex - 1;
        } else {
          // Go to next image or loop to the first one
          newIndex = activeIndex === thumbnails.length - 1 ? 0 : activeIndex + 1;
        }

        // Simulate click on the new thumbnail
        thumbnails[newIndex].click();
      }

      // Add event listeners to navigation buttons
      prevButton.addEventListener('click', () => navigateImage('prev'));
      nextButton.addEventListener('click', () => navigateImage('next'));
    }

    // Initialize all features
    initDriftZoom();
    initThumbnailClick();
    initImageNavigation();
  }

  productDetailFeatures();

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

document.querySelectorAll('a.scroll-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  });
});

// success story
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    992: {
      slidesPerView: 4,
    }
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  }
});

// Maps
  document.addEventListener("DOMContentLoaded", function () {
    const provinsiData = {
      "ID-AC": { nama: "Aceh", info: "Provinsi paling barat Indonesia. Ibu kota: Banda Aceh." },
      "ID-SU": { nama: "Sumatera Utara", info: "Ibu kota: Medan." },
      "ID-SB": { nama: "Sumatera Barat", info: "Ibu kota: Padang." },
      "ID-RI": { nama: "Riau", info: "Ibu kota: Pekanbaru." },
      "ID-JA": { nama: "Jambi", info: "Ibu kota: Jambi." },
      "ID-SS": { nama: "Sumatera Selatan", info: "Ibu kota: Palembang." },
      "ID-BE": { nama: "Bengkulu", info: "Ibu kota: Bengkulu." },
      "ID-LA": { nama: "Lampung", info: "Ibu kota: Bandar Lampung." },
      "ID-BB": { nama: "Kepulauan Bangka Belitung", info: "Ibu kota: Pangkal Pinang." },
      "ID-KR": { nama: "Kepulauan Riau", info: "Ibu kota: Tanjungpinang." },
      "ID-JK": { nama: "DKI Jakarta", info: "Ibu kota negara Indonesia." },
      "ID-BT": { nama: "Banten", info: "Ibu kota: Serang." },
      "ID-JB": { nama: "Jawa Barat", info: "Ibu kota: Bandung." },
      "ID-JT": { nama: "Jawa Tengah", info: "Ibu kota: Semarang." },
      "ID-YO": { nama: "DI Yogyakarta", info: "Ibu kota: Yogyakarta." },
      "ID-JI": { nama: "Jawa Timur", info: "Ibu kota: Surabaya." },
      "ID-BA": { nama: "Bali", info: "Pulau wisata terkenal. Ibu kota: Denpasar." },
      "ID-NB": { nama: "Nusa Tenggara Barat", info: "Ibu kota: Mataram." },
      "ID-NT": { nama: "Nusa Tenggara Timur", info: "Ibu kota: Kupang." },
      "ID-KB": { nama: "Kalimantan Barat", info: "Ibu kota: Pontianak." },
      "ID-KT": { nama: "Kalimantan Tengah", info: "Ibu kota: Palangka Raya." },
      "ID-KS": { nama: "Kalimantan Selatan", info: "Ibu kota: Banjarmasin." },
      "ID-KI": { nama: "Kalimantan Timur", info: "Ibu kota: Samarinda." },
      "ID-KU": { nama: "Kalimantan Utara", info: "Ibu kota: Tanjung Selor." },
      "ID-SA": { nama: "Sulawesi Utara", info: "Ibu kota: Manado." },
      "ID-ST": { nama: "Sulawesi Tengah", info: "Ibu kota: Palu." },
      "ID-SN": { nama: "Sulawesi Selatan", info: "Ibu kota: Makassar." },
      "ID-SG": { nama: "Sulawesi Tenggara", info: "Ibu kota: Kendari." },
      "ID-SR": { nama: "Sulawesi Barat", info: "Ibu kota: Mamuju." },
      "ID-GO": { nama: "Gorontalo", info: "Ibu kota: Gorontalo." },
      "ID-MA": { nama: "Maluku", info: "Ibu kota: Ambon." },
      "ID-MU": { nama: "Maluku Utara", info: "Ibu kota: Sofifi." },
      "ID-PA": { nama: "Papua", info: "Ibu kota: Jayapura." },
      "ID-PB": { nama: "Papua Barat", info: "Ibu kota: Manokwari." },
      "ID-PP": { nama: "Papua Pegunungan", info: "Ibu kota: Wamena." },
      "ID-PY": { nama: "Papua Selatan", info: "Ibu kota: Merauke." },
      "ID-PT": { nama: "Papua Tengah", info: "Ibu kota: Nabire." },
      "ID-PB": { nama: "Papua Barat Daya", info: "Ibu kota: Sorong." }
    };


    // Klik pada path SVG
    Object.keys(provinsiData).forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("click", function () {
          const data = provinsiData[id];
          showModal(data.nama, data.info);
        });
      }
    });

    // Klik pada PIN Bootstrap Icon
    document.querySelectorAll('.pin[data-provinsi]').forEach(pin => {
      pin.addEventListener('click', function () {
        const provinsiId = this.getAttribute('data-provinsi');
        const data = provinsiData[provinsiId];
        if (data) showModal(data.nama, data.info);
      });
    });

    function showModal(nama, info) {
      document.getElementById("provinsiTitle").innerText = nama;
      document.getElementById("provinsiContent").innerText = info;
      const modal = new bootstrap.Modal(document.getElementById('provinsiModal'));
      modal.show();
    }
  });
