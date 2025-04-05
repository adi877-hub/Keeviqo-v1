const fs = require('fs');
const path = require('path');

const baseCategories = [
  { name: "בריאות", icon: "health_and_safety", description: "ניהול מידע רפואי, ביטוחים, ותיעוד בדיקות" },
  { name: "רכב ותחבורה", icon: "directions_car", description: "ניהול מסמכי רכב, רישיונות, וביטוחים" },
  { name: "חינוך", icon: "school", description: "תעודות, קורסים, והשכלה" },
  { name: "פיננסים", icon: "account_balance", description: "ניהול חשבונות, השקעות, וחסכונות" },
  { name: "נדל\"ן", icon: "home", description: "מסמכי דירה, משכנתא, וחוזי שכירות" },
  { name: "משפחה", icon: "family_restroom", description: "מסמכים משפחתיים, אירועים, ותכנון" },
  { name: "קריירה", icon: "work", description: "קורות חיים, חוזי עבודה, והמלצות" },
  { name: "ביטוח", icon: "security", description: "ניהול פוליסות ביטוח מכל הסוגים" },
  { name: "מסמכים אישיים", icon: "description", description: "תעודות זהות, דרכונים, ומסמכים רשמיים" },
  { name: "צבא ובטחון", icon: "military_tech", description: "שירות צבאי, מילואים, ומסמכים בטחוניים" },
  { name: "תחביבים", icon: "sports_esports", description: "ניהול מידע על תחביבים ופעילויות פנאי" },
  { name: "חיות מחמד", icon: "pets", description: "ניהול מידע על חיות מחמד וטיפולים וטרינריים" },
  { name: "תיירות ונסיעות", icon: "flight", description: "ניהול מידע על טיולים, נסיעות, וחופשות" },
  { name: "תקשורת", icon: "phone", description: "ניהול חשבונות טלפון, אינטרנט, וטלוויזיה" },
  { name: "קניות", icon: "shopping_cart", description: "ניהול קבלות, אחריות, והחזרות" },
  { name: "אוכל ותזונה", icon: "restaurant", description: "ניהול מידע על תזונה, מתכונים, והזמנות" },
  { name: "ספורט וכושר", icon: "fitness_center", description: "ניהול מידע על אימונים, תחרויות, ותוצאות" },
  { name: "תרבות ובידור", icon: "movie", description: "ניהול מידע על סרטים, הצגות, וקונצרטים" },
  { name: "דת ומסורת", icon: "church", description: "ניהול מידע על אירועים דתיים ומסורתיים" },
  { name: "התנדבות", icon: "volunteer_activism", description: "ניהול מידע על פעילויות התנדבות" },
  { name: "מחשבים וטכנולוגיה", icon: "computer", description: "ניהול מידע על מחשבים, תוכנות, ורישיונות" },
  { name: "אמנות ויצירה", icon: "palette", description: "ניהול מידע על יצירות אמנות ופרויקטים" },
  { name: "גינון", icon: "yard", description: "ניהול מידע על צמחים, כלי גינון, ותחזוקה" },
  { name: "בנייה ושיפוצים", icon: "construction", description: "ניהול מידע על פרויקטי בנייה ושיפוצים" }
];

