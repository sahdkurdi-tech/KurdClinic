import { db, auth, onAuthStateChanged, doc, setDoc, getDoc, signOut, collection, query, where, getDocs } from './firebase.js';
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import translations, { applyLanguage } from './translations.js'; 

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
                // تەنیا ڕێگە بە ئەدمین دەدەین
                if (role === 'admin') {
                    document.getElementById('secureBody').style.display = 'block';
                    loadSettings(); // بارکردنی داتا دوای دڵنیابوونەوە
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

// ==========================================
// دوگمەکانی گەشتکردن و چوونە دەرەوە
// ==========================================
document.getElementById('navSec').addEventListener('click', () => window.open('secretary.html', '_blank'));
document.getElementById('navMen').addEventListener('click', () => window.open('doctor-men.html', '_blank'));
document.getElementById('navWomen').addEventListener('click', () => window.open('doctor-women.html', '_blank'));
document.getElementById('navScreen').addEventListener('click', () => window.open('screen.html', '_blank'));
document.getElementById('navArchive').addEventListener('click', () => window.open('archive.html', '_blank'));

document.getElementById('btnLogout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    }).catch((error) => console.error(error));
});

// ==========================================
// فەنکشنی پیشاندانی نامە بە شێوازی (Toast)
// ==========================================
function showNotification(message, type = 'success') {
    const toast = document.createElement('div');
    const bgColor = type === 'error' ? '#ef4444' : '#10b981'; 
    const icon = type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

    Object.assign(toast.style, {
        position: 'fixed',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: bgColor,
        color: '#ffffff',
        padding: '12px 25px',
        borderRadius: '10px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '16px',
        fontWeight: 'bold',
        zIndex: '9999',
        fontFamily: 'inherit',
        opacity: '0',
        transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)' 
    });

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.top = '40px';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.top = '10px';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ==========================================
// لۆژیکی دروستکردنی ئینپوتی زیکرەکان (دەق + چرکە)
// ==========================================
function createDhikrInput(textVal = '', durationVal = 6, lang = 'ku') {
    const container = document.getElementById('dhikrInputsContainer');
    let removeTxt = lang === 'en' ? 'Remove' : (lang === 'ar' ? 'حذف' : 'سڕینەوە');

    const div = document.createElement('div');
    div.className = 'dhikr-item';
    div.style.display = 'flex';
    div.style.gap = '8px';
    div.style.alignItems = 'center';

    const inpText = document.createElement('input');
    inpText.type = 'text';
    inpText.className = 'dhikr-text-input';
    inpText.value = textVal;
    inpText.style.flex = '1';
    inpText.style.fontFamily = 'Amiri, NRT, sans-serif'; 
    inpText.style.padding = '12px';
    inpText.style.border = '1px solid #cbd5e1';
    inpText.style.borderRadius = '8px';
    inpText.style.outline = 'none';

    const inpTime = document.createElement('input');
    inpTime.type = 'number';
    inpTime.className = 'dhikr-time-input';
    inpTime.value = durationVal;
    inpTime.min = '2';
    inpTime.style.width = '80px';
    inpTime.style.textAlign = 'center';
    inpTime.style.padding = '12px';
    inpTime.style.border = '1px solid #cbd5e1';
    inpTime.style.borderRadius = '8px';
    inpTime.style.outline = 'none';

    const btn = document.createElement('button');
    btn.innerHTML = `<i class="fa-solid fa-trash"></i> <span class="rm-txt">${removeTxt}</span>`;
    btn.style.background = '#ef4444';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.padding = '0 15px';
    btn.style.height = '100%';
    btn.style.borderRadius = '8px';
    btn.style.cursor = 'pointer';

    btn.onclick = () => div.remove();

    div.appendChild(inpText);
    div.appendChild(inpTime);
    div.appendChild(btn);
    
    container.appendChild(div);
}

document.getElementById('btnAddDhikr').addEventListener('click', () => {
    const lang = document.getElementById('sysLanguage').value || 'ku';
    createDhikrInput('', 6, lang);
});

