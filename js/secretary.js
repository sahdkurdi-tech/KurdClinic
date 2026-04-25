import { db, collection, addDoc, serverTimestamp, auth, onAuthStateChanged, signOut, doc, getDoc } from './firebase.js';
import { applyLanguage } from './translations.js'; // هێنانی فەنکشنی زمان
import translations from './translations.js'; // هێنانی فەرهەنگەکە بۆ بەکارهێنان لەناو کۆددا
// ==========================================
// لۆژیکی زمانی تایبەت بە هەر کارمەندێک
// ==========================================
// ==========================================
// لۆژیکی زمانی تایبەت بە هەر کارمەندێک (دیزاینە نوێیەکە)
// ==========================================
let currentLang = localStorage.getItem('myUILang') || 'ku';
applyLanguage(currentLang); 

const langButtons = document.querySelectorAll('.lang-btn');

langButtons.forEach(btn => {
    // ڕەنگکردنی ئەو دوگمەیەی کە لەگەڵ زمانی ئێستادا یەکدەگرێتەوە
    if (btn.getAttribute('data-lang') === currentLang) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }

    // کاتی کلیک کردن لە دوگمەکان
    btn.addEventListener('click', (e) => {
        const newLang = e.currentTarget.getAttribute('data-lang');
        if (newLang !== currentLang) {
            localStorage.setItem('myUILang', newLang);
            window.location.reload(); 
        }
    });
});
// =========================================
// پشکنینی ئاسایش و لۆگین بەپێی Role
// =========================================
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'index.html';
    } else {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                if (role === 'secretary' || role === 'admin') {
                    document.getElementById('secureBody').style.display = 'block';
                    // تنظیمات را تنها پس از تایید دسترسی بارگذاری کن
                    loadSystemSettings(); 
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error("Auth check error:", error);
            window.location.href = 'index.html';
        }
    }
});

// اضافه کردن لایسنر برای دکمه خروج
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.replace('index.html');
        }).catch((error) => {
            console.error("Logout Error:", error);
        });
    });
}
// =========================================
// هێنانی ڕێکخستنەکان (سێتینگ) و زمان لە داتابەیس
// =========================================
let sysSettings = null;

async function loadSystemSettings() {
    try {
        const docSnap = await getDoc(doc(db, "settings", "general"));
        if (docSnap.exists()) {
            sysSettings = docSnap.data();
        } else {
            console.warn("ڕێکخستنەکان نەدۆزرانەوە، داتای بنەڕەتی بەکاردێت.");
            applyLanguage('ku');
            sysSettings = {
                menCountB: 25, menLetterB: 'B', menColorB: '#bae6fd',
                menCountN: 25, menLetterN: 'N', menColorN: '#0369a1',
                womenCountB: 20, womenLetterB: 'B', womenColorB: '#fbcfe8',
                womenCountN: 20, womenLetterN: 'N', womenColorN: '#be185d'
            };
        }
        initGrids(); 
    } catch (error) { console.error("هەڵە لە هێنانی ڕێکخستنەکان:", error); }
}

// =========================================
// لۆژیکی سەرەکی سکرتێر و خشتەکان
// =========================================
const gridWomenConsult = document.getElementById('gridWomenConsult');
const gridWomenSurgery = document.getElementById('gridWomenSurgery');
const gridMenConsult = document.getElementById('gridMenConsult');
const gridMenSurgery = document.getElementById('gridMenSurgery');

const selectedDisplay = document.getElementById('selectedDisplay');
const msg = document.getElementById('msg');
const btnSend = document.getElementById('btnSend');
const btnRefresh = document.getElementById('btnRefresh');
const refreshModal = document.getElementById('refreshModal');
const btnConfirmRefresh = document.getElementById('btnConfirmRefresh');
let isIntentionalRefresh = false; 

if (btnRefresh) btnRefresh.addEventListener('click', () => refreshModal.classList.remove('hidden'));
if (btnConfirmRefresh) {
    btnConfirmRefresh.addEventListener('click', () => {
        isIntentionalRefresh = true; 
        window.location.href = window.location.pathname + '?v=' + new Date().getTime();
    });
}

