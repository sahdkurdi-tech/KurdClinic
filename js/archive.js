import { db, auth, onAuthStateChanged, collection, query, where, onSnapshot, doc, getDoc, signOut } from './firebase.js';
import { applyLanguage } from './translations.js'; 
import translations from './translations.js'; 

// =========================================
// پشکنینی ئاسایش: تەنیا ئەدمین ڕێگەپێدراوە
// =========================================
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'index.html';
    } else {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                if (role === 'admin') {
                    const secureBody = document.getElementById('secureBody');
                    if(secureBody) secureBody.style.display = 'block';
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

const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.replace('index.html');
        });
    });
}

// =========================================
// ناساندنی گۆڕاوەکان (Variables)
// =========================================
const archiveTableBody = document.getElementById('archiveTableBody'); 
const searchInput = document.getElementById('searchInput');
const sectionFilter = document.getElementById('sectionFilter');
const visitTypeFilter = document.getElementById('visitTypeFilter'); 
const statusFilter = document.getElementById('statusFilter');
const dateFrom = document.getElementById('dateFrom');
const dateTo = document.getElementById('dateTo');
const btnSearch = document.getElementById('btnSearch');
const btnReset = document.getElementById('btnReset');
const totalCountElement = document.getElementById('totalCount'); 

let allArchiveData = []; 
let sysSettings = null;
let currentRenderLimit = 50; // گۆڕاوی نوێ بۆ کۆنترۆڵکردنی ژمارەی پیشاندراو

// =========================================
// هێنانی سێتینگەکان
// =========================================
async function loadSystemSettings() {
    try {
        const docSnap = await getDoc(doc(db, "settings", "general"));
        if (docSnap.exists()) {
            sysSettings = docSnap.data();
            const currentLang = sysSettings.language || 'ku';
            applyLanguage(currentLang);
        }
    } catch (error) {
        console.error("Error loading settings:", error);
    }
}

function getContrastColor(hexColor) {
    if (!hexColor) return '#0f172a';
    let hex = hexColor.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(s => s + s).join('');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#0f172a' : '#ffffff'; 
}

// =========================================
// هێنانی داتا لە فایەربەیس
// =========================================
const q = query(
    collection(db, "patients"), 
    where("status", "in", ["finished", "noshow"])
);

onSnapshot(q, async (snapshot) => {
    if (!sysSettings) await loadSystemSettings();

    allArchiveData = [];
    snapshot.forEach((doc) => {
        allArchiveData.push({ id: doc.id, ...doc.data() });
    });

    allArchiveData.sort((a, b) => {
        let timeSourceA = a.completedAt || a.timestamp;
        let timeSourceB = b.completedAt || b.timestamp;

        let timeA = timeSourceA ? timeSourceA.toDate().getTime() : 0;
        let timeB = timeSourceB ? timeSourceB.toDate().getTime() : 0;

        return timeB - timeA; 
    });

    renderTable(); 
});

