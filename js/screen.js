// تێبینی: بەشی لۆگین (auth)مان بەتەواوی لێرە سڕییەوە!
import { db, collection, query, where, onSnapshot, doc, getDoc } from './firebase.js';
import { applyLanguage } from './translations.js'; 

// =========================================
// دانانی دەنگی ئاگادارکردنەوە
// =========================================
let alertSound = new Audio('audio/bell1.mp3');

// =========================================
// لۆژیکی زیکرەکان 
// =========================================
let dhikrTimeoutId = null;
let currentDhikrIndex = 0;

function startDhikrSlider(dhikrsArray) {
    if (dhikrTimeoutId) clearTimeout(dhikrTimeoutId); 
    
    const dhikrElement = document.getElementById('dhikrText');
    if (!dhikrsArray || dhikrsArray.length === 0 || !dhikrElement) {
        if (dhikrElement) dhikrElement.style.display = 'none';
        return;
    }
    
    dhikrElement.style.display = 'block';
    currentDhikrIndex = 0;

    function showNextDhikr() {
        let currentItem = dhikrsArray[currentDhikrIndex];
        let text = typeof currentItem === 'string' ? currentItem : currentItem.text;
        let durationSec = typeof currentItem === 'string' ? 6 : (currentItem.duration || 6);

        dhikrElement.innerText = text;
        dhikrElement.classList.remove('fade-out');

        dhikrTimeoutId = setTimeout(() => {
            dhikrElement.classList.add('fade-out');
            setTimeout(() => {
                currentDhikrIndex = (currentDhikrIndex + 1) % dhikrsArray.length;
                showNextDhikr();
            }, 1000); 
        }, durationSec * 1000); 
    }
    showNextDhikr();
}

// =========================================
// ناساندنی گۆڕاوەکان و فەنکشنەکانی یارمەتیدەر
// =========================================
let sysSettings = null;
let currentLang = 'ku'; 

const menScreen = document.getElementById('menScreen');
const womenScreen = document.getElementById('womenScreen');

function getDynamicFontSize(text) {
    let length = text.length;
    if (length <= 3) return '22vh';      
    if (length <= 6) return '15vh';      
    if (length <= 10) return '11vh';     
    if (length <= 15) return '8vh';      
    return '6vh';                        
}