// ==========================================
// هێنان و بارکردنی سێتینگەکان
// ==========================================
async function loadSettings() {
    const docRef = doc(db, "settings", "general");
    const docSnap = await getDoc(docRef);
    const langSelect = document.getElementById('sysLanguage');

    if (docSnap.exists()) {
        const data = docSnap.data();
        
        const currentLang = data.language || 'ku';
        if (langSelect) langSelect.value = currentLang;
        applyLanguage(currentLang); 
        
        // --- خوێندنەوەی دیزاینی شاشە (Theme) ---
        const savedTheme = data.screenTheme || 'theme1';
        const themeRadio = document.querySelector(`input[name="screenTheme"][value="${savedTheme}"]`);
        if(themeRadio) themeRadio.checked = true;
        
        // --- خوێندنەوەی ڕیزبەندی دکتۆرەکان بەپێی ئەوەی سەیڤ کراوە ---
        const sectionsOrder = data.sectionsOrder || ['men', 'women'];
        const docContainer = document.getElementById('doctorOrderContainer');
        if (docContainer) {
            sectionsOrder.forEach(section => {
                const el = docContainer.querySelector(`[data-section="${section}"]`);
                if (el) docContainer.appendChild(el); // دەیخاتە شوێنی دروستی خۆی
            });
        }

        document.getElementById('clinicName').value = data.clinicName || '';
        document.getElementById('menDocName').value = data.menDocName || '';
        document.getElementById('womenDocName').value = data.womenDocName || '';
        document.getElementById('menRoomNum').value = data.menRoomNum || '';
        document.getElementById('womenRoomNum').value = data.womenRoomNum || '';

        // --- خوێندنەوەی جۆری زەنگ ---
        const bellSelect = document.getElementById('bellSoundSelect');
        if (bellSelect) bellSelect.value = data.bellSound || 'bell1.mp3';
        // ----------------------------------------

        document.getElementById('menLetterB').value = data.menLetterB || 'B';
        document.getElementById('menCountB').value = data.menCountB || 25;
        document.getElementById('menColorB').value = data.menColorB || '#bae6fd';
        
        document.getElementById('menLetterN').value = data.menLetterN || 'N';
        document.getElementById('menCountN').value = data.menCountN || 25;
        document.getElementById('menColorN').value = data.menColorN || '#0369a1';

        document.getElementById('womenLetterB').value = data.womenLetterB || 'B';
        document.getElementById('womenCountB').value = data.womenCountB || 20;
        document.getElementById('womenColorB').value = data.womenColorB || '#fbcfe8';
        
        document.getElementById('womenLetterN').value = data.womenLetterN || 'N';
        document.getElementById('womenCountN').value = data.womenCountN || 20;
        document.getElementById('womenColorN').value = data.womenColorN || '#be185d';

        const defaultHeader = translations[currentLang]?.cardHeaderTxt || "بەشی ناسۆری کلێنچکە - هەولێر";
        document.getElementById('customCardHeader').value = data.customCardHeader !== undefined ? data.customCardHeader : defaultHeader;
        document.getElementById('showCardFooter').checked = data.showCardFooter !== undefined ? data.showCardFooter : true;

        if (document.getElementById('showMenScreen')) {
            document.getElementById('showMenScreen').checked = data.showMenScreen !== false;
        }
        if (document.getElementById('showWomenScreen')) {
            document.getElementById('showWomenScreen').checked = data.showWomenScreen !== false;
        }

        document.getElementById('dhikrInputsContainer').innerHTML = ''; 
        let loadedDhikrs = data.dhikrs || [];
        
        if (loadedDhikrs.length === 0) {
            createDhikrInput('', 6, currentLang);
        } else {
            loadedDhikrs.forEach(d => {
                if (typeof d === 'string') createDhikrInput(d, 6, currentLang);
                else createDhikrInput(d.text, d.duration, currentLang);
            });
        }

    } else {
        applyLanguage('ku');
        document.getElementById('dhikrInputsContainer').innerHTML = '';
        createDhikrInput('', 6, 'ku');
        document.getElementById('customCardHeader').value = translations['ku'].cardHeaderTxt;
        document.getElementById('showCardFooter').checked = true;
        
        if (document.getElementById('showMenScreen')) document.getElementById('showMenScreen').checked = true;
        if (document.getElementById('showWomenScreen')) document.getElementById('showWomenScreen').checked = true;

        // حاڵەتی بنەڕەتی بۆ دیزاینی شاشە
        const themeRadioFallback = document.querySelector('input[name="screenTheme"][value="theme1"]');
        if(themeRadioFallback) themeRadioFallback.checked = true;
    }

    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            applyLanguage(e.target.value);
            document.querySelectorAll('.rm-txt').forEach(sp => {
                sp.innerText = e.target.value === 'en' ? 'Remove' : (e.target.value === 'ar' ? 'حذف' : 'سڕینەوە');
            });
        });
    }
}

