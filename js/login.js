import { auth, signInWithEmailAndPassword, onAuthStateChanged, db, doc, getDoc } from './firebase.js'; 
import { applyLanguage } from './translations.js';

let isLoggingIn = false;

// ==========================================
// هێنانی زمان بۆ پەڕەی لۆگین لە یادگەی ئامێرەکە
// ==========================================
// پەڕەی لۆگین ڕاستەوخۆ بەو زمانە دەکرێتەوە کە دواجار کارمەندەکە بەکاریهێناوە
let currentLang = localStorage.getItem('myUILang') || 'ku'; 
applyLanguage(currentLang);

// ==========================================
// ڕێگریکردن لە لۆگ ئاوت بوونی بەهەڵە (ئۆتۆ-لۆگین)
// ==========================================
onAuthStateChanged(auth, async (user) => {
    if (user && user.uid && !isLoggingIn) { 
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                if (role === 'admin') window.location.href = 'settings.html';
                else if (role === 'secretary') window.location.href = 'secretary.html';
                else if (role === 'doctor-men') window.location.href = 'doctor-men.html';
                else if (role === 'doctor-women') window.location.href = 'doctor-women.html';
            }
        } catch (error) {
            console.error("هەڵە لە هێنانی ڕۆڵی بەکارهێنەر:", error);
        }
    }
});

// ==========================================
// لۆژیکی چوونە ژوورەوە بەپێی Role
// ==========================================
const btnLogin = document.getElementById('btnLogin');
const errorMsg = document.getElementById('errorMsg');

if (btnLogin) {
    btnLogin.addEventListener('click', () => {
        const emailInput = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPassword').value.trim();

        if (!emailInput || !pass) {
            let emptyMsg = currentLang === 'en' ? "Please enter email and password!" : (currentLang === 'ar' ? "يرجى إدخال البريد الإلكتروني وكلمة المرور!" : "تکایە ئیمەیڵ و تێپەڕوشە پڕبکەوە!");
            errorMsg.innerText = emptyMsg;
            return;
        }

        isLoggingIn = true; 
        btnLogin.disabled = true;
        btnLogin.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        signInWithEmailAndPassword(auth, emailInput, pass)
            .then(async (userCredential) => {
                const user = userCredential.user;
                
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        const role = userDoc.data().role;
                        
                        // ڕاستەوخۆ دەنێردرێت بۆ پەڕەی تایبەت بە خۆی
                        if (role === 'admin') window.location.href = 'settings.html';
                        else if (role === 'secretary') window.location.href = 'secretary.html';
                        else if (role === 'doctor-men') window.location.href = 'doctor-men.html';
                        else if (role === 'doctor-women') window.location.href = 'doctor-women.html';
                        else {
                            errorMsg.innerText = currentLang === 'en' ? "Role not defined!" : (currentLang === 'ar' ? "هذا الحساب ليس لديه دور محدد!" : "ئەم هەژمارە ڕۆڵی بۆ دیاری نەکراوە!");
                            resetLoginBtn();
                            isLoggingIn = false;
                        }
                    } else {
                        errorMsg.innerText = currentLang === 'en' ? "Account not found in DB!" : (currentLang === 'ar' ? "لم يتم العثور على الحساب في قاعدة البيانات!" : "هەژمارەکە لە بنکەی دراوە (Database) نەدۆزرایەوە!");
                        resetLoginBtn();
                        isLoggingIn = false;
                    }
                } catch (error) {
                    console.error("Error:", error);
                    errorMsg.innerText = currentLang === 'en' ? "Database connection error!" : (currentLang === 'ar' ? "حدث خطأ في الاتصال بقاعدة البيانات!" : "کێشەیەک هەیە لە پەیوەندی بە داتابەیسەوە!");
                    resetLoginBtn();
                    isLoggingIn = false;
                }
            })
            .catch((error) => {
                errorMsg.innerText = currentLang === 'en' ? "Incorrect email or password!" : (currentLang === 'ar' ? "البريد الإلكتروني أو كلمة المرور غير صحيحة!" : "ئیمەیڵ یان تێپەڕوشە هەڵەیە!");
                resetLoginBtn();
                isLoggingIn = false;
            });
    });
}

function resetLoginBtn() {
    btnLogin.disabled = false;
    let btnText = currentLang === 'en' ? "Login <i class='fa-solid fa-arrow-right'></i>" : (currentLang === 'ar' ? "تسجيل الدخول <i class='fa-solid fa-arrow-left'></i>" : "چوونە ژوورەوە <i class='fa-solid fa-arrow-left'></i>");
    btnLogin.innerHTML = btnText;
}

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && btnLogin) btnLogin.click();
});