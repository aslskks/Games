'use strict';

/**
 * Run the animation functions.
 */
Banner.prototype.start = function () {
  this.banner = document.querySelector('.banner');
  this.bannerWidth = this.banner.offsetWidth;
  this.bannerHeight = this.banner.offsetHeight;

  // Image array for preloading
  this.images = ['images/expedia-logo.png', 'images/img-01.jpeg', 'images/img-02.jpeg'];
  this.creative = {
    copy1: 'Ahorra hasta 30%<br>al armar tu viaje',
    copy2: 'Arma tu viaje<br> y ahorra<br>a tu manera',
    copy3: 'Aplican términos.',
    cta: 'Reservar'
  };
  var _this = this;
  this.preloadImages(this.images, function () {
    _this.createElements();
    _this.setup();
    _this.hidePreloader();
    _this.animate();
    _this.bindEvents();
  });
};

/**
 * Create dom elements.
 */
Banner.prototype.createElements = function () {
  /**
   * Parent Layers.
   */
  this.bgLayer = this.smartObject({
    id: 'BG-LAYER',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    height: 600,
    zIndex: 0,
    parent: this.banner
  });
  this.contentLayer = this.smartObject({
    id: 'CONTENT-LAYER',
    position: 'absolute',
    width: 300,
    height: 600,
    zIndex: 1,
    parent: this.banner
  });
  this.uiLayer = this.smartObject({
    id: 'UI-LAYER',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    height: 600,
    zIndex: 2,
    parent: this.banner
  });

  /**
   *  Layers.
   */

  this.img1 = this.smartObject({
    id: 'IMG1',
    backgroundImage: 'images/img-01.jpeg',
    width: 600,
    height: 1200,
    position: 'absolute',
    zIndex: 0,
    parent: this.bgLayer
  });
  this.logo = this.smartObject({
    id: 'LOGOHERO',
    backgroundImage: 'images/expedia-logo.png',
    width: 966,
    height: 260,
    filter: 'drop-shadow(0px 6px 20px rgba(0,0,0,0.75))',
    position: 'relative',
    retina: true,
    parent: this.contentLayer
  });
  this.logo2 = this.smartObject({
    id: 'LOGOMOCKUP',
    backgroundImage: 'images/expedia-logo.png',
    scale: 1,
    zIndex: 3,
    filter: 'drop-shadow(0px 6px 20px rgba(0,0,0,0.75))',
    position: 'relative',
    retina: true,
    parent: this.contentLayer
  });
  this.textGrid = this.smartObject({
    id: 'TEXT-GRID',
    display: 'inline-flex',
    width: 160,
    height: 600,
    zIndex: 3,
    className: 'Reckless-Book',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    parent: this.contentLayer
  });
  for (var i = 1; i <= 3; i++) {
    this["copy".concat(i)] = this.smartObject({
      id: "COPY".concat(i),
      className: 'Reckless-Book',
      position: 'relative',
      innerHTML: this.creative["copy".concat(i)],
      textAlign: 'center',
      fontSize: 28,
      color: '#191E3B',
      lineHeight: 0.3,
      parent: this.textGrid
    });
  }
  this.cta = this.smartObject({
    id: 'CTA',
    display: 'flex',
    color: 'white',
    fontSize: 10,
    zIndex: 4,
    //backgroundColor: '#191e3b00',
    className: 'Travel-Sans',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    parent: this.banner
  });
  this.ctaBG = this.smartObject({
    id: 'CTABG',
    width: 177,
    height: 57,
    zIndex: 3,
    backgroundColor: '#fddb32',
    borderRadius: 30,
    parent: this.banner
  });
  this.ctaCopy = this.smartObject({
    id: 'CTA-COPY',
    position: 'relative',
    color: '#1c2143',
    fontSize: 21,
    className: 'Travel-Sans',
    textAlign: 'center',
    padding: '14px 14px',
    innerHTML: this.creative.cta,
    parent: this.ctaBG
  });
  this.img2 = this.smartObject({
    id: 'IMG2',
    backgroundImage: 'images/img-02.jpeg',
    width: 600,
    height: 1200,
    position: 'relative',
    zIndex: 2,
    parent: this.contentLayer
  });
  this.shape1 = this.smartObject({
    id: 'SHAPE1',
    width: 350,
    height: 600,
    backgroundColor: '#fddb32',
    parent: this.uiLayer
  });
  this.shape2 = this.smartObject({
    id: 'SHAPE2',
    width: 350,
    height: 600,
    backgroundColor: '#1c2143',
    parent: this.uiLayer
  });
};

/**
 * Setup initial element states.
 */