// ==========================================
// پاشەکەوتکردنی سێتینگەکان
// ==========================================
document.getElementById('btnSaveSettings').addEventListener('click', async () => {
    const langSelect = document.getElementById('sysLanguage');
    const selectedLang = langSelect ? langSelect.value : 'ku';

    let finalDhikrs = [];
    document.querySelectorAll('.dhikr-item').forEach(item => {
        let text = item.querySelector('.dhikr-text-input').value.trim();
        let dur = parseInt(item.querySelector('.dhikr-time-input').value) || 6;
        if (text !== '') {
            finalDhikrs.push({ text: text, duration: dur });
        }
    });

    // --- هێنانی ئەو دیزاینەی هەڵبژێردراوە ---
    const selectedThemeElement = document.querySelector('input[name="screenTheme"]:checked');
    const selectedTheme = selectedThemeElement ? selectedThemeElement.value : 'theme1';
    
    // --- هێنانی ڕیزبەندییە نوێیەکەی دکتۆرەکان ---
    let orderedSections = [];
    document.querySelectorAll('.draggable-item').forEach(item => {
        orderedSections.push(item.getAttribute('data-section'));
    });

    const settingsData = {
        language: selectedLang,
        clinicName: document.getElementById('clinicName').value,
        menDocName: document.getElementById('menDocName').value,
        womenDocName: document.getElementById('womenDocName').value,
        menRoomNum: document.getElementById('menRoomNum').value,
        womenRoomNum: document.getElementById('womenRoomNum').value,

        menLetterB: document.getElementById('menLetterB').value,
        menCountB: parseInt(document.getElementById('menCountB').value) || 25,
        menColorB: document.getElementById('menColorB').value,
        
        menLetterN: document.getElementById('menLetterN').value,
        menCountN: parseInt(document.getElementById('menCountN').value) || 25,
        menColorN: document.getElementById('menColorN').value,

        womenLetterB: document.getElementById('womenLetterB').value,
        womenCountB: parseInt(document.getElementById('womenCountB').value) || 20,
        womenColorB: document.getElementById('womenColorB').value,
        
        womenLetterN: document.getElementById('womenLetterN').value,
        womenCountN: parseInt(document.getElementById('womenCountN').value) || 20,
        womenColorN: document.getElementById('womenColorN').value,

        customCardHeader: document.getElementById('customCardHeader').value.trim(),
        showCardFooter: document.getElementById('showCardFooter').checked,
        
        showMenScreen: document.getElementById('showMenScreen') ? document.getElementById('showMenScreen').checked : true,
        showWomenScreen: document.getElementById('showWomenScreen') ? document.getElementById('showWomenScreen').checked : true,
        
        sectionsOrder: orderedSections, // ڕیزبەندییەکە پاشەکەوت دەکرێت
        screenTheme: selectedTheme, 
        
        // --- پاشەکەوتکردنی زەنگی ئاگادارکردنەوە ---
        bellSound: document.getElementById('bellSoundSelect') ? document.getElementById('bellSoundSelect').value : 'bell1.mp3',
        
        dhikrs: finalDhikrs
    };

    try {
        await setDoc(doc(db, "settings", "general"), settingsData);
        applyLanguage(selectedLang); 
        
        // بەکارهێنانی نامە جوانەکە (Toast) بۆ سەرکەوتن
        let successMsg = selectedLang === 'en' ? "Settings saved successfully! ✔️" : (selectedLang === 'ar' ? "تم حفظ الإعدادات بنجاح! ✔️" : "ڕێکخستنەکان بە سەرکەوتوویی پاشەکەوت کران! ✔️");
        showNotification(successMsg, 'success');
        
    } catch (error) {
        let errTxt = selectedLang === 'en' ? "Error saving settings!" : (selectedLang === 'ar' ? "حدث خطأ أثناء الحفظ!" : "هەڵەیەک ڕوویدا لە سەیڤکردندا!");
        // بەکارهێنانی نامە جوانەکە (Toast) بۆ هەڵە
        showNotification(errTxt, 'error');
        console.error(error);
    }
});

