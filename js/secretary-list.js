import { db, collection, query, where, onSnapshot, updateDoc, doc, getDocs, getDoc } from './firebase.js';

let sysSettings = null;

// هێنانەوەی ڕێکخستنەکان بۆ زانینی ڕەنگ و ژمارەی کارتەکان
async function loadSettings() {
    const snap = await getDoc(doc(db, "settings", "general"));
    if (snap.exists()) sysSettings = snap.data();
}
loadSettings();

const patientsTableBody = document.getElementById('patientsTableBody');

// هێنانەوەی نەخۆشەکان
const q = query(
    collection(db, "patients"),
    where("status", "in", ["waiting", "called", "pending"])
);

onSnapshot(q, (snapshot) => {
    patientsTableBody.innerHTML = '';
    let count = 1;

    if (snapshot.empty) {
        patientsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #64748b;">هیچ نەخۆشێک لە لیستەکەدا نییە.</td></tr>';
        return;
    }

    let patients = [];
    snapshot.forEach(doc => {
        patients.push({ id: doc.id, ...doc.data() });
    });
    
    patients.sort((a, b) => {
        let timeA = a.timestamp ? a.timestamp.toDate().getTime() : 0;
        let timeB = b.timestamp ? b.timestamp.toDate().getTime() : 0;
        return timeA - timeB;
    });

    patients.forEach((data) => {
        const tr = document.createElement('tr');
        
        let nameStr = (data.patientName && data.patientName.trim() !== '') ? `<br><span style="font-size: 14px; color: #64748b;"><i class="fa-solid fa-user"></i> ${data.patientName}</span>` : '';
        let label = data.displayLabel || data.number;
        let section = data.section === 'men' ? '<span style="color: #0284c7;"><i class="fa-solid fa-person"></i> پیاوان</span>' : '<span style="color: #be185d;"><i class="fa-solid fa-person-dress"></i> ئافرەتان</span>';
        
        let vType = (data.visitType === 'نەشتەرگەری' || data.visitType === 'Surgery') ? '<span style="color: #ef4444;"><i class="fa-solid fa-syringe"></i> نەشتەرگەری</span>' : '<span style="color: #3b82f6;"><i class="fa-solid fa-eye"></i> سەردان</span>';

        let statusTxt = '';
        if(data.status === 'waiting') statusTxt = '<span style="background: #fffbeb; color: #d97706; padding: 4px 8px; border-radius: 6px; font-weight:bold;">لە چاوەڕوانی</span>';
        if(data.status === 'called') statusTxt = '<span style="background: #f0fdf4; color: #16a34a; padding: 4px 8px; border-radius: 6px; font-weight:bold;">لای پزیشکە</span>';
        if(data.status === 'pending') statusTxt = '<span style="background: #fef2f2; color: #ef4444; padding: 4px 8px; border-radius: 6px; font-weight:bold;">ڕاگیراو</span>';

        let safeName = data.patientName ? data.patientName.replace(/'/g, "\\'") : '';
        
        // زیادکردنی زانیارییەکانی بەش و جۆری سەردان بۆ فەنکشنی ئیدێت
        let btnEdit = `<button onclick="openEditModal('${data.id}', '${label}', '${safeName}', '${data.section}', '${data.visitType}', '${data.number}')" style="background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; padding: 6px 10px; border-radius: 8px; cursor: pointer; font-size: 14px; float: left; margin-top: 4px;" title="دەستکاریکردن"><i class="fa-solid fa-pen-to-square"></i></button>`;

        tr.innerHTML = `
            <td style="font-weight: bold; color: #94a3b8;">${count++}</td>
            <td style="font-weight: bold; font-size: 18px;" dir="ltr">${label} ${btnEdit} ${nameStr}</td>
            <td>${section}</td>
            <td>${vType}</td>
            <td>${statusTxt}</td>
        `;
        patientsTableBody.appendChild(tr);
    });
});

// ==========================================
// لۆژیکی دەستکاریکردن (ئیدێتکردن)ی نەخۆش بە هەر ٤ خشتەکە
// ==========================================
let currentEditId = null;
let selectedEditLabel = "";
let selectedEditNumber = "";
let selectedEditSection = "";
let selectedEditVisitType = "";

const editModal = document.getElementById('editModal');
const editNameInput = document.getElementById('editNameInput');
const btnSaveEdit = document.getElementById('btnSaveEdit');
const btnCancelEdit = document.getElementById('btnCancelEdit');

// دۆزینەوەی ڕەنگی گونجاو بۆ نوسینەکە لەسەر پاشبنەمای کارتەکە
function getContrastColor(hexColor) {
    if (!hexColor) return '#0f172a';
    let hex = hexColor.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#0f172a' : '#ffffff'; 
}

// فەنکشنێک بۆ دروستکردنی هەر یەک لە خشتەکان
function buildEditGrid(containerId, startNum, count, prefix, color, sec, vType, currentLabel, currentSection, currentVisitType, originalNumber) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    let textColor = getContrastColor(color);
    let endNum = startNum + count - 1;

    for (let i = startNum; i <= endNum; i++) {
        let subCounter = i - startNum + 1;
        let btnLabel = `${prefix}${subCounter}`;

        const btn = document.createElement('button');
        btn.style.backgroundColor = color;
        btn.style.color = textColor;
        
        let isCurrent = (sec === currentSection && i == originalNumber);
        
        btn.style.border = isCurrent ? `3px solid #22c55e` : `2px solid transparent`;
        btn.style.borderRadius = '8px';
        btn.style.padding = '8px 2px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '16px';
        btn.style.fontFamily = 'system-ui, sans-serif';
        btn.dir = 'ltr';
        btn.className = 'edit-num-btn'; 
        
        if (isCurrent) {
            btn.classList.add('active-edit-btn');
            btn.style.transform = 'scale(1.1)';
            btn.style.boxShadow = `0 0 10px rgba(34, 197, 94, 0.6)`;
        }

        btn.innerText = btnLabel;

        // کاتێک کلیک لە ژمارەیەکی نوێ دەکات
        btn.onclick = () => {
            selectedEditLabel = btnLabel;
            selectedEditNumber = i;
            selectedEditSection = sec;
            selectedEditVisitType = vType;
            
            // لابردنی هێمای هەڵبژێردراو لە هەموو دوگمەکانی هەر ٤ خشتەکە
            document.querySelectorAll('.edit-num-btn').forEach(b => {
                b.style.border = '2px solid transparent';
                b.style.transform = 'scale(1)';
                b.style.boxShadow = 'none';
                b.classList.remove('active-edit-btn');
            });
            
            // زیادکردنی هێما بۆ ئەم دوگمە نوێیە
            btn.style.border = `3px solid #22c55e`;
            btn.style.transform = 'scale(1.1)';
            btn.style.boxShadow = `0 0 10px rgba(34, 197, 94, 0.6)`;
            btn.classList.add('active-edit-btn');
        };

        container.appendChild(btn);
    }
}

