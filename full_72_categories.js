import fs from 'fs';

const categories = [];

const initialCategories = [
  {
    name: "בריאות",
    icon: "health_and_safety",
    description: "ניהול מידע רפואי, ביטוחים, ותיעוד בדיקות",
    subcategories: [
      {
        name: "קופת חולים",
        features: [
          { type: "upload", label: "העלאת מסמך רפואי" },
          { type: "reminder", label: "תזכורת לחידוש תרופות" },
          { type: "external_link", label: "שירותים של כללית", url: "https://www.clalit.co.il" },
          { type: "form", label: "טופס החזר כספי" }
        ]
      },
      {
        name: "ביטוח בריאות",
        features: [
          { type: "upload", label: "העלאת פוליסת ביטוח" },
          { type: "reminder", label: "תזכורת לחידוש ביטוח" },
          { type: "external_link", label: "פורטל הביטוח", url: "https://www.insurance.org.il" },
          { type: "form", label: "טופס תביעת ביטוח" }
        ]
      }
    ]
  },
  {
    name: "פיננסים",
    icon: "account_balance",
    description: "ניהול חשבונות, השקעות, וחסכונות",
    subcategories: [
      {
        name: "חשבונות בנק",
        features: [
          { type: "upload", label: "העלאת דפי חשבון" },
          { type: "reminder", label: "תזכורת לתשלומים" },
          { type: "external_link", label: "בנק לאומי", url: "https://www.leumi.co.il" },
          { type: "form", label: "טופס העברה בנקאית" }
        ]
      },
      {
        name: "השקעות",
        features: [
          { type: "upload", label: "העלאת דוחות השקעה" },
          { type: "reminder", label: "תזכורת למעקב תיק השקעות" },
          { type: "external_link", label: "הבורסה לניירות ערך", url: "https://www.tase.co.il" },
          { type: "form", label: "טופס הוראת קנייה/מכירה" }
        ]
      }
    ]
  },
  {
    name: "חינוך",
    icon: "school",
    description: "תעודות, קורסים, והשכלה",
    subcategories: [
      {
        name: "בית ספר",
        features: [
          { type: "upload", label: "העלאת תעודות" },
          { type: "reminder", label: "תזכורת לאסיפת הורים" },
          { type: "external_link", label: "פורטל הורים", url: "https://parents.education.gov.il" },
          { type: "form", label: "טופס רישום לחוגים" }
        ]
      },
      {
        name: "לימודים גבוהים",
        features: [
          { type: "upload", label: "העלאת תעודת תואר" },
          { type: "reminder", label: "תזכורת לתשלום שכר לימוד" },
          { type: "external_link", label: "המועצה להשכלה גבוהה", url: "https://che.org.il" },
          { type: "form", label: "טופס בקשת מלגה" }
        ]
      }
    ]
  },
  {
    name: "נדל\"ן",
    icon: "home",
    description: "מסמכי דירה, משכנתא, וחוזי שכירות",
    subcategories: [
      {
        name: "דירה בבעלות",
        features: [
          { type: "upload", label: "העלאת חוזה רכישה" },
          { type: "reminder", label: "תזכורת לתשלום ארנונה" },
          { type: "external_link", label: "רשות המיסים", url: "https://taxes.gov.il" },
          { type: "form", label: "טופס דיווח מס שבח" }
        ]
      },
      {
        name: "שכירות",
        features: [
          { type: "upload", label: "העלאת חוזה שכירות" },
          { type: "reminder", label: "תזכורת לחידוש חוזה" },
          { type: "external_link", label: "מדד מחירי שכירות", url: "https://www.cbs.gov.il" },
          { type: "form", label: "טופס פניה לבעל הדירה" }
        ]
      }
    ]
  },
  {
    name: "משפחה",
    icon: "family_restroom",
    description: "מסמכים משפחתיים, אירועים, ותכנון",
    subcategories: [
      {
        name: "ילדים",
        features: [
          { type: "upload", label: "העלאת תעודות לידה" },
          { type: "reminder", label: "תזכורת לחיסונים" },
          { type: "external_link", label: "טיפת חלב", url: "https://www.health.gov.il" },
          { type: "form", label: "טופס רישום לגן" }
        ]
      },
      {
        name: "נישואין",
        features: [
          { type: "upload", label: "העלאת תעודת נישואין" },
          { type: "reminder", label: "תזכורת ליום נישואין" },
          { type: "external_link", label: "משרד הפנים", url: "https://www.gov.il/he/departments/ministry_of_interior" },
          { type: "form", label: "טופס שינוי שם משפחה" }
        ]
      }
    ]
  },
  {
    name: "קריירה",
    icon: "work",
    description: "קורות חיים, חוזי עבודה, והמלצות",
    subcategories: [
      {
        name: "עבודה נוכחית",
        features: [
          { type: "upload", label: "העלאת חוזה עבודה" },
          { type: "reminder", label: "תזכורת לשיחת משוב" },
          { type: "external_link", label: "משרד העבודה", url: "https://www.gov.il/he/departments/ministry_of_labor" },
          { type: "form", label: "טופס בקשת חופשה" }
        ]
      },
      {
        name: "קורות חיים",
        features: [
          { type: "upload", label: "העלאת קורות חיים" },
          { type: "reminder", label: "תזכורת לעדכון קו\"ח" },
          { type: "external_link", label: "לשכת התעסוקה", url: "https://www.taasuka.gov.il" },
          { type: "form", label: "טופס פרטים אישיים" }
        ]
      }
    ]
  },
  {
    name: "רכב ותחבורה",
    icon: "directions_car",
    description: "רישיונות, ביטוחים, ותחזוקת רכב",
    subcategories: [
      {
        name: "רכב פרטי",
        features: [
          { type: "upload", label: "העלאת רישיון רכב" },
          { type: "reminder", label: "תזכורת לטסט שנתי" },
          { type: "external_link", label: "משרד התחבורה", url: "https://www.gov.il/he/departments/ministry_of_transport" },
          { type: "form", label: "טופס העברת בעלות" }
        ]
      },
      {
        name: "ביטוח רכב",
        features: [
          { type: "upload", label: "העלאת פוליסת ביטוח" },
          { type: "reminder", label: "תזכורת לחידוש ביטוח" },
          { type: "external_link", label: "פול ביטוח", url: "https://www.pool.org.il" },
          { type: "form", label: "טופס תביעת ביטוח" }
        ]
      }
    ]
  },
  {
    name: "ביטוח",
    icon: "security",
    description: "ביטוחי חיים, דירה, ובריאות",
    subcategories: [
      {
        name: "ביטוח חיים",
        features: [
          { type: "upload", label: "העלאת פוליסת ביטוח" },
          { type: "reminder", label: "תזכורת לחידוש ביטוח" },
          { type: "external_link", label: "הפניקס ביטוח", url: "https://www.fnx.co.il" },
          { type: "form", label: "טופס עדכון מוטבים" }
        ]
      },
      {
        name: "ביטוח דירה",
        features: [
          { type: "upload", label: "העלאת פוליסת ביטוח" },
          { type: "reminder", label: "תזכורת לחידוש ביטוח" },
          { type: "external_link", label: "מגדל ביטוח", url: "https://www.migdal.co.il" },
          { type: "form", label: "טופס תביעה" }
        ]
      }
    ]
  },
  {
    name: "מסמכים אישיים",
    icon: "assignment_ind",
    description: "תעודות זהות, דרכונים, ורישיונות",
    subcategories: [
      {
        name: "תעודת זהות",
        features: [
          { type: "upload", label: "העלאת צילום ת.ז." },
          { type: "reminder", label: "תזכורת לחידוש ת.ז. ביומטרית" },
          { type: "external_link", label: "רשות האוכלוסין", url: "https://www.gov.il/he/departments/population_and_immigration_authority" },
          { type: "form", label: "טופס בקשת ת.ז. חדשה" }
        ]
      },
      {
        name: "דרכון",
        features: [
          { type: "upload", label: "העלאת צילום דרכון" },
          { type: "reminder", label: "תזכורת לחידוש דרכון" },
          { type: "external_link", label: "משרד החוץ", url: "https://www.gov.il/he/departments/ministry_of_foreign_affairs" },
          { type: "form", label: "טופס בקשת דרכון" }
        ]
      }
    ]
  }
];