// ==========================================
// ناردنی لینکی گۆڕینی پاسۆرد (بە پشکنینی داتابەیس)
// ==========================================
const btnSendReset = document.getElementById('btnSendReset');
if (btnSendReset) {
    btnSendReset.addEventListener('click', async () => {
        const emailInput = document.getElementById('resetEmailInput').value.trim().toLowerCase();
        const langSelect = document.getElementById('sysLanguage');
        const lang = langSelect ? langSelect.value : 'ku';
        
        if (!emailInput) {
            let emptyMsg = lang === 'en' ? "Please enter an email!" : (lang === 'ar' ? "يرجى إدخال البريد الإلكتروني!" : "تکایە سەرەتا ئیمەیڵێک بنووسە!");
            return showNotification(emptyMsg, 'error'); 
        }

        const originalBtnHtml = btnSendReset.innerHTML;
        btnSendReset.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        btnSendReset.disabled = true;

        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", emailInput));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                let notFoundMsg = lang === 'en' ? "This email is not registered in the system!" : (lang === 'ar' ? "هذا البريد الإلكتروني غير مسجل في النظام!" : "ئەم ئیمەیڵە لە سیستەمەکەدا بوونی نییە!");
                showNotification(notFoundMsg, 'error'); 
                
                btnSendReset.innerHTML = originalBtnHtml;
                btnSendReset.disabled = false;
                return; 
            }

            await sendPasswordResetEmail(auth, emailInput);
            let msg = lang === 'en' ? `Reset link sent to: ${emailInput}` : (lang === 'ar' ? `تم إرسال رابط التعيين إلى: ${emailInput}` : `لینکی گۆڕینی پاسۆرد نێردرا بۆ: ${emailInput}`);
            showNotification(msg, 'success'); 
            
            document.getElementById('resetEmailInput').value = ''; 

        } catch (error) {
            let err = lang === 'en' ? `Error: ${error.message}` : (lang === 'ar' ? `خطأ: ${error.message}` : `هەڵەیەک ڕوویدا: ${error.message}`);
            showNotification(err, 'error');
        } finally {
            btnSendReset.innerHTML = originalBtnHtml;
            btnSendReset.disabled = false;
        }
    });
}

// ==========================================
// لۆژیکی گۆڕینی تابەکان (Tabs Logic)
// ==========================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active-tab'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        document.getElementById(targetId).classList.add('active-tab');
    });
});

// ==========================================
// لۆژیکی پێشبینیکردن و دابەزاندنی PDF
// ==========================================
let currentPreviewSection = null;
const previewModal = document.getElementById('previewModal');
const previewContainer = document.getElementById('previewContainer');
const btnClosePreviewModal = document.getElementById('btnClosePreviewModal');
const btnConfirmDownload = document.getElementById('btnConfirmDownload');

