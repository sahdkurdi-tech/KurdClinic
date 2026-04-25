// js/translations.js

const dictionary = {
    // ==========================================
    // --- ناونیشانی پەڕەکان (بۆ تابی وێبگەڕ) ---
    // ==========================================
    "pageTitleSettings": { ku: "ڕێکخستنەکانی سیستەم", ar: "إعدادات النظام", en: "System Settings" },
    "pageTitleSecretary": { ku: "سکرتێر", ar: "السكرتير", en: "Secretary" },
    "pageTitleMen": { ku: "دکتۆری پیاوان", ar: "طبيب الرجال", en: "Men's Doctor" },
    "pageTitleWomen": { ku: "دکتۆری ئافرەتان", ar: "طبيبة النساء", en: "Women's Doctor" },
    "pageTitleScreen": { ku: "شاشەی چاوەڕوانی", ar: "شاشة الانتظار", en: "Waiting Screen" },
    "pageTitleArchive": { ku: "ئەرشیفی نەخۆشەکان", ar: "أرشيف المرضى", en: "Patients Archive" },
    "pageTitleLogin": { ku: "چوونە ژوورەوەی سیستەم", ar: "تسجيل الدخول للنظام", en: "System Login" },

    // ==========================================
    // --- تابەکانی سێتینگ و وشە نوێیەکان ---
    // ==========================================
    "tabClinic": { ku: "زانیاری کلینیک", ar: "معلومات العيادة", en: "Clinic Info" },
    "tabQueue": { ku: "ڕێکخستنی نۆرە", ar: "إعدادات الدور", en: "Queue Settings" },
    "tabDhikr": { ku: "زیکرەکان", ar: "الأذكار", en: "Dhikr" },
    "tabPass": { ku: "پاسۆرد", ar: "كلمة المرور", en: "Password" },
    "tabCards": { ku: "کارتەکان", ar: "البطاقات", en: "Cards" },
    "cardsSettingsTitle": { ku: "پێشبینی و دابەزاندنی کارتەکان", ar: "معاينة وتنزيل البطاقات", en: "Preview & Download Cards" },
    "cardsSettingsDesc": { ku: "لێرەوە دەتوانیت پێشبینی کارتەکانی نۆرە بکەیت و دواتر وەکو فایلی PDF دابەزێنیت.", ar: "من هنا يمكنك معاينة بطاقات الدور وتنزيلها كملف PDF.", en: "Here you can preview the queue cards and download them as a PDF." },
    "downloadMenBtn": { ku: "پێشبینیکردنی کارتی پیاوان", ar: "معاينة بطاقات الرجال", en: "Preview Men's Cards" },
    "downloadWomenBtn": { ku: "پێشبینیکردنی کارتی ئافرەتان", ar: "معاينة بطاقات النساء", en: "Preview Women's Cards" },

    "bellSoundLbl": { ku: "جۆری زەنگی ئاگادارکردنەوە:", ar: "نوع جرس التنبيه:", en: "Alert Bell Type:" },
    "bell1": { ku: "زەنگی کلاسیک (Classic)", ar: "جرس كلاسيكي", en: "Classic Bell" },
    "bell2": { ku: "زەنگی فڕۆکەخانە (Chime)", ar: "تنبيه المطار", en: "Airport Chime" },
    "bell3": { ku: "زەنگی نەرم (Soft)", ar: "رنين هادئ", en: "Soft Ding" },
    "bell4": { ku: "زەنگی مۆدێرن (Modern)", ar: "رنين حديث", en: "Modern Beep" },
    "bell5": { ku: "زەنگی دوانی (Double Ding)", ar: "رنين مزدوج", en: "Double Ding" },
    
    // کلیلە نوێیەکانی دیوی دواوەی کارت
    "previewBackBtn": { ku: "پێشبینی دیوی دواوەی کارتەکان", ar: "معاينة الوجه الخلفي للبطاقات", en: "Preview Back of Cards" },
    "socialMediaTxt": { ku: "سۆشیال میدیای فەرمی 👇🏻", ar: "وسائل التواصل الاجتماعي الرسمية 👇🏻", en: "Official Social Media 👇🏻" },
    
    "previewModalTitle": { ku: "پێشبینینی کارتەکان", ar: "معاينة البطاقات", en: "Preview Cards" },
    "downloadPdfBtn": { ku: "دابەزاندن بە PDF", ar: "تنزيل كـ PDF", en: "Download as PDF" },
    
    "cardHeaderTxt": { ku: "بەشی ناسۆری کلێنچکە - هەولێر", ar: "قسم ناسور العصعص - أربيل", en: "Pilonidal Sinus Dept - Erbil" },
    "cardFooterTxt": { ku: "ژمارەی نۆرە", ar: "رقم الدور", en: "Queue Number" },
    "cardHeaderInputLbl": { ku: "دەقی سەرەوەی کارت:", ar: "النص العلوي للبطاقة:", en: "Card Top Text:" },
    "showCardFooterLbl": { ku: "پیشاندانی وشەی (ژمارەی نۆرە)", ar: "إظهار كلمة (رقم الدور)", en: "Show 'Queue Number' word" },

    "tabDoctors": { ku: "دکتۆرەکان", ar: "الأطباء", en: "Doctors" },
    "doctorsSettingsTitle": { ku: '<i class="fa-solid fa-user-doctor"></i> پیشاندانی دکتۆرەکان لە شاشە', ar: '<i class="fa-solid fa-user-doctor"></i> عرض الأطباء على الشاشة', en: '<i class="fa-solid fa-user-doctor"></i> Display Doctors on Screen' },
    "doctorsDisplayDesc": { ku: "لێرەوە دیاری بکە کام بەشە لە شاشەی چاوەڕوانی تەلەفزیۆنەکە دەربکەوێت:", ar: "حدد من هنا أي قسم يظهر على شاشة الانتظار:", en: "Choose which section appears on the waiting screen:" },
    "showMenScreen": { ku: "پیشاندانی بەشی پیاوان", ar: "إظهار قسم الرجال", en: "Show Men's Section" },
    "showWomenScreen": { ku: "پیشاندانی بەشی ئافرەتان", ar: "إظهار قسم النساء", en: "Show Women's Section" },

    "dhikrTextLbl": { ku: "دەقی زیکر", ar: "نص الذكر", en: "Dhikr Text" },
    "dhikrTimeLbl": { ku: "مانەوە (چرکە)", ar: "البقاء (ثانية)", en: "Duration (sec)" },
    "islamicFeaturesTitle": { ku: "تایبەتمەندییە ئیسلامییەکان", ar: "الميزات الإسلامية", en: "Islamic Features" },
    "islamicFeaturesDesc": { ku: "لێرەوە دەتوانیت زیکرەکان و کاتی دەرکەوتنیان ڕێکبخەیت.", ar: "من هنا يمكنك إعداد الأذكار ووقت ظهورها.", en: "Here you can set up the Dhikr and their display time." },
    "openDhikrBtn": { ku: "ڕێکخستنی زیکرەکان", ar: "إعدادات الأذكار", en: "Dhikr Settings" },
    "btnOk": { ku: "تەواو", ar: "تم", en: "Done" },

    "tabScreenDesign": { ku: "دیزاینی شاشە", ar: "تصميم الشاشة", en: "Screen Design" },
    "screenDesignTitle": { ku: '<i class="fa-solid fa-palette"></i> هەڵبژاردنی دیزاینی شاشە', ar: '<i class="fa-solid fa-palette"></i> اختيار تصميم الشاشة', en: '<i class="fa-solid fa-palette"></i> Choose Screen Design' },
    "themeDesc": { ku: "کام دیزاینەت بەدڵە، هەڵیبژێرە بۆ شاشەی تەلەفزیۆنەکە:", ar: "اختر التصميم الذي يعجبك لشاشة التلفزيون:", en: "Choose your preferred design for the TV screen:" },
    "theme1Title": { ku: "نیۆنی تاریک (Dark Neon)", ar: "نيون داكن", en: "Dark Neon" },
    "theme2Title": { ku: "شوشەی کریستاڵی (Crystal Glass)", ar: "زجاج كريستالي", en: "Crystal Glass" },
    "theme3Title": { ku: "شوشەیی زیندوو (Vibrant Glass)", ar: "زجاج حيوي", en: "Vibrant Glass" },
    // ==========================================
    // --- بەشی گشتی و پەڕەی سێتینگ (Settings) ---
    // ==========================================
    "dashboardTitle": { 
        ku: '<i class="fa-solid fa-gears"></i> داشبۆردی سەرەکی (ئەدمین)', 
        ar: '<i class="fa-solid fa-gears"></i> لوحة القيادة (المدير)', 
        en: '<i class="fa-solid fa-gears"></i> Main Dashboard (Admin)' 
    },
    "logout": { 
        ku: '<i class="fa-solid fa-arrow-right-from-bracket"></i> چوونەدەرەوە', 
        ar: '<i class="fa-solid fa-arrow-right-from-bracket"></i> تسجيل الخروج', 
        en: '<i class="fa-solid fa-arrow-right-from-bracket"></i> Logout' 
    },
    "navSec": { 
        ku: '<i class="fa-solid fa-desktop" style="color: #3b82f6;"></i> پەڕەی سکرتێر', 
        ar: '<i class="fa-solid fa-desktop" style="color: #3b82f6;"></i> صفحة السكرتير', 
        en: '<i class="fa-solid fa-desktop" style="color: #3b82f6;"></i> Secretary Page' 
    },
    "navMen": { 
        ku: '<i class="fa-solid fa-user-doctor" style="color: #0284c7;"></i> پزیشکی پیاوان', 
        ar: '<i class="fa-solid fa-user-doctor" style="color: #0284c7;"></i> طبيب الرجال', 
        en: '<i class="fa-solid fa-user-doctor" style="color: #0284c7;"></i> Men\'s Doctor' 
    },
    "navWomen": { 
        ku: '<i class="fa-solid fa-user-nurse" style="color: #be185d;"></i> پزیشکی ئافرەتان', 
        ar: '<i class="fa-solid fa-user-nurse" style="color: #be185d;"></i> طبيبة النساء', 
        en: '<i class="fa-solid fa-user-nurse" style="color: #be185d;"></i> Women\'s Doctor' 
    },
    "navScreen": { 
        ku: '<i class="fa-solid fa-tv" style="color: #8b5cf6;"></i> شاشەی چاوەڕوانی', 
        ar: '<i class="fa-solid fa-tv" style="color: #8b5cf6;"></i> شاشة الانتظار', 
        en: '<i class="fa-solid fa-tv" style="color: #8b5cf6;"></i> Waiting Screen' 
    },
    "navArchive": { 
        ku: '<i class="fa-solid fa-box-archive" style="color: #64748b;"></i> ئەرشیف', 
        ar: '<i class="fa-solid fa-box-archive" style="color: #64748b;"></i> الأرشيف', 
        en: '<i class="fa-solid fa-box-archive" style="color: #64748b;"></i> Archive' 
    },
    "successMsg": { 
        ku: "گۆڕانکارییەکان بە سەرکەوتوویی پاشەکەوت کران! ✔️", 
        ar: "تم حفظ التغييرات بنجاح! ✔️", 
        en: "Changes saved successfully! ✔️" 
    },
    "clinicInfo": { 
        ku: '<i class="fa-solid fa-hospital"></i> زانیارییەکانی کلینیک', 
        ar: '<i class="fa-solid fa-hospital"></i> معلومات العيادة', 
        en: '<i class="fa-solid fa-hospital"></i> Clinic Information' 
    },
    "systemLang": { 
        ku: "زمانی سیستەم:", 
        ar: "لغة النظام:", 
        en: "System Language:" 
    },
    "clinicNameLbl": { ku: "ناوی کلینیک (بۆ شاشە):", ar: "اسم العيادة (للشاشة):", en: "Clinic Name (for screen):" },
    "clinicNamePh": { ku: "نموونە: کلینیکی هەولێر", ar: "مثال: عيادة أربيل", en: "Example: Erbil Clinic" },
    
    "menDocNameLbl": { ku: "ناوی دکتۆری پیاوان:", ar: "اسم طبيب الرجال:", en: "Men's Doctor Name:" },
    "menDocNamePh": { ku: "د. ئەحمەد - پیاوان", ar: "د. أحمد - رجال", en: "Dr. Ahmed - Men" },
    "menRoomNumLbl": { ku: "ژووری پیاوان:", ar: "رقم غرفة الرجال:", en: "Men's Room No:" },
    
    "womenDocNameLbl": { ku: "ناوی دکتۆری ئافرەتان:", ar: "اسم طبيبة النساء:", en: "Women's Doctor Name:" },
    "womenDocNamePh": { ku: "د. سارا - ئافرەتان", ar: "د. سارة - نساء", en: "Dr. Sara - Women" },
    "womenRoomNumLbl": { ku: "ژووری ئافرەتان:", ar: "رقم غرفة النساء:", en: "Women's Room No:" },

    "dhikrSettingsTitle": { ku: '<i class="fa-solid fa-mosque"></i> ڕێکخستنی زیکرەکان', ar: '<i class="fa-solid fa-mosque"></i> إعدادات الأذكار', en: '<i class="fa-solid fa-mosque"></i> Dhikr Settings' },
    "addDhikrBtn": { ku: '<i class="fa-solid fa-plus"></i> زیادکردنی زیکر', ar: '<i class="fa-solid fa-plus"></i> إضافة ذكر', en: '<i class="fa-solid fa-plus"></i> Add Dhikr' },
    
    "queueMenSettings": { ku: '<i class="fa-solid fa-list-ol"></i> ڕێکخستنی نۆرە (پیاوان)', ar: '<i class="fa-solid fa-list-ol"></i> إعدادات الدور (الرجال)', en: '<i class="fa-solid fa-list-ol"></i> Queue Settings (Men)' },
    "queueWomenSettings": { ku: '<i class="fa-solid fa-list-ol"></i> ڕێکخستنی نۆرە (ئافرەتان)', ar: '<i class="fa-solid fa-list-ol"></i> إعدادات الدور (النساء)', en: '<i class="fa-solid fa-list-ol"></i> Queue Settings (Women)' },
    
    "letterConsult": { ku: "پیتی بینین:", ar: "حرف المعاينة:", en: "Consult Letter:" },
    "countPatient": { ku: "ژمارەی نەخۆش:", ar: "عدد المرضى:", en: "Patient Count:" },
    "colorLbl": { ku: "ڕەنگ:", ar: "اللون:", en: "Color:" },
    "letterSurgery": { ku: "پیتی نەشتەرگەری:", ar: "حرف العملية:", en: "Surgery Letter:" },
    
    "passMgmtTitle": { 
        ku: '<i class="fa-solid fa-shield-halved"></i> بەڕێوەبردنی تێپەڕوشە (پاسۆرد)', 
        ar: '<i class="fa-solid fa-shield-halved"></i> إدارة كلمة المرور', 
        en: '<i class="fa-solid fa-shield-halved"></i> Password Management' 
    },
    "passMgmtDesc": { 
        ku: "بۆ گۆڕینی پاسۆرد، کلیک بکە بۆ ناردنی لینکی (Reset) بۆ ئیمەیڵی کارمەندەکە.", 
        ar: "لتغيير كلمة المرور، انقر لإرسال رابط التعيين إلى بريد الموظف.", 
        en: "To change the password, click to send a reset link to the employee's email." 
    },
    "sendLinkSec": { ku: "ناردنی لینک بۆ سکرتێر", ar: "إرسال الرابط للسكرتير", en: "Send Link to Secretary" },
    "sendLinkMen": { ku: "ناردنی لینک بۆ دکتۆری پیاوان", ar: "إرسال الرابط لطبيب الرجال", en: "Send Link to Men's Doctor" },
    "sendLinkWomen": { ku: "ناردنی لینک بۆ دکتۆری ئافرەتان", ar: "إرسال الرابط لطبيبة النساء", en: "Send Link to Women's Doctor" },
    "saveSettings": { 
        ku: '<i class="fa-solid fa-floppy-disk"></i> پاشەکەوتکردنی ڕێکخستنەکان', 
        ar: '<i class="fa-solid fa-floppy-disk"></i> حفظ الإعدادات', 
        en: '<i class="fa-solid fa-floppy-disk"></i> Save Settings' 
    },

    // ==========================================
    // --- پەڕەی لۆگین (Login) ---
    // ==========================================
    "loginTitle": { ku: "سیستەمی کلینیک", ar: "نظام العيادة", en: "Clinic System" },
    "lbl_email": { ku: "ئیمەیڵ...", ar: "البريد الإلكتروني...", en: "Email..." },
    "lbl_password": { ku: "تێپەڕوشە (پاسۆرد)...", ar: "كلمة المرور...", en: "Password..." },
    "btn_login": { ku: "چوونە ژوورەوە <i class='fa-solid fa-arrow-left'></i>", ar: "تسجيل الدخول <i class='fa-solid fa-arrow-left'></i>", en: "Login <i class='fa-solid fa-arrow-right'></i>" },

    // ==========================================
    // --- پەڕەی سکرتێر و دکتۆرەکان ---
    // ==========================================
    "secDashboardTitle": { ku: '<i class="fa-solid fa-desktop"></i> سەرپەرشتیاری نۆرە', ar: '<i class="fa-solid fa-desktop"></i> مشرف الدور', en: '<i class="fa-solid fa-desktop"></i> Queue Supervisor' },
    "btnRefresh": { ku: '<i class="fa-solid fa-rotate-right"></i> نوێکردنەوە', ar: '<i class="fa-solid fa-rotate-right"></i> تحديث', en: '<i class="fa-solid fa-rotate-right"></i> Refresh' },
    "womenSection": { ku: "بەشی ئافرەتان", ar: "قسم النساء", en: "Women's Section" },
    "menSection": { ku: "بەشی پیاوان", ar: "قسم الرجال", en: "Men's Section" },
    "consultLabelW": { ku: '<i class="fa-solid fa-eye"></i>بینین', ar: '<i class="fa-solid fa-eye"></i>معاينة', en: '<i class="fa-solid fa-eye"></i>Consultation' },
    "surgeryLabelW": { ku: '<i class="fa-solid fa-syringe"></i>نەشتەرگەری', ar: '<i class="fa-solid fa-syringe"></i>عملية', en: '<i class="fa-solid fa-syringe"></i>Surgery' },
    "consultLabelM": { ku: '<i class="fa-solid fa-eye"></i>بینین', ar: '<i class="fa-solid fa-eye"></i>معاينة', en: '<i class="fa-solid fa-eye"></i>Consultation' },
    "surgeryLabelM": { ku: '<i class="fa-solid fa-syringe"></i>نەشتەرگەری', ar: '<i class="fa-solid fa-syringe"></i>عملية', en: '<i class="fa-solid fa-syringe"></i>Surgery' },
    "btnSendPatient": { ku: '<i class="fa-solid fa-paper-plane"></i> ناردنی نەخۆش بۆ دکتۆر', ar: '<i class="fa-solid fa-paper-plane"></i> إرسال المريض للطبيب', en: '<i class="fa-solid fa-paper-plane"></i> Send Patient to Doctor' },
    "pleaseSelect": { ku: "تکایە ژمارەیەک لە سەرەوە هەڵبژێرە...", ar: "يرجى اختيار رقم من الأعلى...", en: "Please select a number above..." },
    
    // مۆدێلی نوێکردنەوە (Refresh Modal)
    "refreshModalTitle": { ku: '<i class="fa-solid fa-rotate-right"></i> نوێکردنەوەی سیستەم', ar: '<i class="fa-solid fa-rotate-right"></i> تحديث النظام', en: '<i class="fa-solid fa-rotate-right"></i> System Refresh' },
    "refreshModalDesc": { ku: "ئایا دڵنیای کە دەتەوێت نوێترین وەشان بهێنیت؟", ar: "هل أنت متأكد أنك تريد جلب أحدث إصدار؟", en: "Are you sure you want to fetch the latest version?" },
    "refreshModalWarn": { ku: "(ئاگاداری: هەموو ژمارە بەکارهاتووەکان ڕەنگیان ئاسایی دەبێتەوە)", ar: "(تحذير: ستعود جميع الأرقام المستخدمة إلى لونها الطبيعي)", en: "(Warning: All used numbers will return to their normal color)" },
    "btnYesRefresh": { ku: "بەڵێ، نوێی بکەوە ✔️", ar: "نعم، قم بالتحديث ✔️", en: "Yes, Refresh ✔️" },
    "btnNoCancel": { ku: "پەشیمان بوونەوە ❌", ar: "إلغاء ❌", en: "Cancel ❌" },

    // فۆڕمی بەپەلە (Emergency)
    "btnDirectSend": { ku: "ناردنی ڕاستەوخۆ (بەبێ سەرە)", ar: "إرسال مباشر (بدون دور)", en: "Direct Send (No Queue)" },
    "directFormTitle": { ku: '<i class="fa-solid fa-bolt" style="color: #ef4444;"></i> فۆڕمی ناردنی ڕاستەوخۆ', ar: '<i class="fa-solid fa-bolt" style="color: #ef4444;"></i> نموذج الإرسال المباشر', en: '<i class="fa-solid fa-bolt" style="color: #ef4444;"></i> Direct Send Form' },
    "directNameLbl": { ku: "١. ناوی نەخۆش یان ژمارە:", ar: "١. اسم المريض أو الرقم:", en: "1. Patient Name or Number:" },
    "directNamePh": { ku: "بۆ نموونە: محمد، یان 99...", ar: "مثال: محمد، أو 99...", en: "Example: Ahmed, or 99..." },
    "directTypeLbl": { ku: "٢. جۆری حاڵەت (هەڵیبژێرە یان بنووسە):", ar: "٢. نوع الحالة (اختر أو اكتب):", en: "2. Case Type (Select or Type):" },
    "emergencyBadge": { ku: "حاڵەتی بەپەلە", ar: "حالة طارئة", en: "Emergency" },
    "surgeryEmg": { ku: "نەشتەرگەری بەپەلە", ar: "عملية طارئة", en: "Emergency Surgery" },
    "hideWelcomeLbl": { ku: "شاردنەوەی وشەی (فەرموو بۆ ژوورەوە)", ar: "إخفاء كلمة (تفضل بالدخول)", en: "Hide 'Please come in' word" },
    "btnEmergency": { ku: "ناردن بۆ شاشەی چاوەڕوانی", ar: "إرسال إلى شاشة الانتظار", en: "Send to Waiting Screen" },
    "waitingListTitle": { ku: '<i class="fa-solid fa-list-ol"></i> لیستی چاوەڕوانییەکان', ar: '<i class="fa-solid fa-list-ol"></i> قائمة الانتظار', en: '<i class="fa-solid fa-list-ol"></i> Waiting List' },

    // ==========================================
    // --- پەڕەی شاشە (Screen) ---
    // ==========================================
    "numberLabel": { ku: "ژمارەی", ar: "رقم", en: "Number" },
    "welcomeInside": { ku: "فەرموو بۆ ژوورەوە", ar: "تفضل بالدخول", en: "Please come in" },

    // ==========================================
    // --- پەڕەی ئەرشیف (Archive) ---
    // ==========================================
    "archiveTitle": { ku: "ئەرشیفی نەخۆشەکان", ar: "أرشيف المرضى", en: "Patients Archive" },
    "filterSearchLbl": { ku: "گەڕان", ar: "بحث", en: "Search" },
    "filterSearchPh": { ku: "گەڕان بە ناو یان ژمارە...", ar: "بحث بالاسم أو الرقم...", en: "Search by name or number..." },
    "filterSectionLbl": { ku: "بەش", ar: "القسم", en: "Section" },
    "optAllSections": { ku: "هەموو بەشەکان", ar: "كل الأقسام", en: "All Sections" },
    "optMen": { ku: "پیاوان", ar: "رجال", en: "Men" },
    "optWomen": { ku: "ئافرەتان", ar: "نساء", en: "Women" },
    "filterVisitLbl": { ku: "جۆری سەردان", ar: "نوع الزيارة", en: "Visit Type" },
    "optAllVisits": { ku: "هەمووی", ar: "الكل", en: "All" },
    "optConsult": { ku: "بینین", ar: "معاينة", en: "Consultation" },
    "optSurgery": { ku: "نەشتەرگەری", ar: "عملية", en: "Surgery" },
    "filterStatusLbl": { ku: "ڕەوش", ar: "الحالة", en: "Status" },
    "optAllStatuses": { ku: "هەموو ڕەوشەکان", ar: "كل الحالات", en: "All Statuses" },
    "optFinished": { ku: "تەواوبوو", ar: "انتهى", en: "Finished" },
    "optNoShow": { ku: "نەهاتوو", ar: "لم يحضر", en: "No Show" },
    "filterDateFrom": { ku: "لە بەرواری", ar: "من تاريخ", en: "Date From" },
    "filterDateTo": { ku: "بۆ بەرواری", ar: "إلى تاريخ", en: "Date To" },
    "btnSearch": { ku: "گەڕان", ar: "بحث", en: "Search" },
    "searchResultsTitle": { ku: "ئەنجامی گەڕان", ar: "نتائج البحث", en: "Search Results" },
    "totalCountLbl": { ku: "کۆی گشتی:", ar: "الإجمالي:", en: "Total Count:" },
    "patientsWord": { ku: "نەخۆش", ar: "مريض", en: "Patients" },
    
    // خشتەی ئەرشیف
    "thNumName": { ku: "ژمارە / ناو", ar: "الرقم / الاسم", en: "Number / Name" },
    "thSection": { ku: "بەش", ar: "القسم", en: "Section" },
    "thVisitType": { ku: "سەردان", ar: "الزيارة", en: "Visit" },
    "thWaitTime": { ku: "چاوەڕوانی", ar: "الانتظار", en: "Waiting Time" },
    "thDocTime": { ku: "لای دکتۆر", ar: "عند الطبيب", en: "Doctor Time" },
    "thStatus": { ku: "ڕەوش", ar: "الحالة", en: "Status" },
    "thDateTime": { ku: "بەروار و کات", ar: "التاريخ والوقت", en: "Date & Time" },
    "loadingDataMsg": { ku: "چاوەڕێ بە، داتاکان دەهێنرێن...", ar: "يرجى الانتظار، جاري جلب البيانات...", en: "Please wait, loading data..." }
};