categories.push(...initialCategories);

const categoryTemplates = [
  {
    name: "בריאות הנפש",
    icon: "psychology",
    description: "טיפול פסיכולוגי, מעקב רפואי, ותרופות",
    subcategories: [
      {
        name: "טיפול פסיכולוגי",
        features: [
          { type: "upload", label: "העלאת סיכומי טיפול" },
          { type: "reminder", label: "תזכורת לפגישה הבאה" },
          { type: "external_link", label: "הסתדרות הפסיכולוגים", url: "https://www.psychology.org.il" },
          { type: "form", label: "טופס הפניה לטיפול" }
        ]
      },
      {
        name: "מעקב רפואי",
        features: [
          { type: "upload", label: "העלאת תוצאות בדיקות" },
          { type: "reminder", label: "תזכורת לנטילת תרופות" },
          { type: "external_link", label: "משרד הבריאות", url: "https://www.health.gov.il" },
          { type: "form", label: "טופס דיווח תופעות לוואי" }
        ]
      }
    ]
  },
  {
    name: "תחביבים",
    icon: "sports_esports",
    description: "ספורט, אמנות, ופנאי",
    subcategories: [
      {
        name: "ספורט",
        features: [
          { type: "upload", label: "העלאת מנוי למועדון" },
          { type: "reminder", label: "תזכורת לאימון" },
          { type: "external_link", label: "מכון וינגייט", url: "https://www.wingate.org.il" },
          { type: "form", label: "טופס הרשמה לחוג" }
        ]
      },
      {
        name: "אמנות",
        features: [
          { type: "upload", label: "העלאת תעודות קורסים" },
          { type: "reminder", label: "תזכורת לתערוכה" },
          { type: "external_link", label: "משרד התרבות", url: "https://www.gov.il/he/departments/ministry_of_culture_and_sport" },
          { type: "form", label: "טופס הרשמה לסדנה" }
        ]
      }
    ]
  },
  {
    name: "חיות מחמד",
    icon: "pets",
    description: "טיפול בחיות מחמד, חיסונים, ומזון",
    subcategories: [
      {
        name: "כלבים",
        features: [
          { type: "upload", label: "העלאת רישיון כלב" },
          { type: "reminder", label: "תזכורת לחיסון שנתי" },
          { type: "external_link", label: "השירותים הווטרינריים", url: "https://www.moag.gov.il/vet/Pages/default.aspx" },
          { type: "form", label: "טופס רישום כלב" }
        ]
      },
      {
        name: "חתולים",
        features: [
          { type: "upload", label: "העלאת תעודת חיסון" },
          { type: "reminder", label: "תזכורת לביקור וטרינר" },
          { type: "external_link", label: "עמותת תנו לחיות לחיות", url: "https://www.letlive.org.il" },
          { type: "form", label: "טופס אימוץ חתול" }
        ]
      }
    ]
  },
  {
    name: "טיולים ונסיעות",
    icon: "flight",
    description: "טיסות, מלונות, וביטוח נסיעות",
    subcategories: [
      {
        name: "טיסות",
        features: [
          { type: "upload", label: "העלאת כרטיסי טיסה" },
          { type: "reminder", label: "תזכורת לצ'ק אין" },
          { type: "external_link", label: "רשות שדות התעופה", url: "https://www.iaa.gov.il" },
          { type: "form", label: "טופס הצהרת בריאות" }
        ]
      },
      {
        name: "מלונות",
        features: [
          { type: "upload", label: "העלאת הזמנת מלון" },
          { type: "reminder", label: "תזכורת לצ'ק אאוט" },
          { type: "external_link", label: "משרד התיירות", url: "https://www.gov.il/he/departments/ministry_of_tourism" },
          { type: "form", label: "טופס ביטול הזמנה" }
        ]
      }
    ]
  },
  {
    name: "קניות",
    icon: "shopping_cart",
    description: "אלקטרוניקה, ביגוד, ומוצרי צריכה",
    subcategories: [
      {
        name: "אלקטרוניקה",
        features: [
          { type: "upload", label: "העלאת חשבוניות" },
          { type: "reminder", label: "תזכורת לסיום אחריות" },
          { type: "external_link", label: "המועצה לצרכנות", url: "https://www.consumers.org.il" },
          { type: "form", label: "טופס תביעת אחריות" }
        ]
      },
      {
        name: "ביגוד",
        features: [
          { type: "upload", label: "העלאת קבלות" },
          { type: "reminder", label: "תזכורת להחזרת פריט" },
          { type: "external_link", label: "מועצת האופנה", url: "https://www.fashion.org.il" },
          { type: "form", label: "טופס החלפה/החזרה" }
        ]
      }
    ]
  }
];