function hexToRgba(hex, alpha) {
    if (!hex) return `rgba(255, 255, 255, ${alpha})`;
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(x => x + x).join('');
    let r = parseInt(h.substring(0, 2), 16);
    let g = parseInt(h.substring(2, 4), 16);
    let b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function isDarkColor(hex) {
    if (!hex) return false;
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(x => x + x).join('');
    let r = parseInt(h.substring(0, 2), 16);
    let g = parseInt(h.substring(2, 4), 16);
    let b = parseInt(h.substring(4, 6), 16);
    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq < 128; 
}

function formatDisplay(data, section) {
    if (!data || (data.number === "--" && !data.displayLabel)) {
        return `<div class="screen-number">--</div>`;
    }

    let rawString = String(data.displayLabel || data.number);
    let emgWord = currentLang === 'en' ? 'Emergency' : (currentLang === 'ar' ? 'حالة طارئة' : 'حاڵەتی بەپەلە');
    
    if (rawString.includes('(')) {
        let parts = rawString.split('(');
        let nameText = parts[0].trim();
        let emergencyText = parts[1].replace(')', '').trim();
        let fSize = getDynamicFontSize(nameText); 
        
        return `
            <div style="font-size: ${fSize}; font-weight: bold; line-height: 1.3; margin-bottom: 2vh; text-shadow: 0 10px 20px rgba(0,0,0,0.5); color: #ffffff;">${nameText}</div>
            <div class="emergency-badge" style="margin-top: 0; margin-bottom: 4vh;"><i class="fa-solid fa-bell"></i> ${emergencyText}</div>
        `;
    } else if (rawString.includes('بەپەلە') || rawString.includes('لەناکاو') || rawString.includes('Emergency') || rawString.includes('طارئة')) {
        let justNum = rawString.replace('بەپەلە', '').replace('لەناکاو', '').replace('حاڵەتی', '').replace('Emergency', '').replace('حالة طارئة', '').trim();
        let fSize = getDynamicFontSize(justNum); 
        
        return `
            <div style="font-size: ${fSize}; font-weight: bold; line-height: 1.3; margin-bottom: 2vh; text-shadow: 0 10px 20px rgba(0,0,0,0.5); color: #ffffff;">${justNum}</div>
            <div class="emergency-badge" style="margin-top: 0; margin-bottom: 4vh;">${emgWord}</div>
        `;
    }

    let baseHex = section === 'men' ? '#38bdf8' : '#fbcfe8'; 
    if (sysSettings) {
        if (section === 'men') {
            baseHex = (data.visitType === 'نەشتەرگەری') ? sysSettings.menColorN : sysSettings.menColorB;
        } else if (section === 'women') {
            baseHex = (data.visitType === 'نەشتەرگەری') ? sysSettings.womenColorN : sysSettings.womenColorB;
        }
    }

    let isDark = isDarkColor(baseHex);
    let textC = isDark ? '#ffffff' : baseHex;
    let glowBase = isDark ? hexToRgba(baseHex, 1) : hexToRgba(baseHex, 0.8);
    let borderC = isDark ? hexToRgba(baseHex, 0.8) : hexToRgba(baseHex, 0.4);
    let bgC = isDark ? hexToRgba(baseHex, 0.25) : hexToRgba(baseHex, 0.08);

    let textShadowStyle = isDark 
        ? `0 0 15px rgba(255,255,255,0.7), 0 0 30px ${glowBase}, 0 0 50px ${glowBase}, 0 10px 20px rgba(0,0,0,0.9)` 
        : `0 10px 30px rgba(0,0,0,0.6), 0 0 40px ${glowBase}`;
        
    let boxShadowStyle = isDark
        ? `0 15px 40px rgba(0,0,0,0.7), inset 0 0 40px ${bgC}, 0 0 40px ${hexToRgba(baseHex, 0.5)}`
        : `0 15px 35px rgba(0,0,0,0.4), inset 0 0 30px ${bgC}, 0 0 30px ${bgC}`;

    return `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 3vh;">
            <div style="font-family: system-ui, sans-serif; font-size: 17vh; font-weight: 900; color: ${textC}; letter-spacing: 4px; text-shadow: ${textShadowStyle}; line-height: 1; border: 4px solid ${borderC}; background: ${bgC}; padding: 2vh 5vw; border-radius: 40px; box-shadow: ${boxShadowStyle}; backdrop-filter: blur(10px);" dir="ltr">${rawString}</div>
        </div>
    `;
}

// =========================================
// فەنکشنی هێنانی داتاکان بە ڕاستەوخۆیی!
// =========================================
async function loadSystemSettings() {
    try {
        const docSnap = await getDoc(doc(db, "settings", "general"));
        if (docSnap.exists()) {
            sysSettings = docSnap.data();
            currentLang = sysSettings.language || 'ku';
            
            applyLanguage(currentLang);
            // --- گۆڕینی زەنگەکە بەپێی سێتینگ ---
            const savedBell = sysSettings.bellSound || 'bell1.mp3';
            alertSound.src = `audio/${savedBell}`;

            // --- خوێندنەوەی دیزاینی شاشە و گۆڕینی فایلی CSS ---
            const activeTheme = sysSettings.screenTheme || 'theme1';
            const themeLink = document.getElementById('dynamicThemeCss');
            if (themeLink) {
                themeLink.href = `css/${activeTheme}.css`;
                
                // کاتێک دیزاینە نوێیەکە بەتەواوی بار بوو، ئینجا شاشەکە پیشان بدە
                themeLink.onload = () => {
                    document.body.style.opacity = '1';
                    document.body.style.visibility = 'visible';
                };
                
                // بۆ دڵنیایی (ئەگەر هێڵی ئینتەرنێت زۆر خێرا بوو یان فایلەکە لۆکاڵی بوو)
                setTimeout(() => {
                    document.body.style.opacity = '1';
                    document.body.style.visibility = 'visible';
                }, 300);
            }
            // ---------------------------------------------------
            
            let roomWord = currentLang === 'en' ? 'Room' : (currentLang === 'ar' ? 'غرفة' : 'ژووری');

            const menTitleText = document.getElementById('menSectionTitle');
            const menRoomBox = document.getElementById('menRoomText');
            if (sysSettings.menDocName && menTitleText) menTitleText.innerText = sysSettings.menDocName;
            let mRoomNum = sysSettings.menRoomNum || '9';
            if (menRoomBox) menRoomBox.innerText = `${roomWord} ( ${mRoomNum} )`;

            const womenTitleText = document.getElementById('womenSectionTitle');
            const womenRoomBox = document.getElementById('womenRoomText');
            if (sysSettings.womenDocName && womenTitleText) womenTitleText.innerText = sysSettings.womenDocName;
            let wRoomNum = sysSettings.womenRoomNum || '10';
            if (womenRoomBox) womenRoomBox.innerText = `${roomWord} ( ${wRoomNum} )`;

            // --- هێنان و جێبەجێکردنی ڕیزبەندی دکتۆرەکان لە شاشە ---
            const sectionsOrder = sysSettings.sectionsOrder || ['men', 'women'];
            
            const showMen = sysSettings.showMenScreen !== false;
            const showWomen = sysSettings.showWomenScreen !== false;

            const menBox = document.querySelector('.screen-box.men');
            const womenBox = document.querySelector('.screen-box.women');
            const screenContainer = document.querySelector('.screen-container');

            if (menBox && womenBox && screenContainer) {
                // جێبەجێکردنی ڕیزبەندی (لە ڕاستەوە بۆ چەپ) بە بەکارهێنانی تایبەتمەندی order ی CSS
                menBox.style.setProperty('order', sectionsOrder.indexOf('men') + 1, 'important');
                womenBox.style.setProperty('order', sectionsOrder.indexOf('women') + 1, 'important');

                if (showMen && showWomen) {
                    menBox.style.display = 'flex';
                    womenBox.style.display = 'flex';
                    screenContainer.style.gridTemplateColumns = '1fr 1fr';
                    menBox.style.width = '100%';
                    womenBox.style.width = '100%';
                    menBox.style.margin = '0';
                    womenBox.style.margin = '0';
                } else if (showMen && !showWomen) {
                    menBox.style.display = 'flex';
                    womenBox.style.display = 'none';
                    screenContainer.style.gridTemplateColumns = '1fr';
                    menBox.style.width = '60vw'; 
                    menBox.style.margin = '0 auto';
                } else if (!showMen && showWomen) {
                    menBox.style.display = 'none';
                    womenBox.style.display = 'flex';
                    screenContainer.style.gridTemplateColumns = '1fr';
                    womenBox.style.width = '60vw'; 
                    womenBox.style.margin = '0 auto';
                } else {
                    menBox.style.display = 'none';
                    womenBox.style.display = 'none';
                }
            }

            let loadedDhikrs = sysSettings.dhikrs || [];
            startDhikrSlider(loadedDhikrs);
        }
    } catch (error) {
        console.error("هەڵە لە هێنانی ڕێکخستنەکان:", error);
    }
}

let isInitialLoad = true;

function setupPatientsListener() {
    const q = query(collection(db, "patients"), where("status", "==", "called"));
    
    onSnapshot(q, (snapshot) => {
        let menData = null;
        let womenData = null;

        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.section === 'men') menData = data;
            if (data.section === 'women') womenData = data;
        });

        let playSound = false; 

        const mSubElement = document.getElementById('menSubtitle');
        const wSubElement = document.getElementById('womenSubtitle');
        
        if (mSubElement) mSubElement.style.opacity = menData?.hideSubtitle ? '0' : '1';
        if (wSubElement) wSubElement.style.opacity = womenData?.hideSubtitle ? '0' : '1';

        let strMen = menData ? String(menData.displayLabel || menData.number) : "--"; 
        if (menScreen && menScreen.dataset.current !== strMen && strMen !== "--") {
            menScreen.classList.remove('number-animate');
            void menScreen.offsetWidth; 
            menScreen.classList.add('number-animate');
            if (!isInitialLoad) playSound = true; 
        }
        if(menScreen) {
            menScreen.dataset.current = strMen;
            menScreen.innerHTML = formatDisplay(menData, 'men');
        }

        let strWomen = womenData ? String(womenData.displayLabel || womenData.number) : "--"; 
        if (womenScreen && womenScreen.dataset.current !== strWomen && strWomen !== "--") {
            womenScreen.classList.remove('number-animate');
            void womenScreen.offsetWidth; 
            womenScreen.classList.add('number-animate');
            if (!isInitialLoad) playSound = true;
        }
        if(womenScreen) {
            womenScreen.dataset.current = strWomen;
            womenScreen.innerHTML = formatDisplay(womenData, 'women');
        }

        if (playSound) {
            alertSound.currentTime = 0; 
            alertSound.play().catch(error => { 
                console.log("کێشە لە لێدانی دەنگ:", error); 
            });
        }

        isInitialLoad = false; 
    }, (error) => {
        console.error("هەڵە لە هێنانی نەخۆشەکان:", error);
    });
}