async function showPreview(section) {
    const docRef = doc(db, "settings", "general");
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return;
    const data = docSnap.data();

    currentPreviewSection = section;

    const langSelect = document.getElementById('sysLanguage');
    const lang = langSelect ? langSelect.value : 'ku';
    
    const header = document.getElementById('previewModalHeader');
    if(section === 'men') {
        header.style.background = 'linear-gradient(to right, #0284c7, #0369a1)';
    } else if (section === 'women') {
        header.style.background = 'linear-gradient(to right, #be185d, #9d174d)';
    } else {
        header.style.background = 'linear-gradient(to right, #475569, #334155)';
    }

    let cardsHtml = '';
    let totalCount = 0;

    if (section === 'back') {
        const socialMediaTxt = translations[lang]?.socialMediaTxt || "سۆشیال میدیای فەرمی 👇🏻";
        
        cardsHtml = `
            <div class="print-card" style="width: 50mm; height: 80mm; background-color: #ffffff; color: #000000; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 5px; box-sizing: border-box; font-family: 'Amiri', system-ui, sans-serif; direction: rtl; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; flex-shrink: 0;">
                <div style="width: 100%; height: 100%; border: 2px dashed rgba(0,0,0,0.4); border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px 5px; box-sizing: border-box;">
                    <div style="font-size: 15px; font-weight: bold; text-align: center; line-height: 1.4; margin-bottom: 15px;">${socialMediaTxt}</div>
                    <img src="barcode.jpeg" alt="Barcode" style="width: 35mm; height: 35mm; object-fit: contain; border-radius: 5px; mix-blend-mode: multiply;">
                </div>
            </div>
        `;
        totalCount = 1; 
    } 
    else {
        const headerInputVal = document.getElementById('customCardHeader').value.trim();
        const headerTxt = headerInputVal !== "" ? headerInputVal : (translations[lang]?.cardHeaderTxt || "بەشی ناسۆری کلێنچکە - هەولێر");
        
        const isFooterShown = document.getElementById('showCardFooter').checked;
        const footerTxt = isFooterShown ? (translations[lang]?.cardFooterTxt || "ژمارەی نۆرە") : "";

        const createCardHtml = (letter, count, color) => {
            let h = color.replace('#', '');
            let r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
            let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            let textColor = yiq < 128 ? '#ffffff' : '#000000';
            let borderColor = yiq < 128 ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)';

            let html = '';
            for (let i = 1; i <= count; i++) {
                html += `
                    <div class="print-card" style="width: 50mm; height: 80mm; background-color: ${color}; color: ${textColor}; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 5px; box-sizing: border-box; font-family: 'Amiri', system-ui, sans-serif; direction: rtl; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-radius: 8px; flex-shrink: 0;">
                        <div style="width: 100%; height: 100%; border: 2px dashed ${borderColor}; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 10px 5px; box-sizing: border-box;">
                            <div style="font-size: 13px; font-weight: bold; text-align: center; line-height: 1.4; margin-top: 2px;">${headerTxt}</div>
                            <div style="font-size: 55px; font-weight: 900; margin: 0; line-height: 1; letter-spacing: 2px;" dir="ltr">${letter}${i}</div>
                            <div style="font-size: 13px; font-weight: bold; opacity: 0.8; margin-bottom: 2px; min-height: 18px;">${footerTxt}</div>
                        </div>
                    </div>
                `;
            }
            return html;
        };

        if (section === 'men') {
            cardsHtml += createCardHtml(data.menLetterB || 'B', data.menCountB || 25, data.menColorB || '#bae6fd');
            cardsHtml += createCardHtml(data.menLetterN || 'N', data.menCountN || 25, data.menColorN || '#0369a1');
            totalCount = (data.menCountB || 25) + (data.menCountN || 25);
        } else {
            cardsHtml += createCardHtml(data.womenLetterB || 'B', data.womenCountB || 20, data.womenColorB || '#fbcfe8');
            cardsHtml += createCardHtml(data.womenLetterN || 'N', data.womenCountN || 20, data.womenColorN || '#be185d');
            totalCount = (data.womenCountB || 20) + (data.womenCountN || 20);
        }
    }
    
    previewContainer.innerHTML = cardsHtml;
    
    let totalTxt = lang === 'en' ? `Total: ${totalCount} Card(s)` : (lang === 'ar' ? `الإجمالي: ${totalCount} بطاقة` : `کۆی گشتی: ${totalCount} کارت`);
    document.getElementById('previewCount').innerText = totalTxt;
    
    previewModal.style.display = 'flex';
}

