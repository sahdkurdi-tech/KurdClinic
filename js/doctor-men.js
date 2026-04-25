import { db, collection, query, where, onSnapshot, updateDoc, doc, addDoc, serverTimestamp, orderBy, auth, onAuthStateChanged, signOut, getDoc } from './firebase.js';
import { applyLanguage } from './translations.js'; 
import translations from './translations.js'; 

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
                // تەنیا ڕێگە بە دکتۆری پیاوان و ئەدمین دەدەین
                if (role === 'doctor-men' || role === 'admin') {
                    document.getElementById('secureBody').style.display = 'block';
                    // زۆر گرنگە: لێرەدا دەبێت سێتینگەکان و لیستەکە بار بکرێن
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

// لۆژیکی دەرچوون (Logout)
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        btnLogout.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> چاوەڕێ بە...';
        btnLogout.disabled = true;
        signOut(auth).then(() => {
            window.location.replace('index.html');
        }).catch((error) => {
            console.error("Logout Error:", error);
            btnLogout.disabled = false;
        });
    });
}

const waitingList = document.getElementById('waitingList');
const currentSection = 'men';

document.getElementById('btnRefresh').addEventListener('click', () => {
    window.location.href = window.location.pathname + '?v=' + new Date().getTime();
});

// =========================================
// هێنانی سێتینگی ئەدمین و زمانەکە
// =========================================
let sysSettings = null;

async function loadSystemSettings() {
    try {
        const docSnap = await getDoc(doc(db, "settings", "general"));
        if (docSnap.exists()) {
            sysSettings = docSnap.data();
        } else {
            sysSettings = {
                menColorB: '#bae6fd', menColorN: '#0369a1',
                womenColorB: '#fbcfe8', womenColorN: '#be185d'
            };
            applyLanguage('ku');
        }
        loadQueue('men'); // دوای هێنانی سێتینگەکان لیستەکە بار بکە
    } catch (error) {
        console.error("هەڵە لە هێنانی ڕێکخستنەکان:", error);
        loadQueue('men');
    }
}

function getContrastColor(hexColor) {
    if (!hexColor) return '#0f172a';
    let hex = hexColor.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16), g = parseInt(hex.substring(2, 4), 16), b = parseInt(hex.substring(4, 6), 16);
    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#0f172a' : '#ffffff'; 
}

// =========================================
// لۆژیکی هێنانی لیستی نەخۆشەکان
// =========================================
let unsubscribe = null;