// ڕاستەوخۆ کارپێکردنی فەنکشنەکان بێ چاوەڕوانی هیچ لۆگینێک!
loadSystemSettings();
setupPatientsListener();

// =========================================
// کردنەوەی قوفڵی دەنگ بۆ وێبگەڕەکان
// =========================================
let clickCount = 0;
let clickTimeout;
let isAudioUnlocked = false;

document.body.addEventListener('click', () => {
    if (!isAudioUnlocked) {
        alertSound.volume = 0; 
        alertSound.play().then(() => {
            alertSound.pause();
            alertSound.currentTime = 0;
            alertSound.volume = 1.0; 
            isAudioUnlocked = true;
        }).catch((e) => {
            console.log("نەتوانرا قوفڵی دەنگ بکرێتەوە", e);
        });
    }

    clickCount++; 
    if (clickCount === 1) {
        clickTimeout = setTimeout(() => { 
            clickCount = 0; 
        }, 1500); 
    }
    if (clickCount === 3) {
        clearTimeout(clickTimeout);
        clickCount = 0;
        window.location.href = window.location.pathname + '?v=' + new Date().getTime();
    }
});

// =========================================
// ڕێگریکردن لە کوژانەوەی شاشە (Wake Lock)
// =========================================
let wakeLock = null;

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
        }
    } catch (err) { 
        console.error(`Wake Lock Error: ${err.message}`); 
    }
}

requestWakeLock();

document.addEventListener('visibilitychange', () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
    }
});