categories.push(...categoryTemplates);

const hebrewCategories = [
  { name: "תקשורת", icon: "phone", description: "טלפון, אינטרנט, וטלוויזיה" },
  { name: "ספורט", icon: "sports_soccer", description: "אימונים, תחרויות, וציוד ספורט" },
  { name: "מוזיקה", icon: "music_note", description: "כלי נגינה, שיעורים, והופעות" },
  { name: "אמנות", icon: "palette", description: "ציור, פיסול, וצילום" },
  { name: "בישול", icon: "restaurant", description: "מתכונים, כלי מטבח, וקורסים" },
  { name: "גינון", icon: "grass", description: "צמחים, כלי גינון, ותחזוקה" },
  { name: "קריאה", icon: "menu_book", description: "ספרים, מגזינים, וספריות" },
  { name: "קולנוע", icon: "movie", description: "סרטים, סדרות, ופסטיבלים" },
  { name: "תיאטרון", icon: "theater_comedy", description: "הצגות, כרטיסים, ומנויים" },
  { name: "מחשבים", icon: "computer", description: "חומרה, תוכנה, ותחזוקה" },
  { name: "צילום", icon: "photo_camera", description: "מצלמות, עדשות, ועריכה" },
  { name: "אופנה", icon: "checkroom", description: "בגדים, נעליים, ואביזרים" },
  { name: "יופי", icon: "spa", description: "טיפוח, קוסמטיקה, ומספרות" },
  { name: "דת", icon: "church", description: "חגים, מנהגים, ובתי תפילה" },
  { name: "התנדבות", icon: "volunteer_activism", description: "ארגונים, פרויקטים, ותרומות" },
  { name: "פוליטיקה", icon: "gavel", description: "בחירות, מפלגות, וחקיקה" },
  { name: "מדע", icon: "science", description: "מחקרים, תגליות, וחידושים" },
  { name: "היסטוריה", icon: "history", description: "אירועים, אתרים, ומוזיאונים" },
  { name: "גיאוגרפיה", icon: "public", description: "מדינות, ערים, ומפות" },
  { name: "אסטרונומיה", icon: "star", description: "כוכבים, פלנטות, וטלסקופים" },
  { name: "פילוסופיה", icon: "psychology_alt", description: "הוגים, זרמים, וספרים" },
  { name: "שפות", icon: "translate", description: "לימוד, תרגום, ומילונים" },
  { name: "משחקים", icon: "casino", description: "לוח, קלפים, ודיגיטליים" },
  { name: "אוכל", icon: "restaurant_menu", description: "מסעדות, מתכונים, וחנויות" },
  { name: "משקאות", icon: "local_bar", description: "יין, בירה, וקוקטיילים" },
  { name: "קפה", icon: "coffee", description: "בתי קפה, סוגים, ומכונות" },
  { name: "יוגה", icon: "self_improvement", description: "תנוחות, מדיטציה, וסטודיו" },
  { name: "ריצה", icon: "directions_run", description: "מסלולים, נעליים, ותחרויות" },
  { name: "שחייה", icon: "pool", description: "בריכות, טכניקה, וציוד" },
  { name: "אופניים", icon: "pedal_bike", description: "מסלולים, תחזוקה, וציוד" },
  { name: "טיפוס", icon: "terrain", description: "קירות, ציוד, ומסלולים" },
  { name: "סקי", icon: "downhill_skiing", description: "אתרים, ציוד, וקורסים" },
  { name: "גלישה", icon: "surfing", description: "חופים, גלשנים, וקורסים" },
  { name: "דייג", icon: "phishing", description: "אתרים, ציוד, וטכניקות" },
  { name: "ציד", icon: "sports_handball", description: "עונות, רישיונות, וציוד" },
  { name: "קמפינג", icon: "camping", description: "אתרים, אוהלים, וציוד" },
  { name: "טיולי שטח", icon: "hiking", description: "מסלולים, ציוד, ומפות" },
  { name: "אופנועים", icon: "two_wheeler", description: "דגמים, רישיונות, וציוד" },
  { name: "מטוסים", icon: "flight_takeoff", description: "טיסות, רישיונות, ומועדונים" },
  { name: "סירות", icon: "sailing", description: "דגמים, רישיונות, ומרינות" },
  { name: "רכבות", icon: "train", description: "קווים, כרטיסים, ותחנות" },
  { name: "אוטובוסים", icon: "directions_bus", description: "קווים, כרטיסים, ותחנות" },
  { name: "מוניות", icon: "local_taxi", description: "חברות, תעריפים, והזמנות" },
  { name: "אופנה", icon: "checkroom", description: "בגדים, נעליים, ואביזרים" },
  { name: "תכשיטים", icon: "diamond", description: "טבעות, שרשראות, ועגילים" },
  { name: "שעונים", icon: "watch", description: "דגמים, תיקונים, ואביזרים" },
  { name: "משקפיים", icon: "visibility", description: "מסגרות, עדשות, ובדיקות" },
  { name: "כלי בית", icon: "chair", description: "רהיטים, כלי מטבח, וטקסטיל" },
  { name: "גינה", icon: "yard", description: "צמחים, כלי גינון, וריהוט" },
  { name: "כלי עבודה", icon: "build", description: "חשמליים, ידניים, וחלקי חילוף" },
  { name: "צעצועים", icon: "toys", description: "משחקים, בובות, ופאזלים" },
  { name: "תינוקות", icon: "child_care", description: "בגדים, עגלות, וצעצועים" },
  { name: "חיות מחמד", icon: "pets", description: "מזון, אביזרים, וטיפול" },
  { name: "מתנות", icon: "card_giftcard", description: "אירועים, חנויות, ורעיונות" },
  { name: "יצירה", icon: "brush", description: "חומרים, כלים, וקורסים" },
  { name: "תפירה", icon: "content_cut", description: "בדים, מכונות, ודפוסים" },
  { name: "סריגה", icon: "gesture", description: "חוטים, מסרגות, ודפוסים" },
  { name: "קרמיקה", icon: "opacity", description: "חומר, כלים, וקורסים" },
  { name: "נגרות", icon: "handyman", description: "עץ, כלים, ופרויקטים" }
];