const additionalCategories = [
  { name: "ביגוד ואופנה", icon: "checkroom", description: "ניהול מידע על בגדים, אביזרים, וקניות" },
  { name: "תחבורה ציבורית", icon: "directions_bus", description: "ניהול מידע על כרטיסים, מנויים, ולוחות זמנים" },
  { name: "אירועים מיוחדים", icon: "event", description: "ניהול מידע על חתונות, בר מצוות, וימי הולדת" },
  { name: "מוזיקה", icon: "music_note", description: "ניהול מידע על כלי נגינה, שיעורים, והופעות" },
  { name: "ספרים וקריאה", icon: "menu_book", description: "ניהול מידע על ספרים, ספריות, והשאלות" },
  { name: "יופי וטיפוח", icon: "spa", description: "ניהול מידע על טיפולי יופי, מוצרים, ותורים" },
  { name: "בריאות הנפש", icon: "psychology", description: "ניהול מידע על טיפולים, תרופות, ומפגשים" },
  { name: "קהילה ושכונה", icon: "people", description: "ניהול מידע על פעילויות קהילתיות ושכונתיות" },
  { name: "איכות הסביבה", icon: "eco", description: "ניהול מידע על פעילויות סביבתיות ומיחזור" },
  { name: "משפט וחוק", icon: "gavel", description: "ניהול מידע על הליכים משפטיים, חוזים, ותביעות" },
  { name: "פוליטיקה", icon: "how_to_vote", description: "ניהול מידע על בחירות, מפלגות, ופעילות פוליטית" },
  { name: "מדע וטכנולוגיה", icon: "science", description: "ניהול מידע על מחקרים, פרויקטים, וחידושים" },
  { name: "חלל ואסטרונומיה", icon: "rocket", description: "ניהול מידע על תצפיות, אירועים, וחידושים" },
  { name: "ים וימאות", icon: "sailing", description: "ניהול מידע על סירות, רישיונות, ופעילויות ימיות" },
  { name: "טיסה ותעופה", icon: "flight_takeoff", description: "ניהול מידע על רישיונות טיס, קורסים, וטיסות" },
  { name: "צילום", icon: "photo_camera", description: "ניהול מידע על ציוד צילום, קורסים, ותערוכות" },
  { name: "וידאו וקולנוע", icon: "videocam", description: "ניהול מידע על ציוד וידאו, פרויקטים, והקרנות" },
  { name: "רדיו ושידור", icon: "radio", description: "ניהול מידע על ציוד שידור, תוכניות, ורישיונות" },
  { name: "אופניים", icon: "pedal_bike", description: "ניהול מידע על אופניים, ציוד, ומסלולים" },
  { name: "אופנועים", icon: "two_wheeler", description: "ניהול מידע על אופנועים, רישיונות, וטיפולים" },
  { name: "קמפינג וטיולים", icon: "hiking", description: "ניהול מידע על ציוד קמפינג, מסלולים, וטיולים" },
  { name: "דיג", icon: "phishing", description: "ניהול מידע על ציוד דיג, רישיונות, ומקומות דיג" },
  { name: "ציד", icon: "sports_handball", description: "ניהול מידע על ציוד ציד, רישיונות, ועונות ציד" },
  { name: "אוספים", icon: "collections", description: "ניהול מידע על אוספים, פריטים, ותערוכות" },
  { name: "מטבעות ובולים", icon: "money", description: "ניהול מידע על אוספי מטבעות, בולים, ומכירות" },
  { name: "אמנות לחימה", icon: "sports_martial_arts", description: "ניהול מידע על אימונים, תחרויות, ודרגות" },
  { name: "יוגה ומדיטציה", icon: "self_improvement", description: "ניהול מידע על שיעורים, סדנאות, ותרגולים" },
  { name: "ריקוד", icon: "nightlife", description: "ניהול מידע על שיעורים, הופעות, ותחרויות" },
  { name: "תיאטרון", icon: "theater_comedy", description: "ניהול מידע על הצגות, קורסים, ואודישנים" },
  { name: "קולינריה ובישול", icon: "restaurant_menu", description: "ניהול מידע על קורסי בישול, מתכונים, וכלים" },
  { name: "אפייה", icon: "cake", description: "ניהול מידע על קורסי אפייה, מתכונים, וכלים" },
  { name: "יין ואלכוהול", icon: "wine_bar", description: "ניהול מידע על יינות, משקאות, וטעימות" },
  { name: "קפה ותה", icon: "coffee", description: "ניהול מידע על סוגי קפה, תה, וכלים" },
  { name: "גידול צמחים", icon: "grass", description: "ניהול מידע על צמחים, זרעים, וטיפול" },
  { name: "חקלאות", icon: "agriculture", description: "ניהול מידע על גידולים, ציוד, ועונות" },
  { name: "מלאכת יד", icon: "build", description: "ניהול מידע על פרויקטים, כלים, וחומרים" },
  { name: "תפירה וסריגה", icon: "content_cut", description: "ניהול מידע על פרויקטים, כלים, וחומרים" },
  { name: "קרמיקה וחימר", icon: "design_services", description: "ניהול מידע על פרויקטים, כלים, וחומרים" },
  { name: "עבודות עץ", icon: "carpenter", description: "ניהול מידע על פרויקטים, כלים, וחומרים" },
  { name: "עבודות מתכת", icon: "hardware", description: "ניהול מידע על פרויקטים, כלים, וחומרים" },
  { name: "תכשיטנות", icon: "diamond", description: "ניהול מידע על פרויקטים, כלים, וחומרים" },
  { name: "אלקטרוניקה", icon: "memory", description: "ניהול מידע על פרויקטים, רכיבים, וכלים" },
  { name: "תכנות ופיתוח", icon: "code", description: "ניהול מידע על פרויקטים, שפות, וכלים" },
  { name: "משחקי מחשב", icon: "sports_esports", description: "ניהול מידע על משחקים, ציוד, ותחרויות" },
  { name: "משחקי לוח", icon: "casino", description: "ניהול מידע על משחקים, אוספים, ותחרויות" },
  { name: "פאזלים", icon: "extension", description: "ניהול מידע על פאזלים, אוספים, ותחרויות" },
  { name: "אסטרולוגיה", icon: "auto_awesome", description: "ניהול מידע על מפות אסטרולוגיות, תחזיות, וקורסים" },
  { name: "נומרולוגיה", icon: "tag", description: "ניהול מידע על חישובים, תחזיות, וקורסים" }
];