let selectedData = null; 

// فەنکشنی زیرەک بۆ دیاریکردنی ڕەنگی تێکست (سپی یان ڕەش) بەپێی باگراوەند
function getContrastColor(hexColor) {
    if (!hexColor) return '#0f172a';
    let hex = hexColor.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#0f172a' : '#ffffff'; 
}

// فەنکشنی دروستکردنی ژمارەکان 
function createGrid(container, startNum, endNum, prefix, color, section, visitType) {
    container.innerHTML = ''; 
    const textColor = getContrastColor(color); 
    
    // وشەی داینامیک بۆ کاتی دیاریکردنی ژمارەکان
    let txtSelected = currentLang === 'en' ? 'Selected Number:' : (currentLang === 'ar' ? 'الرقم المحدد:' : 'ژمارەی هەڵبژێردراو:');
    let txtMen = currentLang === 'en' ? 'Men' : (currentLang === 'ar' ? 'رجال' : 'پیاوان');
    let txtWomen = currentLang === 'en' ? 'Women' : (currentLang === 'ar' ? 'نساء' : 'ئافرەتان');
    let txtConsult = currentLang === 'en' ? 'Consultation' : (currentLang === 'ar' ? 'معاينة' : 'بینین');
    let txtSurgery = currentLang === 'en' ? 'Surgery' : (currentLang === 'ar' ? 'عملية' : 'نەشتەرگەری');
    
    for (let i = startNum; i <= endNum; i++) {
        let subCounter = i - startNum + 1; 
        
        const btn = document.createElement('button');
        btn.className = `number-btn`;
        btn.id = `num-${section}-${i}`; 
        
        btn.style.backgroundColor = color;
        btn.style.color = textColor;
        btn.style.border = '2px solid transparent'; 
        
        btn.innerHTML = `
            <span style="font-size: 28px; font-weight: bold; font-family: system-ui, sans-serif; letter-spacing: 1px;" dir="ltr">${prefix}${subCounter}</span>
        `;
        
        btn.addEventListener('click', () => {
            if (btn.classList.contains('used')) return;

            document.querySelectorAll('.number-btn').forEach(b => {
                b.classList.remove('selected');
                b.style.transform = 'none';
                b.style.border = '2px solid transparent';
                b.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            });
            
            btn.classList.add('selected');
            btn.style.transform = 'scale(1.1)';
            btn.style.boxShadow = `0 8px 15px ${color}80`;
            btn.style.border = `2px solid ${textColor === '#ffffff' ? '#ffffff' : '#0f172a'}`;
            
            selectedData = {
                number: i,
                displayLabel: `${prefix}${subCounter}`, 
                section: section,
                visitType: visitType,
                elementId: btn.id
            };
            
            let typeName = visitType === 'بینین' ? `${txtConsult} 👁️` : `${txtSurgery} 💉`;
            let sectionName = section === 'men' ? `${txtMen} 👨` : `${txtWomen} 👩`;
            
            selectedDisplay.innerHTML = `${txtSelected} <b style="font-size:28px; font-family: system-ui, sans-serif; margin: 0 10px; color:${color};" dir="ltr">${selectedData.displayLabel}</b> <span style="font-size:16px;">(${sectionName} - ${typeName})</span>`;
            selectedDisplay.style.color = '#0f172a';
            selectedDisplay.style.background = '#fef08a'; 
            selectedDisplay.style.border = `2px solid #facc15`;
        });
        
        container.appendChild(btn);
    }
}

function initGrids() {
    createGrid(gridWomenConsult, 1, sysSettings.womenCountB, sysSettings.womenLetterB, sysSettings.womenColorB, 'women', 'بینین');
    let w2Start = sysSettings.womenCountB + 1;
    let w2End = sysSettings.womenCountB + sysSettings.womenCountN;
    createGrid(gridWomenSurgery, w2Start, w2End, sysSettings.womenLetterN, sysSettings.womenColorN, 'women', 'نەشتەرگەری');

    createGrid(gridMenConsult, 1, sysSettings.menCountB, sysSettings.menLetterB, sysSettings.menColorB, 'men', 'بینین');
    let m2Start = sysSettings.menCountB + 1;
    let m2End = sysSettings.menCountB + sysSettings.menCountN;
    createGrid(gridMenSurgery, m2Start, m2End, sysSettings.menLetterN, sysSettings.menColorN, 'men', 'نەشتەرگەری');
}