Banner.prototype.setup = function () {
  var _this2 = this;
  gsap.set(this.textGrid, {
    top: 97,
    left: 0,
    width: 300
  });
  gsap.set(this.logo, {
    top: 163,
    left: -332,
    scale: 0.21,
    opacity: 1
  });
  gsap.set(this.logo2, {
    top: -265,
    left: -169,
    scale: 0.26,
    opacity: 0
  });
  gsap.set(this.logo3, {
    top: 150,
    left: -400,
    scale: 0.13,
    opacity: 1
  });
  gsap.set(this.copy1, {
    left: 0,
    top: -145,
    width: '90%',
    align: 'center'
  });
  gsap.set(this.copy2, {
    left: 0,
    top: -270,
    width: '90%',
    align: 'center'
  });
  gsap.set(this.copy3, {
    fontSize: 15,
    left: 0,
    top: -73,
    width: '80%',
    align: 'center',
    color: '#ffffff',
    opacity: 0,
    fontFamily: 'Travel-Sans, serif'
  });
  gsap.set(this.cta, {
    left: 82,
    top: 330,
    fontSize: 22,
    opacity: 0
  });
  gsap.set(this.ctaBG, {
    left: 62,
    top: 320,
    fontSize: 16,
    opacity: 0
  });
  gsap.set(this.img1, {
    x: -150,
    y: -302,
    opacity: 1
  });
  gsap.set(this.img2, {
    opacity: 0,
    scale: 0.52,
    x: -150,
    y: -690
  });
  gsap.set(this.img3, {
    scale: 0.53,
    x: -470,
    y: -360,
    opacity: 0
  });
  gsap.set(this.shape1, {
    opacity: 1,
    top: 650,
    left: 0
  });
  gsap.set(this.shape2, {
    opacity: 1,
    top: 650,
    left: 0
  });

  // Split the copy1 text into lines
  var splitCopy1 = new SplitType(this.copy1, {
    types: 'lines'
  });
  var splitCopy2 = new SplitType(this.copy2, {
    types: 'lines'
  });

  // Wrap each line in a background element for COPY1
  splitCopy1.lines.forEach(function (line) {
    var bg = document.createElement('span');
    bg.classList.add('line-bg', 'line-bg-copy1'); // Add unique class
    line.parentNode.insertBefore(bg, line);
    bg.appendChild(line);
  });

  // Wrap each line in a background element for COPY2
  splitCopy2.lines.forEach(function (line) {
    var bg = document.createElement('span');
    bg.classList.add('line-bg', 'line-bg-copy2'); // Add unique class
    line.parentNode.insertBefore(bg, line);
    bg.appendChild(line);
  });

  // Set initial states for COPY1 line backgrounds
  gsap.set('.line-bg-copy1', {
    //scaleX: 0,
    transformOrigin: 'left center'
  });
  gsap.set('.line-bg-copy1 .line', {
    y: 12,
    opacity: 0
  });

  // Set initial states for COPY2 line backgrounds
  gsap.set('.line-bg-copy2', {
    //scaleX: 0,
    transformOrigin: 'left center'
  });
  gsap.set('.line-bg-copy2 .line', {
    y: 12,
    opacity: 0
  });

  //this.cta.centerHorizontal();

  var ctaOver = function ctaOver() {
    gsap.to(_this2.ctaBG, 0.2, {
      backgroundColor: 'white',
      color: '#fddb32',
      ease: Power3.easeOut
    });
    gsap.to(_this2.ctaCopy, 0.2, {
      color: '#1c2143',
      ease: Power3.easeOut
    });
  };
  var ctaOut = function ctaOut() {
    gsap.to(_this2.ctaBG, 0.2, {
      backgroundColor: '#fddb32',
      color: '#1c2143',
      ease: Power3.easeOut
    });
    gsap.to(_this2.ctaCopy, 0.2, {
      color: '#1c2143',
      ease: Power3.easeOut
    });
  };
  this.ctaBG.addEventListener('mouseover', function () {
    ctaOver();
  });
  this.ctaBG.addEventListener('mouseout', function () {
    ctaOut();
  });
};

/**
 * Hide the preloader.
 */
Banner.prototype.hidePreloader = function () {
  gsap.to('.preloader', {
    duration: 1,
    autoAlpha: 0
  });
};

/**
 * Animation timeline.
 */