function loadQueue(section) {
    if (unsubscribe) unsubscribe(); 
    // تێبینی: حاڵەتی 'pending' مان زیاد کرد بۆ ئەوەی لە خشتەکەدا بمێنێتەوە
    const q = query(collection(db, "patients"), where("section", "==", section), where("status", "in", ["waiting", "called", "pending"]), orderBy("timestamp", "asc"));

    // وەرگرتنی وشەکان بەپێی زمان بۆ بەکارهێنان لەناو خشتەکەدا
    let txtCall = currentLang === 'en' ? 'Call 🔊' : (currentLang === 'ar' ? 'نداء 🔊' : 'بانگکردن 🔊');
    let txtFinished = currentLang === 'en' ? 'Finished ✔️' : (currentLang === 'ar' ? 'انتهى ✔️' : 'کۆتایی هات ✔️');
    let txtNoShow = currentLang === 'en' ? 'No Show ❌' : (currentLang === 'ar' ? 'لم يحضر ❌' : 'ئامادەنەبوو ❌');
    
    // وشەکانی تایبەت بە حاڵەتی کاتی
    let txtPendingBtn = currentLang === 'en' ? 'Hold ⏳' : (currentLang === 'ar' ? 'مؤقت ⏳' : 'کاتی ⏳');
    let txtPendingStatus = currentLang === 'en' ? 'On Hold (Pending)' : (currentLang === 'ar' ? 'في الانتظار المؤقت' : 'چاوەڕوانی کاتی');

    let txtInside = currentLang === 'en' ? 'Inside' : (currentLang === 'ar' ? 'في الداخل' : 'لەژوورەوەیە');
    let txtWaiting = currentLang === 'en' ? 'Waiting' : (currentLang === 'ar' ? 'في الانتظار' : 'لە چاوەڕوانیدایە');
    let txtWaitTime = currentLang === 'en' ? 'Wait Time:' : (currentLang === 'ar' ? 'وقت الانتظار:' : 'کاتی چاوەڕوانی:');
    let txtInsideTime = currentLang === 'en' ? 'Time Inside:' : (currentLang === 'ar' ? 'الوقت بالداخل:' : 'لە ژوورەوەیە:');
    let txtEmg = currentLang === 'en' ? 'Emergency' : (currentLang === 'ar' ? 'حالة طارئة' : 'حاڵەتی بەپەلە');

    unsubscribe = onSnapshot(q, (snapshot) => {
        waitingList.innerHTML = '';
        snapshot.forEach((patientDoc) => {
            const data = patientDoc.data();
            const id = patientDoc.id;
            const div = document.createElement('div');
            div.className = 'list-item';
            
            let buttons = '';
            // ئەگەر چاوەڕوان بێت یان لە دۆخی کاتی بێت، تەنیا دوگمەی بانگکردنی بۆ دەردەکەوێت
            if (data.status === 'waiting' || data.status === 'pending') {
                buttons = `<button class="btn-call" onclick="updateStatus('${id}', 'called')">${txtCall}</button>`;
            } else if (data.status === 'called') {
                // ئەگەر لە ژوورەوە بێت، هەر سێ دوگمەکەی بۆ دەردەکەوێت
                buttons = `
                    <button class="btn-finish" onclick="updateStatus('${id}', 'finished')">${txtFinished}</button>
                    <button class="btn-noshow" onclick="updateStatus('${id}', 'noshow')">${txtNoShow}</button>
                    <button class="btn-pending" onclick="updateStatus('${id}', 'pending')" style="background: #f59e0b; color: white; border: none; padding: 10px 15px; border-radius: 10px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3); transition: 0.2s;"><i class="fa-solid fa-pause"></i> ${txtPendingBtn}</button>
                `;
            }

            let displayLabel = data.displayLabel || String(data.number);
            let displayNumHTML = "";
            let emergencyBadge = "";
            let isDirectSend = false;
            
            if (displayLabel.includes('(') || displayLabel.includes('بەپەلە') || displayLabel.includes('Emergency') || displayLabel.includes('طارئة')) {
                let nameText = displayLabel;
                let badgeText = txtEmg; // وشەی داینامیک
                
                if (displayLabel.includes('(')) {
                    let parts = displayLabel.split('(');
                    nameText = parts[0].trim();
                    badgeText = parts[1].replace(')', '').trim();
                } else {
                    nameText = displayLabel.replace('بەپەلە', '').replace('لەناکاو', '').replace('حاڵەتی', '').replace('Emergency', '').replace('حالة طارئة', '').trim();
                }

                displayNumHTML = `<div style="display:flex; align-items:center; justify-content:center; background:#f8fafc; color:#0f172a; border:3px solid #cbd5e1; border-radius:16px; padding:10px 20px; font-size:24px; font-weight:bold; box-shadow:0 4px 10px rgba(0,0,0,0.05);">${nameText}</div>`;
                emergencyBadge = `<span class="status-badge" style="background: var(--danger); color: white; margin-left: 10px;"><i class="fa-solid fa-bell"></i> ${badgeText}</span>`;
                isDirectSend = true; 
            } else {
                let bgColor = sysSettings ? (data.visitType === 'نەشتەرگەری' ? sysSettings.menColorN : sysSettings.menColorB) : '#bae6fd';
                let textColor = getContrastColor(bgColor);

                displayNumHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; background:${bgColor}; color:${textColor}; border:2px solid transparent; border-radius:16px; width:75px; height:60px; box-shadow:0 4px 10px rgba(0,0,0,0.15);">
                    <span style="font-size: 24px; font-weight: bold; font-family: system-ui, sans-serif; letter-spacing: 1px;" dir="ltr">${displayLabel}</span>
                </div>`;
            }

            let visitTypeBadge = "";
            if (data.visitType && !isDirectSend) {
                let badgeColor = data.visitType === 'بینین' ? 'var(--primary)' : 'var(--danger)';
                let badgeIcon = data.visitType === 'بینین' ? 'fa-eye' : 'fa-syringe';
                
                // وەرگێڕانی داینامیکی جۆری سەردان
                let vTypeTxt = data.visitType;
                if(vTypeTxt === 'بینین') vTypeTxt = currentLang === 'en' ? 'Consultation' : (currentLang === 'ar' ? 'معاينة' : 'بینین');
                if(vTypeTxt === 'نەشتەرگەری') vTypeTxt = currentLang === 'en' ? 'Surgery' : (currentLang === 'ar' ? 'عملية' : 'نەشتەرگەری');
                
                visitTypeBadge = `<span style="background: ${badgeColor}; color: white; padding: 4px 10px; border-radius: 8px; font-size: 14px; margin-left: 10px; font-weight: bold; box-shadow: var(--shadow-sm);"><i class="fa-solid ${badgeIcon}"></i> ${vTypeTxt}</span>`;
            }

            let liveTimerHTML = "";
            // تایمەری چاوەڕوانی بۆ هەردوو دۆخی waiting و pending وەک یەک کار دەکات
            if ((data.status === 'waiting' || data.status === 'pending') && data.timestamp) {
                liveTimerHTML = `<div style="color: #d97706; font-size: 15px; margin-top: 8px; font-weight: bold; background: #fffbeb; padding: 5px 12px; border-radius: 8px; display: inline-block;"><i class="fa-solid fa-hourglass-half fa-spin-pulse"></i> ${txtWaitTime} <span class="live-timer" dir="ltr" data-time="${data.timestamp.toMillis()}">00:00</span></div>`;
            } else if (data.status === 'called' && data.calledAt) {
                liveTimerHTML = `<div style="color: #16a34a; font-size: 15px; margin-top: 8px; font-weight: bold; background: #f0fdf4; padding: 5px 12px; border-radius: 8px; display: inline-block;"><i class="fa-solid fa-stethoscope fa-beat"></i> ${txtInsideTime} <span class="live-timer" dir="ltr" data-time="${data.calledAt.toMillis()}">00:00</span></div>`;
            }

            let statusTxt = '';
            if (data.status === 'called') {
                statusTxt = txtInside;
            } else if (data.status === 'pending') {
                statusTxt = `<span style="color: #f59e0b;"><i class="fa-solid fa-clock-rotate-left"></i> ${txtPendingStatus}</span>`;
            } else {
                statusTxt = txtWaiting;
            }

            // گۆڕینی باگراوەندی بۆکسەکە ئەگەر نەخۆشەکە کاتی بوو بۆ ئەوەی خێرا جیا بێتەوە
            let isPendingStyle = data.status === 'pending' ? 'border: 2px solid #fcd34d; background-color: #fef3c7;' : '';

            div.innerHTML = `
                <div class="patient-info" style="border-radius: 12px; ${isPendingStyle}">
                    ${displayNumHTML}
                    <div style="display: flex; flex-direction: column;">
                        <div>${emergencyBadge} ${visitTypeBadge} <span style="font-size: 18px; font-weight: bold; margin-right: 10px;">${statusTxt}</span></div>
                        ${liveTimerHTML} 
                    </div>
                </div>
                <div class="action-buttons">${buttons}</div>
            `;
            waitingList.appendChild(div);
        });
    });
}

// =========================================
// ژمێرەری کاتەکان
// =========================================
setInterval(() => {
    document.querySelectorAll('.live-timer').forEach(timer => {
        const startTime = parseInt(timer.getAttribute('data-time'));
        if (startTime) {
            let diff = Date.now() - startTime;
            if (diff < 0) diff = 0; 
            let totalSeconds = Math.floor(diff / 1000);
            timer.innerText = `${Math.floor(totalSeconds / 60).toString().padStart(2, '0')}:${(totalSeconds % 60).toString().padStart(2, '0')}`;
        }
    });
}, 1000); 

window.updateStatus = async function(id, newStatus) {
    let updateData = { status: newStatus };
    if (newStatus === 'called') updateData.calledAt = serverTimestamp();
    else if (newStatus === 'finished' || newStatus === 'noshow') updateData.completedAt = serverTimestamp();
    
    // تێبینی: ئەگەر newStatus بە 'pending' بێت، تەنیا ستاتوسەکەی دەگۆڕێت و کاتەکەی ناگۆڕێت بۆ ئەوەی حسابی چاوەڕوانییەکەی نەفەوتێت.
    
    await updateDoc(doc(db, "patients", id), updateData);
}

// =========================================
// حاڵەتی بەپەلە (Emergency)
// =========================================
const btnToggleEmergency = document.getElementById('btnToggleEmergency');
const emergencyBox = document.getElementById('emergencyBox');
const emergencyIcon = document.getElementById('emergencyIcon');

btnToggleEmergency.addEventListener('click', () => {
    if (emergencyBox.style.display === 'none') {
        emergencyBox.style.display = 'block';
        emergencyIcon.className = 'fa-solid fa-chevron-up';
    } else {
        emergencyBox.style.display = 'none';
        emergencyIcon.className = 'fa-solid fa-chevron-down';
    }
});

document.getElementById('btnEmergency').addEventListener('click', async () => {
    const val = document.getElementById('emergencyInput').value;
    const typeVal = document.getElementById('emergencyType').value || 'بەپەلە'; 
    const isSubtitleHidden = document.getElementById('hideSubtitleCheck').checked;
    
    let alertMsg = currentLang === 'en' ? 'Please enter the patient name' : (currentLang === 'ar' ? 'يرجى إدخال اسم المريض' : 'تکایە ناوی نەخۆش داخڵ بکە');
    if(!val) return alert(alertMsg);
    
    const finalName = val + ` (${typeVal})`;
    
    await addDoc(collection(db, "patients"), {
        number: finalName, 
        displayLabel: finalName, 
        section: currentSection,
        visitType: (typeVal.includes('نەشتەرگەری') || typeVal.includes('Surgery') || typeVal.includes('عملية')) ? "نەشتەرگەری" : "بینین", 
        status: "called",
        timestamp: serverTimestamp(),
        calledAt: serverTimestamp(),
        hideSubtitle: isSubtitleHidden
    });
    
    document.getElementById('emergencyInput').value = '';
    document.getElementById('hideSubtitleCheck').checked = false;
    emergencyBox.style.display = 'none';
});