// کردنەوەی پەنجەرەکە
window.openEditModal = function(id, currentLabel, currentName, section, visitType, originalNumber) {
    currentEditId = id;
    selectedEditLabel = currentLabel;
    selectedEditNumber = originalNumber;
    selectedEditSection = section;
    selectedEditVisitType = visitType;

    editNameInput.value = (currentName && currentName !== 'undefined') ? currentName : '';
    
    if (sysSettings) {
        buildEditGrid('gridMenConsultEdit', 1, sysSettings.menCountB || 25, sysSettings.menLetterB || 'B', sysSettings.menColorB || '#bae6fd', 'men', '', currentLabel, section, visitType, originalNumber);
        
        let m2Start = (sysSettings.menCountB || 25) + 1;
        buildEditGrid('gridMenSurgeryEdit', m2Start, sysSettings.menCountN || 25, sysSettings.menLetterN || 'N', sysSettings.menColorN || '#0369a1', 'men', 'نەشتەرگەری', currentLabel, section, visitType, originalNumber);
        
        buildEditGrid('gridWomenConsultEdit', 1, sysSettings.womenCountB || 20, sysSettings.womenLetterB || 'B', sysSettings.womenColorB || '#fbcfe8', 'women', '', currentLabel, section, visitType, originalNumber);
        
        let w2Start = (sysSettings.womenCountB || 20) + 1;
        buildEditGrid('gridWomenSurgeryEdit', w2Start, sysSettings.womenCountN || 20, sysSettings.womenLetterN || 'N', sysSettings.womenColorN || '#be185d', 'women', 'نەشتەرگەری', currentLabel, section, visitType, originalNumber);
    }

    editModal.style.display = 'flex';

    // ڕاستەوخۆ دەچێتە خوارەوە بۆ سەر ئەو ژمارەیەی دیاریکراوە
    setTimeout(() => {
        const activeBtn = document.querySelector('.active-edit-btn');
        if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
};

// داخستنی پەنجەرەکە
btnCancelEdit.addEventListener('click', () => {
    editModal.style.display = 'none';
    currentEditId = null;
});

// سەیڤکردنی گۆڕانکارییەکان
btnSaveEdit.addEventListener('click', async () => {
    if (!currentEditId) return;
    
    const newName = editNameInput.value.trim();
    
    if (!selectedEditLabel) {
        alert('تکایە ژمارەی نۆرە هەڵبژێرە!');
        return;
    }

    const originalText = btnSaveEdit.innerHTML;
    btnSaveEdit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>...';
    btnSaveEdit.disabled = true;

    try {
        await updateDoc(doc(db, "patients", currentEditId), {
            displayLabel: selectedEditLabel,
            number: selectedEditNumber,
            patientName: newName,
            section: selectedEditSection,
            visitType: selectedEditVisitType
        });
        
        editModal.style.display = 'none';
        currentEditId = null;
    } catch (error) {
        console.error("Error updating patient:", error);
        alert("هەڵەیەک ڕوویدا لە کاتی گۆڕینی زانیارییەکان!");
    } finally {
        btnSaveEdit.innerHTML = 'سەیڤکردن';
        btnSaveEdit.disabled = false;
    }
});