const allCategories = [...baseCategories, ...additionalCategories];

const allCategoriesPath = path.join(__dirname, 'all_categories.json');
const existingData = JSON.parse(fs.readFileSync(allCategoriesPath, 'utf-8'));
const existingCategories = existingData.categories;

const existingCategoryNames = new Set(existingCategories.map(cat => cat.name));

let nextCategoryId = Math.max(...existingCategories.map(cat => cat.id)) + 1;

const newCategories = [];
for (const category of allCategories) {
  if (!existingCategoryNames.has(category.name)) {
    const newCategory = {
      id: nextCategoryId++,
      name: category.name,
      icon: category.icon,
      description: category.description,
      subcategories: [
        {
          id: `${nextCategoryId-1}-1`,
          name: `ניהול ${category.name}`,
          features: [
            { id: `${nextCategoryId-1}-1-1`, type: "upload", label: `העלאת מסמכי ${category.name}` },
            { id: `${nextCategoryId-1}-1-2`, type: "reminder", label: `תזכורת ל${category.name}` },
            { id: `${nextCategoryId-1}-1-3`, type: "external_link", label: `קישור ל${category.name}`, url: "https://www.gov.il" },
            { id: `${nextCategoryId-1}-1-4`, type: "form", label: `טופס ${category.name}` }
          ]
        },
        {
          id: `${nextCategoryId-1}-2`,
          name: `מידע על ${category.name}`,
          features: [
            { id: `${nextCategoryId-1}-2-1`, type: "upload", label: `העלאת מידע על ${category.name}` },
            { id: `${nextCategoryId-1}-2-2`, type: "reminder", label: `תזכורת למידע על ${category.name}` },
            { id: `${nextCategoryId-1}-2-3`, type: "external_link", label: `מידע נוסף על ${category.name}`, url: "https://www.gov.il" },
            { id: `${nextCategoryId-1}-2-4`, type: "form", label: `טופס מידע על ${category.name}` }
          ]
        }
      ]
    };
    newCategories.push(newCategory);
  }
}

const updatedCategories = [...existingCategories, ...newCategories];

const updatedData = {
  categories: updatedCategories
};

fs.writeFileSync(allCategoriesPath, JSON.stringify(updatedData, null, 2), 'utf-8');

console.log(`Updated all_categories.json with ${newCategories.length} new categories.`);
console.log(`Total categories: ${updatedCategories.length}`);