function renderTable() {
    if(!archiveTableBody) return;
    archiveTableBody.innerHTML = '';
    
    const sTerm = searchInput?.value.trim().toLowerCase() || '';
    const sSection = sectionFilter?.value || 'all';
    const sVisitType = visitTypeFilter?.value || 'all'; 
    const sStatus = statusFilter?.value || 'all';
    const dFrom = dateFrom?.value || '';
    const dTo = dateTo?.value || '';

    // فلتەرکردنی داتاکان
    const filteredData = allArchiveData.filter(data => {
        let rawNum = String(data.displayLabel || data.number).toLowerCase();
        let vType = data.visitType || 'بینین'; 
        
        if (sTerm && !rawNum.includes(sTerm)) return false;
        if (sSection !== 'all' && data.section !== sSection) return false;
        if (sStatus !== 'all' && data.status !== sStatus) return false;
        if (sVisitType !== 'all' && vType !== sVisitType) return false;
        
        if (dFrom || dTo) {
            let docDateStr = "";
            let timeSource = data.completedAt || data.timestamp;
            if (timeSource) {
                const dateObj = timeSource.toDate();
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                docDateStr = `${year}-${month}-${day}`;
                
                if (dFrom && docDateStr < dFrom) return false;
                if (dTo && docDateStr > dTo) return false;
            } else {
                return false; 
            }
        }
        return true;
    });

    if (totalCountElement) {
        totalCountElement.innerText = filteredData.length;
    }

    if (filteredData.length === 0) {
        archiveTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#94a3b8; font-size: 16px;">هیچ داتایەک نەدۆزرایەوە بەم فلتەرانە...</td></tr>`;
        return;
    }

    // بڕینی داتاکان تەنیا بۆ ئەو بڕەی کە دیاریکراوە (٥٠، یان ١٠٠، یان زیاتر)
    const dataToRender = filteredData.slice(0, currentRenderLimit);

    dataToRender.forEach((data, index) => {
        const tr = document.createElement('tr');
        
        let displayLabel = data.displayLabel || String(data.number);
        let displayHTML = "";

        if (displayLabel.includes('(')) {
            let parts = displayLabel.split('(');
            displayHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-size: 18px; font-weight: 900; color: #1e293b; min-width: 35px; text-align: center; display: inline-block;">${parts[0].trim()}</span>
                    <span style="color: #ef4444; font-size: 13px; font-weight: bold; background: #fee2e2; padding: 4px 0; border-radius: 8px; border: 1px solid #fca5a5; width: 65px; text-align: center; display: inline-block;"><i class="fa-solid fa-bell"></i> ${parts[1].replace(')', '').trim()}</span>
                </div>
            `;
        } else {
            let bgColor = "#cbd5e1"; 
            if (sysSettings) {
                if (data.section === 'men') {
                    bgColor = (data.visitType === 'نەشتەرگەری') ? sysSettings.menColorN : sysSettings.menColorB;
                } else if (data.section === 'women') {
                    bgColor = (data.visitType === 'نەشتەرگەری') ? sysSettings.womenColorN : sysSettings.womenColorB;
                }
            }

            let textColor = getContrastColor(bgColor);
            let justNum = data.number ? String(data.number) : ''; 

            displayHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-size: 18px; font-weight: 900; color: #1e293b; min-width: 35px; text-align: center; display: inline-block;">${justNum}</span>
                    <span class="archive-badge" style="background: ${bgColor}; color: ${textColor}; border: 1px solid rgba(0,0,0,0.15); width: 65px; display: flex; justify-content: center; border-radius: 6px; padding: 3px 0;">${displayLabel}</span>
                </div>
            `;
        }

        const lang = (sysSettings && sysSettings.language) ? sysSettings.language : 'ku';
        
        let sectionName = data.section === 'men' 
            ? (lang === 'en' ? 'Men' : (lang === 'ar' ? 'رجال' : 'پیاوان'))
            : (lang === 'en' ? 'Women' : (lang === 'ar' ? 'نساء' : 'ئافرەتان'));

        let sectionHTML = data.section === 'men' 
            ? `<span style="color: #0284c7;"><i class="fa-solid fa-person"></i> ${sectionName}</span>` 
            : `<span style="color: #be185d;"><i class="fa-solid fa-person-dress"></i> ${sectionName}</span>`;
            
        let rawVisitType = data.visitType || 'بینین';
        let vType = rawVisitType;
        if(rawVisitType === 'بینین') {
             vType = lang === 'en' ? 'Consultation' : (lang === 'ar' ? 'معاينة' : 'بینین');
        } else if (rawVisitType === 'نەشتەرگەری') {
             vType = lang === 'en' ? 'Surgery' : (lang === 'ar' ? 'عملية' : 'نەشتەرگەری');
        }
        let visitColor = vType === 'بینین' ? '#3b82f6' : '#ef4444';
        let visitIcon = vType === 'بینین' ? 'fa-eye' : 'fa-syringe';
        let visitTypeHTML = `<span style="color: ${visitColor}; font-weight: bold;"><i class="fa-solid ${visitIcon}"></i> ${vType}</span>`;

        let statusClass = data.status === 'finished' ? 'status-finished' : 'status-noshow';
        let statusName = data.status === 'finished' 
            ? (lang === 'en' ? 'Finished ✔️' : (lang === 'ar' ? 'انتهى ✔️' : 'تەواوبوو ✔️'))
            : (lang === 'en' ? 'No Show ❌' : (lang === 'ar' ? 'لم يحضر ❌' : 'نەهاتوو ❌'));

        let waitTimeHTML = '<span style="color:#94a3b8;">--</span>';
        let doctorTimeHTML = '<span style="color:#94a3b8;">--</span>';

        if (data.timestamp && data.calledAt) {
            let startT = data.timestamp.toDate();
            let calledT = data.calledAt.toDate();
            let diffMins = Math.round((calledT - startT) / 60000); 
            if(diffMins < 0) diffMins = 0;
            waitTimeHTML = `<span style="background: #fffbeb; color: #d97706; padding: 4px 8px; border-radius: 6px; font-weight:bold; font-size:13px;"><i class="fa-solid fa-hourglass-half"></i> ${diffMins} خولەک</span>`;
        }

        if (data.calledAt && data.completedAt && data.status === 'finished') {
            let calledT = data.calledAt.toDate();
            let completedT = data.completedAt.toDate();
            let diffMins = Math.round((completedT - calledT) / 60000);
            if(diffMins < 0) diffMins = 0;
            doctorTimeHTML = `<span style="background: #f0fdf4; color: #16a34a; padding: 4px 8px; border-radius: 6px; font-weight:bold; font-size:13px;"><i class="fa-solid fa-stethoscope"></i> ${diffMins} خولەک</span>`;
        } else if (data.status === 'noshow') {
            doctorTimeHTML = `<span style="color:#ef4444; font-size:13px; font-weight:bold;">نەچووە ژوورەوە</span>`;
        }

        let dateDisplay = "نەزانراو";
        let timeDisplay = "--:--";
        let timeSource = data.completedAt || data.timestamp;
        
        if (timeSource) {
            const dateObj = timeSource.toDate();
            dateDisplay = dateObj.toLocaleDateString('en-ZA'); 
            timeDisplay = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }

        tr.innerHTML = `
            <td style="color: #94a3b8; font-weight: bold;">${index + 1}</td>
            <td>${displayHTML}</td>
            <td>${sectionHTML}</td>
            <td>${visitTypeHTML}</td>
            <td>${waitTimeHTML}</td>
            <td>${doctorTimeHTML}</td>
            <td><span class="badge-status ${statusClass}">${statusName}</span></td>
            <td>
                <div style="display: flex; flex-direction: column; gap: 4px; font-size: 13px;">
                    <span style="color: #64748b; font-family: system-ui, sans-serif;" dir="ltr"><i class="fa-regular fa-calendar-days"></i> ${dateDisplay}</span>
                    <span style="color: #475569; font-weight: bold; font-family: system-ui, sans-serif;" dir="ltr"><i class="fa-regular fa-clock"></i> ${timeDisplay}</span>
                </div>
            </td>
        `;
        archiveTableBody.appendChild(tr);
    });

    // دروستکردنی لۆژیکی سکڕۆڵی بێسنوور (Infinite Scroll)
    if (currentRenderLimit < filteredData.length) {
        const loadingRow = document.createElement('tr');
        loadingRow.innerHTML = `
            <td colspan="8" style="text-align:center; padding:25px; color:#64748b; font-weight:bold; font-size: 16px;">
                <i class="fa-solid fa-spinner fa-spin"></i> خەریکی هێنانی داتای زیاترە...
            </td>
        `;
        archiveTableBody.appendChild(loadingRow);

        // چاودێرێک دروست دەکەین، هەرکاتێک ئەم ڕیزە بینرا لەسەر شاشە، ٥٠ـی تر زیاد دەکات
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                currentRenderLimit += 50; // زیادکردنی ٥٠ دانەی تر
                observer.disconnect(); // پچڕاندنی چاودێرەکە بۆ ئەم ڕیزە
                renderTable(); // دووبارە دروستکردنەوەی خشتەکە
            }
        }, { threshold: 0.1 });

        observer.observe(loadingRow);
    }
}

// ==========================================
// ئیڤێنتەکانی فلتەر (لێرەدا currentRenderLimit دەکەینەوە بە ٥٠)
// ==========================================
if(btnSearch) btnSearch.addEventListener('click', () => { currentRenderLimit = 50; renderTable(); });
if(searchInput) {
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') { currentRenderLimit = 50; renderTable(); }
    });
}
if(sectionFilter) sectionFilter.addEventListener('change', () => { currentRenderLimit = 50; renderTable(); });
if(visitTypeFilter) visitTypeFilter.addEventListener('change', () => { currentRenderLimit = 50; renderTable(); }); 
if(statusFilter) statusFilter.addEventListener('change', () => { currentRenderLimit = 50; renderTable(); });

if(btnReset) {
    btnReset.addEventListener('click', () => {
        if(searchInput) searchInput.value = '';
        if(sectionFilter) sectionFilter.value = 'all';
        if(visitTypeFilter) visitTypeFilter.value = 'all'; 
        if(statusFilter) statusFilter.value = 'all';
        if(dateFrom) dateFrom.value = '';
        if(dateTo) dateTo.value = '';
        currentRenderLimit = 50; // گەڕاندنەوە بۆ ٥٠ لەکاتی ڕیسێت
        renderTable();
    });
}