for (let i = categories.length; i < 72; i++) {
  const template = hebrewCategories[i - categories.length];
  
  if (!template) break; // Safety check
  
  categories.push({
    name: template.name,
    icon: template.icon,
    description: template.description,
    subcategories: [
      {
        name: `ניהול ${template.name}`,
        features: [
          { type: "upload", label: `העלאת מסמכי ${template.name}` },
          { type: "reminder", label: `תזכורת ל${template.name}` },
          { type: "external_link", label: `אתרי ${template.name}`, url: "https://www.example.com" },
          { type: "form", label: `טופס ${template.name}` }
        ]
      },
      {
        name: `${template.name} מתקדם`,
        features: [
          { type: "upload", label: `העלאת תיעוד ${template.name}` },
          { type: "reminder", label: `תזכורת אירועי ${template.name}` },
          { type: "external_link", label: `פורטל ${template.name}`, url: "https://www.example.com" },
          { type: "form", label: `טופס רישום ל${template.name}` }
        ]
      }
    ]
  });
}

categories.forEach((category, categoryIndex) => {
  category.id = categoryIndex + 1;
  category.subcategories.forEach((subcategory, subcategoryIndex) => {
    subcategory.id = subcategoryIndex + 1;
    subcategory.features.forEach((feature, featureIndex) => {
      feature.id = featureIndex + 1;
    });
  });
});

const output = { categories };
fs.writeFileSync('categories_full_72.json', JSON.stringify(output, null, 2));
console.log('Generated categories_full_72.json with 72 categories');