loadSystemSettings();

// =========================================
// ناردنی داتا بۆ فایەربەیس
// =========================================
btnSend.addEventListener('click', async () => {
    
    let alertMsg = currentLang === 'en' ? "Please select a number from the sections first!" : (currentLang === 'ar' ? "يرجى اختيار رقم من الأقسام أولاً!" : "تکایە سەرەتا ژمارەیەک لە بەشەکان هەڵبژێرە!");
    
    if (!selectedData) return alert(alertMsg);
    
    try {
        btnSend.disabled = true;
        let waitMsg = currentLang === 'en' ? "Please wait..." : (currentLang === 'ar' ? "يرجى الانتظار..." : "چاوەڕێ بە...");
        btnSend.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${waitMsg}`;
        
        await addDoc(collection(db, "patients"), {
            number: selectedData.number,
            displayLabel: selectedData.displayLabel, 
            section: selectedData.section,
            visitType: selectedData.visitType,
            status: "waiting",
            timestamp: serverTimestamp()
        });
        
        let successMsg = currentLang === 'en' ? "Successfully Sent" : (currentLang === 'ar' ? "تم الإرسال بنجاح" : "بە سەرکەوتوویی نێردرا");
        msg.innerHTML = `<b style="font-size:24px; font-family: system-ui, sans-serif; margin: 0 5px;" dir="ltr">${selectedData.displayLabel}</b> ${successMsg} ✔️`;
        msg.style.color = 'var(--success)';
        
        const usedBtn = document.getElementById(selectedData.elementId);
        usedBtn.classList.remove('selected');
        usedBtn.classList.add('used');
        usedBtn.style.transform = 'none';
        usedBtn.style.border = '2px solid transparent';
        
        let overlayColor = selectedData.visitType === 'بینین' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.6)';
        usedBtn.innerHTML += `<div style="position:absolute; background:${overlayColor}; color:white; width:100%; height:100%; top:0; left:0; display:flex; align-items:center; justify-content:center; border-radius:10px;"><i class="fa-solid fa-check" style="font-size:28px;"></i></div>`;
        usedBtn.style.overflow = 'hidden';

        selectedData = null;
        
        let resetMsg = currentLang === 'en' ? "Please select a number above..." : (currentLang === 'ar' ? "يرجى اختيار رقم من الأعلى..." : "تکایە ژمارەیەک لە سەرەوە هەڵبژێرە...");
        selectedDisplay.innerHTML = resetMsg;
        selectedDisplay.style.color = 'var(--text-muted)';
        selectedDisplay.style.background = '#f1f5f9';
        selectedDisplay.style.border = 'none';
        
        setTimeout(() => { msg.innerText = ''; }, 4000);
    } catch (e) {
        console.error("Error: ", e);
        let errorTxt = currentLang === 'en' ? "An error occurred while sending data!" : (currentLang === 'ar' ? "حدث خطأ أثناء إرسال البيانات!" : "هەڵەیەک ڕوویدا لە ناردنی داتاکە!");
        msg.innerText = errorTxt;
        msg.style.color = 'var(--danger)';
    } finally {
        btnSend.disabled = false;
        let btnText = currentLang === 'en' ? "Send Patient to Doctor" : (currentLang === 'ar' ? "إرسال المريض للطبيب" : "ناردنی نەخۆش بۆ دکتۆر");
        btnSend.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${btnText}`;
    }
});

window.addEventListener('beforeunload', function (e) {
    if (isIntentionalRefresh) return; 
    const leaveMsg = currentLang === 'en' ? 'Are you sure you want to refresh the page?' : (currentLang === 'ar' ? 'هل أنت متأكد من تحديث الصفحة؟' : 'ئایا دڵنیای دەتەوێت پەڕەکە نوێ بکەیتەوە؟');
    e.returnValue = leaveMsg; return leaveMsg; 
});