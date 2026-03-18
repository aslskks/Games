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
    copy2: 'Arma tu viaje<br>y ahorra a tu manera',
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
    width: 728,
    height: 900,
    zIndex: 0,
    parent: this.banner
  });
  this.contentLayer = this.smartObject({
    id: 'CONTENT-LAYER',
    position: 'absolute',
    width: 728,
    height: 90,
    zIndex: 1,
    parent: this.banner
  });
  this.uiLayer = this.smartObject({
    id: 'UI-LAYER',
    position: 'absolute',
    top: 0,
    left: 0,
    width: 728,
    height: 90,
    zIndex: 2,
    parent: this.banner
  });

  /**
   *  Layers.
   */

  this.img1 = this.smartObject({
    id: 'IMG1',
    backgroundImage: 'images/img-01.jpeg',
    width: 1456,
    height: 180,
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
    display: 'flex',
    width: 160,
    height: 600,
    zIndex: 3,
    //gap: '6px',
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
      fontSize: 21,
      innerHTML: this.creative["copy".concat(i)],
      textAlign: 'center',
      color: '#191E3B',
      lineHeight: 0.4,
      parent: this.textGrid
    });
  }
  this.cta = this.smartObject({
    id: 'CTA',
    display: 'flex',
    color: 'white',
    //fontSize: 10,
    zIndex: 4,
    backgroundColor: '#191e3b00',
    className: 'Travel-Sans',
    weight: 'light',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    parent: this.banner
  });
  this.ctaBG = this.smartObject({
    id: 'CTABG',
    width: 130,
    height: 40,
    zIndex: 3,
    backgroundColor: '#fddb32',
    borderRadius: 30,
    parent: this.banner
  });
  this.ctaCopy = this.smartObject({
    id: 'CTA-COPY',
    position: 'relative',
    color: '#1c2143',
    fontSize: 15,
    align: 'center',
    fontFamily: 'Travel-Sans',
    padding: '10px 21px',
    innerHTML: this.creative.cta,
    parent: this.ctaBG
  });
  this.img2 = this.smartObject({
    id: 'IMG2',
    backgroundImage: 'images/img-02.jpeg',
    width: 1456,
    height: 180,
    position: 'relative',
    zIndex: 2,
    parent: this.contentLayer
  });
  this.shape1 = this.smartObject({
    id: 'SHAPE1',
    width: 970,
    height: 300,
    backgroundColor: '#fddb32',
    parent: this.uiLayer
  });
  this.shape2 = this.smartObject({
    id: 'SHAPE2',
    width: 970,
    height: 300,
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
    top: -89,
    left: -115,
    scale: 0.19,
    opacity: 1
  });
  gsap.set(this.logo2, {
    top: -263,
    left: -140,
    scale: 0.35,
    opacity: 0
  });
  gsap.set(this.logo3, {
    top: 150,
    left: -400,
    scale: 0.13,
    opacity: 1
  });
  gsap.set(this.copy1, {
    left: 415,
    top: -318,
    width: '90%',
    align: 'center'
  });
  gsap.set(this.copy2, {
    left: 416,
    top: -384,
    width: '90%',
    align: 'center'
  });
  gsap.set(this.copy3, {
    fontSize: 11,
    left: 480,
    top: -416,
    width: '80%',
    align: 'center',
    color: '#ffffff',
    opacity: 0,
    fontFamily: 'Travel-Sans'
  });
  gsap.set(this.cta, {
    left: 427,
    top: 34,
    fontSize: 16,
    opacity: 0
  });
  gsap.set(this.ctaBG, {
    left: 400,
    top: 25,
    opacity: 0
  });
  gsap.set(this.img1, {
    x: -380,
    y: -44,
    opacity: 1
  });
  gsap.set(this.img2, {
    opacity: 0,
    scale: 0.52,
    x: -370,
    y: -435
  });
  gsap.set(this.img3, {
    scale: 0.53,
    x: -470,
    y: -360,
    opacity: 0
  });
  gsap.set(this.shape1, {
    opacity: 1,
    top: 250,
    left: 0
  });
  gsap.set(this.shape2, {
    opacity: 1,
    top: 250,
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

  //CTA hover

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
  this.banner.addEventListener('mouseover', function () {
    ctaOver();
  });
  this.banner.addEventListener('mouseout', function () {
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
  var _this3 = this;
  this.timelineLogo = gsap.timeline({
    delay: 1
  });
  this.timelineLogo.to(this.logo, {
    duration: 0.5,
    opacity: 0,
    ease: 'power2.out'
  }, '+=2').to(this.logo, {
    duration: 0.2,
    opacity: 1,
    top: -90,
    x: -260,
    scale: 0.19,
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
  .to('.line-bg-copy1', {
    duration: 0.5,
    //stagger: 0.5,
    ease: 'power3.out'
  }, 'frame2+=1.8').to('.line-bg-copy1 .line', {
    duration: 0.5,
    y: 1,
    opacity: 1,
    stagger: 0.2,
    ease: 'power3.out'
  }, 'frame2+=1.8').from(this.copy1, {
    duration: 0.5,
    autoAlpha: 1,
    y: 80,
    // stagger: 0.4,
    ease: 'power3.out'
  }, 'frame2+=1.8')

  // COPY1 disappears 
  .to('.line-bg-copy1 .line', {
    duration: 0.3,
    opacity: 0,
    y: -10,
    ease: 'power2.in'
  }, 'frame2+=5.4').to('.line-bg-copy1', {
    duration: 0.3,
    //scaleX: 0,
    stagger: 0.5,
    ease: 'power2.in'
  }, 'frame2+=5.4')

  // COPY2 animation - appears at second 3, from bottom to top
  .to('.line-bg-copy2 .line', {
    duration: 0.6,
    y: 1,
    opacity: 1,
    stagger: 0.2,
    ease: 'power3.out'
  }, 'frame2+=7').from(this.copy2, {
    duration: 0.6,
    autoAlpha: 1,
    y: 80,
    //stagger: 0.5,
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
    opacity: 1,
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
    clipPath: 'inset(6.5% 2.6% 10% 3.8% round 20px)',
    // rounded corners
    opacity: 1
    //y: 0
  }, {
    duration: 1,
    clipPath: 'inset(0% 0% 0% 0% round 25px)',
    // expands to full image
    ease: 'power3.in'
  }, 'frame3+=6.5').from(this.img2, {
    duration: 0.8,
    y: -14,
    ease: 'power.out'
  }, 'frame3+=5.5').to(this.img2, {
    duration: 0.8,
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
    duration: 0.6,
    top: -300,
    opacity: 1,
    ease: 'sine.out'
  }, 'frame3+=11').to(this.shape2, {
    duration: 0.6,
    top: -300,
    opacity: 1,
    ease: 'sine.out'
  }, 'frame3+=11.1');
  this.timeline = gsap.timeline({
    delay: 0
  });
  this.timeline;
  this.timeline
  // FIRST IMAGE SCALE
  .set(this.img1, {
    scale: 0.52
  }).to(this.img1, {
    duration: 9,
    scale: 0.6,
    ease: 'none'
  })

  // FORCE RESET + RESTART
  .call(function () {
    gsap.set(_this3.img1, {
      scale: 0.52
    });
  }, null, 10).to(this.img1, {
    duration: 9,
    scale: 0.6,
    ease: 'none'
  }, 10);
};