Banner.prototype.animate = function () {
  this.timelineLogo = gsap.timeline({
    delay: 1
  });
  this.timelineLogo
  /**
  *
      .from(this.logo, {
      duration: 0,
      autoAlpha: 0,
      y: -10,
      ease: 'sine.out'
    })
    */.to(this.logo, {
    duration: 0.5,
    opacity: 0,
    // y: -215,
    ease: 'power2.out'
  }, '+=2').to(this.logo, {
    duration: 0,
    opacity: 1,
    top: 110,
    x: -2,
    scale: 0.2,
    ease: 'power2.out'
  }, 'frame2+=9.5');
  this.timeline = gsap.timeline({
    delay: 2
  });
  this.timeline

  // ---- FRAME 2 START ----
  .addLabel('frame2').to(this.logo2, {
    duration: 0.7,
    autoAlpha: 1,
    y: -20,
    ease: 'sine.out'
  }, 'frame2+=1.6').to(this.logo2, {
    duration: 0.2,
    opacity: 0,
    ease: 'sine.out'
  }, 'frame2+=11');
  this.timeline = gsap.timeline({
    delay: 2
  });
  this.timeline

  // COPY1 animation - from bottom to top
  .to('.line-bg-copy1 .line', {
    duration: 0.5,
    y: 1,
    opacity: 1,
    stagger: 0.2,
    ease: 'power3.out'
  }, 'frame2+=1.8').from(this.copy1, {
    duration: 0.5,
    autoAlpha: 1,
    y: 80,
    //stagger: 0.5,
    ease: 'power3.out'
  }, 'frame2+=1.8')

  // COPY1 disappears at second 3 (1 second after frame2 which starts at delay 2)
  .to('.line-bg-copy1 .line', {
    duration: 0.3,
    opacity: 0,
    y: -10,
    ease: 'power2.in'
  }, 'frame2+=5.4').to('.line-bg-copy1', {
    duration: 0.3,
    stagger: 0.5,
    ease: 'power2.in'
  }, 'frame2+=5.4')

  // COPY2 animation - appears at second 3, from bottom to top
  .to('.line-bg-copy2 .line', {
    duration: 0.5,
    y: 1,
    opacity: 1,
    stagger: 0.2,
    ease: 'power3.out'
  }, 'frame2+=7').from(this.copy2, {
    duration: 0.5,
    autoAlpha: 1,
    y: 80,
    stagger: 0.5,
    ease: 'power3.out'
  }, 'frame2+=5.8')

  // COPY2 disappears at second 5 (3 seconds after frame2)
  .to('.line-bg-copy2 .line', {
    duration: 0.2,
    opacity: 0,
    ease: 'power2.in'
  }, 'frame2+=10.7').to('.line-bg-copy2', {
    duration: 0.2,
    ease: 'power2.in'
  }, 'frame2+=10.7')

  // CTA
  .to(this.cta, {
    duration: 0.5,
    opacity: 1,
    y: 0,
    ease: 'sine.out'
  }, 'frame2+=11.5').to(this.ctaBG, {
    duration: 0.7,
    autoAlpha: 1,
    scaleX: 1,
    ease: 'elastic.out'
  }, 'frame2+=11.5').to(this.ctaBG, {
    scale: 0.9,
    opacity: 1,
    duration: 0.25,
    ease: 'power1.out'
  }).to(this.ctaBG, {
    scale: 1,
    duration: 0.2,
    ease: 'power1.out'
  });
  this.timeline3 = gsap.timeline({
    delay: 1.8
  });
  this.timeline3.fromTo(this.img2, {
    clipPath: 'inset(18% 7% 6.5% 7% round 20px)',
    // small centered rectangle with rounded corners
    opacity: 1
    //y: 0
  }, {
    duration: 1,
    clipPath: 'inset(0% 0% 0% 0% round 25px)',
    ease: 'power3.in'
  }, 'frame3+=6.5').from(this.img2, {
    duration: 0.7,
    y: -14,
    ease: 'power.out'
  }, 'frame3+=5.5').to(this.img2, {
    duration: 0.5,
    opacity: 1,
    //y: 14,
    ease: 'sine.out'
  }, 'frame3+=5.5').to(this.img2, {
    duration: 0.2,
    opacity: 0,
    ease: 'sine.out'
  }, 'frame3+=11.2')

  // SCALE IMAGE 2
  .to(this.img2, {
    duration: 14,
    scale: 0.6,
    ease: 'none'
  }, 'frame3+=6.6').to(this.copy3, {
    duration: 0.5,
    opacity: 1,
    ease: 'sine.out'
  }, 'frame3+=11.5').to(this.shape1, {
    duration: 0.7,
    top: -600,
    opacity: 1,
    ease: 'sine.out'
  }, 'frame3+=11').to(this.shape2, {
    duration: 0.7,
    top: -600,
    opacity: 1,
    ease: 'sine.out'
  }, 'frame3+=11.1');
  this.timeline = gsap.timeline({
    delay: 0
  });
  this.timeline;
  this.timeline
  // FIRST MOVE
  .set(this.img1, {
    scale: 0.5
  }).to(this.img1, {
    duration: 9,
    scale: 0.6,
    ease: 'none'
  })

  // HARD RESET
  .set(this.img1, {
    scale: 0.5
  }, '+=1')

  // SECOND MOVE 
  .to(this.img1, {
    duration: 9,
    scale: 0.6,
    ease: 'none'
  });
};