// Hooda Math Auto-Play Overlay Ad with iframe redirect and draggable tab
// Include in game.html: <script src="https://www.hoodamath.com/game-preloader-ad.js"></script>

(function() {
    'use strict';
    
    // INTERCEPT AudioContext creation for Unity games
    let unityAudioContext = null;
    const OriginalAudioContext = window.AudioContext || window.webkitAudioContext;
    
    if (OriginalAudioContext) {
        window.AudioContext = window.webkitAudioContext = function(...args) {
            const ctx = new OriginalAudioContext(...args);
            unityAudioContext = ctx;
            return ctx;
        };
        window.AudioContext.prototype = OriginalAudioContext.prototype;
        window.webkitAudioContext.prototype = OriginalAudioContext.prototype;
    }
    
    let adStarted = false;
    let adComplete = false;
    let muteIntervalId = null;
    let isAdPlaying = false;
    
    // Mute all audio on this page (with continuous retry)
    function muteAllAudio(continuous = false) {
        // Clear any existing interval
        if (muteIntervalId) {
            clearInterval(muteIntervalId);
            muteIntervalId = null;
        }
        
        // Mute once immediately
        const doMute = () => {
            // Mute HTML5 media elements
            document.querySelectorAll('audio, video').forEach(m => { 
                m.volume = 0; 
                m.muted = true; 
            });
            
            // Mute Ruffle (Flash) games
            const ruffleEl = document.querySelector('ruffle-object') || document.querySelector('ruffle-embed');
            if (ruffleEl) {
                ruffleEl.volume = 0;
            }
            
            // Mute Construct 3 games
            if (window.C3Audio_DOMInterface && window.C3Audio_DOMInterface._audioContext) {
                const ctx = window.C3Audio_DOMInterface._audioContext;
                if (ctx.state === 'running') {
                    ctx.suspend();
                }
            }
            
            // Mute Unity games (intercepted AudioContext)
            if (unityAudioContext && unityAudioContext.state === 'running') {
                unityAudioContext.suspend();
            }
            
            // Mute Scratch/TurboWarp games - both suspend AND set gain to 0
            const vm = window.vm || window.scaffolding?.vm;
            if (vm && vm.runtime && vm.runtime.audioEngine) {
                const audioEngine = vm.runtime.audioEngine;
                
                // Suspend the context
                if (audioEngine.audioContext && audioEngine.audioContext.state === 'running') {
                    audioEngine.audioContext.suspend();
                }
                
                // Also set the input node gain to 0
                if (audioEngine.inputNode && audioEngine.inputNode.gain) {
                    audioEngine.inputNode.gain.value = 0;
                }
            }
            
            // Fallback: Suspend any AudioContext instances in global scope
            for (let p in window) {
                try { 
                    if (window[p] instanceof OriginalAudioContext) {
                        if (window[p].state === 'running') {
                            window[p].suspend();
                        }
                    }
                } catch(e) {}
            }
        };
        
        doMute();
        
        // If continuous, keep muting every 50ms (more aggressive)
        if (continuous) {
            muteIntervalId = setInterval(doMute, 50);
        } else {
            // For one-time mutes (like opening new tab), try for 2 seconds
            let attempts = 0;
            const maxAttempts = 20;
            muteIntervalId = setInterval(() => {
                attempts++;
                doMute();
                
                if (attempts >= maxAttempts) {
                    clearInterval(muteIntervalId);
                    muteIntervalId = null;
                }
            }, 100);
        }
    }
    
    // Unmute all audio
    function unmuteAllAudio() {
        // Clear any ongoing mute interval
        if (muteIntervalId) {
            clearInterval(muteIntervalId);
            muteIntervalId = null;
        }
        
        // Unmute HTML5 media elements
        document.querySelectorAll('audio, video').forEach(m => { 
            m.volume = 1; 
            m.muted = false; 
        });
        
        // Unmute Ruffle (Flash) games
        const ruffleEl = document.querySelector('ruffle-object') || document.querySelector('ruffle-embed');
        if (ruffleEl) {
            ruffleEl.volume = 1;
        }
        
        // Unmute Construct 3 games
        if (window.C3Audio_DOMInterface && window.C3Audio_DOMInterface._audioContext) {
            window.C3Audio_DOMInterface._audioContext.resume();
        }
        
        // Unmute Unity games (intercepted AudioContext)
        if (unityAudioContext) {
            unityAudioContext.resume();
        }
        
        // Resume Scratch/TurboWarp games
        const vm = window.vm || window.scaffolding?.vm;
        if (vm && vm.runtime && vm.runtime.audioEngine) {
            const audioEngine = vm.runtime.audioEngine;
            
            // Resume the context
            if (audioEngine.audioContext) {
                audioEngine.audioContext.resume();
            }
            
            // Restore the input node gain to 1
            if (audioEngine.inputNode && audioEngine.inputNode.gain) {
                audioEngine.inputNode.gain.value = 1;
            }
        }
        
        // Resume any AudioContext instances in global scope
        for (let p in window) {
            try { 
                if (window[p] instanceof OriginalAudioContext) {
                    window[p].resume(); 
                }
            } catch(e) {}
        }
    }
    
    // Check if we're in an iframe on a different domain
    function isEmbeddedOnOtherSite() {
        try {
            return window.self !== window.top && 
                   window.top.location.hostname !== 'www.hoodamath.com' &&
                   window.top.location.hostname !== 'hoodamath.com';
        } catch (e) {
            // Cross-origin error means we're definitely on another site
            return window.self !== window.top;
        }
    }
    
    // Check if we're NOT in any iframe (standalone page)
    function isStandalonePage() {
        return window.self === window.top;
    }
    
    // Check if device is mobile or small tablet
    function isMobileOrSmallTablet() {
        const screenWidth = window.innerWidth || document.documentElement.clientWidth;
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Check if ACTUALLY a mobile device by user agent
        const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
        const isIPad = /ipad/i.test(userAgent.toLowerCase()) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        
        // Check screen width
        const isSmallScreen = screenWidth <= 768;
        
        // MUST have mobile user agent AND small screen (not just small screen alone)
        return (isMobileUA || isIPad) && isSmallScreen;
    }
    
    // Get game name for image
    function getGameName() {
        const path = window.location.pathname;
        const match = path.match(/\/mobile\/games\/([^\/]+)\//);
        if (match) {
            return match[1].replace(/-/g, ''); // Remove hyphens
        }
        return '';
    }
    
    // Get game image URL
    function getGameImageURL() {
        const gameName = getGameName();
        if (gameName) {
            return `https://www.hoodamath.com/large/${gameName}_300x225.jpg`;
        }
        return '';
    }
    
    // Convert mobile game URL to main site URL
    function getMainSiteURL() {
        const gameName = getGameName();
        if (gameName) {
            return `/games/${gameName}.html`;
        }
        // Fallback
        return window.location.pathname.replace(/\/mobile\/games\//, '/games/').replace(/game\.html$/, '.html');
    }
    
    // Get current mobile game URL (for opening in new tab)
    function getCurrentMobileURL() {
        return window.location.href;
    }
    
    const embeddedOnOtherSite = isEmbeddedOnOtherSite();
    const standalone = isStandalonePage();
    const isMobile = isMobileOrSmallTablet();
    const inIframe = window.self !== window.top;
    
    // Only load AdSense if on hoodamath.com and not mobile in iframe
    if (!embeddedOnOtherSite && !(inIframe && isMobile)) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adBreak = window.adConfig = function(o) { 
            window.adsbygoogle.push(o); 
        };
        
        var adSenseScript = document.createElement('script');
        adSenseScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        adSenseScript.setAttribute('data-ad-client', 'ca-pub-6495588245871342');
        adSenseScript.async = true;
        
        adSenseScript.onload = function() {
            adConfig({
                preloadAdBreaks: 'on'
            });
        };
        
        document.head.appendChild(adSenseScript);
    }
    
    // Create draggable tab for standalone pages
    function createDraggableTab() {
        const tab = document.createElement('div');
        tab.id = 'hooda-nav-tab';
        tab.style.cssText = `
            position: fixed;
            left: 0;
            top: 50%;
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 0 10px 10px 0;
            box-shadow: 2px 0 10px rgba(0,0,0,0.3);
            cursor: move;
            z-index: 10000000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: left 0.2s;
            user-select: none;
            -webkit-user-select: none;
            touch-action: none;
        `;
        
        tab.innerHTML = `
            <div style="display: flex; align-items: center; pointer-events: none;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#19C614" style="margin-right: 5px;">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
                <img src="https://www.hoodamath.com/hooda-guy-171x171.png" 
                     style="width: 40px; height: 40px; border-radius: 5px;" 
                     alt="Hooda Math">
            </div>
        `;
        
        // Make it draggable vertically (works for both mouse and touch)
        let isDragging = false;
        let startY = 0;
        let currentTop = 20; // Start centered
        let clickStartY = 0;
        let clickStartTime = 0;
        
        // Set initial position
        tab.style.top = currentTop + 'px';
        tab.style.transform = 'none';
        
        function handleStart(clientY) {
            isDragging = true;
            startY = clientY;
            clickStartY = clientY;
            clickStartTime = Date.now();
        }
        
        function handleMove(clientY) {
            if (!isDragging) return;
            const deltaY = clientY - startY;
            let newTop = currentTop + deltaY;
            
            // Keep within viewport bounds
            const maxTop = window.innerHeight - tab.offsetHeight;
            newTop = Math.max(0, Math.min(newTop, maxTop));
            
            tab.style.top = newTop + 'px';
            tab.style.transform = 'none';
        }
        
        function handleEnd(clientY) {
            if (!isDragging) return;
            
            // Update currentTop to the final position
            const deltaY = clientY - startY;
            let newTop = currentTop + deltaY;
            const maxTop = window.innerHeight - tab.offsetHeight;
            newTop = Math.max(0, Math.min(newTop, maxTop));
            currentTop = newTop;
            
            isDragging = false;
            
            // If it was a quick tap/click without much movement, navigate
            const totalDeltaY = Math.abs(clientY - clickStartY);
            const deltaTime = Date.now() - clickStartTime;
            
            if (totalDeltaY < 10 && deltaTime < 300) {
                window.location.href = getMainSiteURL();
            }
        }
        
        // Mouse events
        tab.addEventListener('mousedown', (e) => {
            e.preventDefault();
            handleStart(e.clientY);
            
            const onMouseMove = (e) => handleMove(e.clientY);
            const onMouseUp = (e) => {
                handleEnd(e.clientY);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        
        // Touch events
        tab.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            handleStart(touch.clientY);
        });
        
        tab.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            handleMove(touch.clientY);
        });
        
        tab.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            handleEnd(touch.clientY);
        });
        
        // Hover effect (mouse only)
        tab.addEventListener('mouseenter', () => {
            if (!isDragging) {
                tab.style.left = '-5px';
                tab.style.boxShadow = '3px 0 15px rgba(0,0,0,0.4)';
            }
        });
        
        tab.addEventListener('mouseleave', () => {
            if (!isDragging) {
                tab.style.left = '0';
                tab.style.boxShadow = '2px 0 10px rgba(0,0,0,0.3)';
            }
        });
        
        document.body.appendChild(tab);
    }
    
    // Create play button overlay
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'hooda-ad-overlay';
        
        const gameImageURL = getGameImageURL();
        const backgroundStyle = gameImageURL 
        ? `background-image: url('${gameImageURL}'); background-size: cover; background-position: center; background-repeat: no-repeat;`
        : `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);`;
        
        overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        ${backgroundStyle}
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
    `;
        
        // REPLACE FROM HERE ↓
        const button = document.createElement('button');
        button.innerHTML = '▶ PLAY GAME';
        button.style.cssText = `
        background: #19C614;
        color: white;
        font-size: 48px;
        font-weight: bold;
        padding: 30px 60px;
        border: none;
        border-radius: 15px;
        cursor: pointer;
        box-shadow: 0 8px 0 #0F9210, 0 10px 20px rgba(0,0,0,0.3);
        transition: all 0.1s;
        touch-action: manipulation;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
    `;
        
        button.onmouseover = () => {
            button.style.transform = 'translateY(-5px)';
            button.style.boxShadow = '0 13px 0 #0F9210, 0 15px 25px rgba(0,0,0,0.4)';
        };
        
        button.onmouseout = () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 8px 0 #0F9210, 0 10px 20px rgba(0,0,0,0.3)';
        };
        
        button.onmousedown = () => {
            button.style.transform = 'translateY(4px)';
            button.style.boxShadow = '0 4px 0 #0F9210, 0 6px 15px rgba(0,0,0,0.3)';
        };
        
        // Handler function
        const handlePlay = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Mobile device in iframe - open new tab and mute with delay
            if (inIframe && isMobile) {
                window.open(getCurrentMobileURL(), '_blank');
                removeOverlay();
                muteAllAudio(false);
                return;
            }
            
            // Desktop embedded on other sites - open new window
            if (embeddedOnOtherSite) {
                const link = document.createElement('a');
                link.href = 'https://www.hoodamath.com' + getMainSiteURL();
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                removeOverlay();
                muteAllAudio(false);
            } else {
                // Desktop on hoodamath.com - show ad normally
                button.disabled = true;
                button.innerHTML = 'Loading...';
                button.style.background = '#666';
                showAd();
            }
        };
        
        // Add listeners with capture phase to intercept BEFORE game's document listeners
        button.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
        }, { capture: true, passive: false });
        
        button.addEventListener('touchend', handlePlay, { capture: true, passive: false });
        button.onclick = handlePlay;
        // REPLACE TO HERE ↑
        
        overlay.appendChild(button);
        document.body.appendChild(overlay);
    }
    
    // Remove overlay
    function removeOverlay() {
        const overlay = document.getElementById('hooda-ad-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            overlay.remove();
        }
        
        // Spam events continuously for 3 seconds
        let count = 0;
        const spamInterval = setInterval(() => {
            window.dispatchEvent(new Event('resize'));
            window.dispatchEvent(new Event('focus'));
            document.body.click();
            
            const canvas = document.querySelector('canvas');
            if (canvas) {
                canvas.click();
            }
            
            count++;
            if (count >= 30) { // 30 attempts over 3 seconds
                clearInterval(spamInterval);
            }
        }, 100);
    }
    
    // Show ad
    function showAd() {
        if (adStarted) return;
        adStarted = true;
        
        // Fallback timeout - 3 seconds
        const fallbackTimeout = setTimeout(() => {
            if (!adComplete) {
                console.log('[HOODA] Ad timeout - removing overlay');
                adComplete = true;
                isAdPlaying = false;
                removeOverlay();
                unmuteAllAudio();
            }
        }, 3000);
        
        // Check if adBreak is even available
        if (typeof adBreak !== 'function') {
            console.log('[HOODA] adBreak not available - removing overlay immediately');
            clearTimeout(fallbackTimeout);
            adComplete = true;
            removeOverlay();
            unmuteAllAudio();
            return;
        }
        
        try {
            adBreak({
                type: 'reward',
                name: 'game-start',
                beforeReward: (showAdFn) => {
                    clearTimeout(fallbackTimeout);
                    isAdPlaying = true;
                    muteAllAudio(true);
                    showAdFn();
                },
                adViewed: () => {
                    clearTimeout(fallbackTimeout);
                    adComplete = true;
                    isAdPlaying = false;
                    removeOverlay();
                    unmuteAllAudio();
                },
                adDismissed: () => {
                    clearTimeout(fallbackTimeout);
                    adComplete = true;
                    isAdPlaying = false;
                    removeOverlay();
                    unmuteAllAudio();
                },
                adBreakDone: () => {
                    clearTimeout(fallbackTimeout);
                    if (!adComplete) {
                        adComplete = true;
                        removeOverlay();
                    }
                    isAdPlaying = false;
                    unmuteAllAudio();
                }
            });
        } catch (error) {
            console.log('[HOODA] adBreak error:', error);
            clearTimeout(fallbackTimeout);
            adComplete = true;
            isAdPlaying = false;
            removeOverlay();
            unmuteAllAudio();
        }
    }
    
    // Initialize based on context
    window.addEventListener('load', () => {
        if (standalone) {
            // Standalone page - show both draggable tab AND play overlay
            createDraggableTab();
            createOverlay();
        } else {
            // In iframe - show play overlay only
            createOverlay();
        }
    });
    
})();