async function executeDownload() {
    if(!currentPreviewSection) return;

    const originalText = btnConfirmDownload.innerHTML;
    btnConfirmDownload.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> تکایە چاوەڕێ بە...';
    btnConfirmDownload.disabled = true;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [50, 80]
    });

    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.style.top = '0';
    hiddenContainer.style.width = '50mm';
    
    hiddenContainer.innerHTML = previewContainer.innerHTML;
    document.body.appendChild(hiddenContainer);

    const hiddenCards = hiddenContainer.querySelectorAll('.print-card');

    for (let i = 0; i < hiddenCards.length; i++) {
        hiddenCards[i].style.boxShadow = 'none';
        
        const canvas = await html2canvas(hiddenCards[i], { scale: 3, useCORS: true, backgroundColor: null }); 
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        if (i > 0) pdf.addPage([50, 80], 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, 0, 50, 80);
    }

    let fileName = 'Cards.pdf';
    if (currentPreviewSection === 'men') fileName = 'Men-Cards.pdf';
    else if (currentPreviewSection === 'women') fileName = 'Women-Cards.pdf';
    else if (currentPreviewSection === 'back') fileName = 'Back-Card.pdf';

    pdf.save(fileName);

    document.body.removeChild(hiddenContainer);
    btnConfirmDownload.innerHTML = originalText;
    btnConfirmDownload.disabled = false;
    previewModal.style.display = 'none';
}

document.getElementById('btnPreviewMen').addEventListener('click', () => showPreview('men'));
document.getElementById('btnPreviewWomen').addEventListener('click', () => showPreview('women'));
document.getElementById('btnPreviewBack').addEventListener('click', () => showPreview('back'));

if(btnClosePreviewModal) btnClosePreviewModal.addEventListener('click', () => previewModal.style.display = 'none');
if(btnConfirmDownload) btnConfirmDownload.addEventListener('click', executeDownload);

if(previewModal) {
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) previewModal.style.display = 'none';
    });
}

// ==========================================
// لۆژیکی تاقیکردنەوەی زەنگەکان لە سێتینگ
// ==========================================
const btnTestBell = document.getElementById('btnTestBell');
const bellSoundSelect = document.getElementById('bellSoundSelect');
let previewAudio = new Audio();

if (btnTestBell && bellSoundSelect) {
    // ١. لێدانی دەنگ بە کلیک کردن لەسەر دوگمەکە
    btnTestBell.addEventListener('click', () => {
        previewAudio.src = `audio/${bellSoundSelect.value}`;
        previewAudio.currentTime = 0;
        previewAudio.play().catch(e => console.error("کێشە لە لێدانی دەنگ:", e));
    });

    // ٢. لێدانی دەنگ ڕاستەوخۆ لەکاتی گۆڕینی هەڵبژاردنەکە لە لیستەکە
    bellSoundSelect.addEventListener('change', () => {
        previewAudio.src = `audio/${bellSoundSelect.value}`;
        previewAudio.currentTime = 0;
        previewAudio.play().catch(e => console.error("کێشە لە لێدانی دەنگ:", e));
    });
}

// ==========================================
// لۆژیکی Drag and Drop بۆ ڕیزبەندی دکتۆرەکان لە شاشە
// ==========================================
const doctorOrderContainer = document.getElementById('doctorOrderContainer');
let draggedItem = null;

if (doctorOrderContainer) {
    const draggables = doctorOrderContainer.querySelectorAll('.draggable-item');
    
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggedItem = draggable;
            setTimeout(() => {
                draggable.style.opacity = '0.4';
                draggable.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
            }, 0);
        });

        draggable.addEventListener('dragend', () => {
            setTimeout(() => {
                draggedItem.style.opacity = '1';
                draggedItem.style.boxShadow = 'none';
                draggedItem = null;
            }, 0);
        });
    });

    doctorOrderContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(doctorOrderContainer, e.clientY);
        if (draggedItem) {
            if (afterElement == null) {
                doctorOrderContainer.appendChild(draggedItem);
            } else {
                doctorOrderContainer.insertBefore(draggedItem, afterElement);
            }
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.draggable-item:not([style*="opacity: 0.4"])')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}