// ==========================================
// دروستکردنی ئۆبجێکتی زمانەکان بە شێوەی ئۆتۆماتیک
// ==========================================
const translations = { ar: {}, ku: {}, en: {} };
for (const key in dictionary) {
    translations.ar[key] = dictionary[key].ar;
    translations.ku[key] = dictionary[key].ku;
    translations.en[key] = dictionary[key].en;
}

// ==========================================
// فەنکشنی جێبەجێکردنی زمان لەسەر پەڕەکان
// ==========================================
export function applyLanguage(lang) {
    if (!lang) lang = 'ku';
    
    // ١. گۆڕینی ئاڕاستەی پەڕە (RTL بۆ کوردی/عەرەبی، LTR بۆ ئینگلیزی)
    if (lang === 'en') {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'en';
        document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    } else {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = lang;
        // فۆنتی 'NRT' بۆ کوردی و عەرەبی بەکاردێت
        document.body.style.fontFamily = "'NRT', system-ui, sans-serif";
    }

    // ٢. گۆڕینی تێکستی ناو HTML بەپێی ئەتریبیوتی data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // ٣. گۆڕینی Placeholder ی ئینپوتەکان ئەگەر پێویست بوو
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // ٤. گۆڕینی ناونیشانی پەڕە (Title) ئەگەر data-page-title ی هەبوو
    const pageTitleKey = document.documentElement.getAttribute('data-page-title');
    if (pageTitleKey && translations[lang] && translations[lang][pageTitleKey]) {
        document.title = translations[lang][pageTitleKey];
    }
}

export default translations;