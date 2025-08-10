export default function VisionPage() {
  return (
    <div className="prose prose-sm rtl:prose-h1:font-bold rtl:prose-h2:font-semibold">
      <h1>Project Description – Keeviqo: Smart System for Personal & Bureaucratic Management</h1>
      <h2>Goal:</h2>
      <p>Build a smart, cloud-based web application called Keeviqo that helps individuals manage every aspect of their personal, medical, financial, educational, legal, and bureaucratic life – all in one secure and intuitive platform.</p>
      <h2>Core Functionalities Required:</h2>
      <ul>
        <li>Full user login & registration system (with self-deletion option)</li>
        <li>Smart reminders based on context (not only dates)</li>
        <li>Document upload + smart OCR-based scanning (KeeviScan)</li>
        <li>Auto-categorization of documents based on their content</li>
        <li>Personal assistant feature (“I need help” button – AI based)</li>
        <li>QR code profile sharing (partial or full, by link or scan)</li>
        <li>Admin dashboard to manage categories, users, data</li>
        <li>Payments integration (PayPal / Stripe / Cardcom)</li>
        <li>Auto-generated receipts with serial numbering</li>
        <li>Analytics dashboard to monitor usage, categories, reminders, etc.</li>
        <li>User roles and permissions</li>
        <li>Form submission system with editable templates</li>
        <li>Built-in support system (contact form, FAQ center, chatbot)</li>
        <li>Cloud-based backup and encryption</li>
        <li>Scalable backend & modular frontend</li>
      </ul>
      <h2>Database & Technology Preferences:</h2>
      <ul>
        <li>Frontend: React</li>
        <li>Backend: Node.js (Express)</li>
        <li>Database: MongoDB (Atlas preferred)</li>
        <li>Forms: Formik + Yup</li>
        <li>File uploads: Multer or Cloudinary</li>
        <li>Security: JWT + Encryption</li>
        <li>Analytics: Google Analytics or built-in</li>
        <li>RTL Support: Yes (System must be in Hebrew)</li>
      </ul>
      <h2>Smart AI Features (needed):</h2>
      <ul>
        <li>AI-based form filling assistance</li>
        <li>Document scanner + categorizer</li>
        <li>Assistant that understands context and suggests next actions</li>
        <li>Notification and follow-up engine</li>
        <li>Smart dashboard with live analysis</li>
        <li>Future integrations with CRM & government APIs</li>
      </ul>

      <h1>פונקציות חכמות במערכת Keeviqo</h1>
      <p>המסמך כולל את כל הפונקציות, הכלים, המודולים והיכולות החכמות שמרכיבות את מערכת Keeviqo. כל פונקציה נועדה לייעל את החיים האישיים, הרפואיים, הבירוקרטיים והמשפחתיים – ולחסוך זמן, מאמץ ובלבול.</p>
      <ol>
        <li>דשבורד חכם – סקירה כללית של החיים – לפי תחום, סטטוס, דחיפות והקשר; הצגת משימות פתוחות, תורים קרובים, תשלומים, התראות אישיות</li>
        <li>מערכת התראות חכמה – תזכורות מותאמות הקשר (לא רק לפי זמן); כוללת תורים, חידושי מרשמים, חובות אקדמיים, פניות פתוחות ועוד</li>
        <li>סריקה חכמה – KeeviScan – העלאת מסמכים מכל סוג; זיהוי אוטומטי של תוכן, שיוך לקטגוריה מתאימה, תיוג חכם, הפקת פעולה</li>
        <li>כפתור 'אני צריך עזרה' – לחצן עזרה אוניברסלי; הבנת הקשר ופתרון מיידי – קישור, טופס, תזכורת או פעולה אוטומטית</li>
        <li>הפקת קבלות אוטומטית – מספור רץ לפי חוק, הפקת PDF, שליחה למשתמש ולמפתחת; שמירה לפי קטגוריה, תיעוד לשימוש מס או רו״ח</li>
        <li>סליקת תשלומים מובנית – תשלום חכם דרך PayPal, Stripe, קארדקום או משולם; תמיכה בשדרוג לגרסת פרימיום, שמירת היסטוריית תשלומים</li>
        <li>יצירת פרופיל אישי חכם – כל משתמש מקבל אזור אישי ייחודי; כולל דשבורד, QR לשיתוף, תיעוד מסודר וניתוח חיים דיגיטלי</li>
        <li>חיפוש חכם בכל המערכת – חיפוש לפי מילה, תאריך, קטגוריה או תוכן מסמך; מיון לפי רלוונטיות, סימון אוטומטי של תוצאות חשובות</li>
        <li>מערכת הרשאות וניהול משתמשים – כניסה עם סיסמה, הרשאות לפי תפקיד (משתמש רגיל / עורך / אדמין); גישה לפי קטגוריה, אפשרות ייפוי כוח זמני או קבוע</li>
        <li>יצירת טפסים חכמים – מילוי אוטומטי של טפסים רפואיים / בירוקרטיים; שמירה בפורמט PDF חתום, שליחה חכמה לפי הקשר</li>
        <li>מחיקה עצמית מלאה של פרופיל – כל משתמש יכול למחוק את חשבונו והמידע נשמר בגיבוי מוצפן לפני המחיקה; מנגנון מחיקה מאובטח עם אישור כפול</li>
        <li>סנכרון עם יומנים חיצוניים – אפשרות סנכרון עם Google Calendar / Outlook; כולל רקע – Keeviqo שולחת גם התראות פנימיות חכמות, כך שהסנכרון הוא תוספת בלבד</li>
        <li>מרכז עזרה אוטומטי – כולל מדריכים קצרים, שאלות נפוצות, וסרטוני הסבר; נגיש מכל מקום במערכת – עם אפשרות לפנייה ישירה</li>
        <li>מערכת CRM ניהולית (למנהלת Keeviqo) – מאגר משתמשים, סטטוס מנויים, פעילות, תמיכה, קבלות; היסטוריית פניות, גישה לפרופילים (בהרשאה בלבד)</li>
        <li>דוחות וניתוחים חכמים – ניתוח תשלומים, הוצאות, תורים, תדירות שימוש; גרפים אישיים לפי קטגוריה, דוח חודשי/שנתי</li>
        <li>KeeviScan – סריקה חכמה – זיהוי אוטומטי של מסמכים עם תיוג לפי תוכן, סוג, תאריך וקטגוריה; העלאה בלחיצה, איתור מידע קריטי, שיוך מיידי למקום הנכון במערכת</li>
        <li>KeeviBot – עוזר חכם – בוט תמיכה שמלווה את המשתמש לפי ההקשר; מסייע במילוי טפסים, שליחת פניות, איתור זכויות או פעולות פתוחות</li>
        <li>הגדרת סטטוס חיים אישי – בחירה בין סטודנט, הורה, עצמאי, שכיר, פנסיונר, הורה יחידני ועוד; המערכת מציעה קטגוריות, זכויות והתראות רלוונטיות לפי סטטוס</li>
        <li>ניתוח אוטומטי של זכויות – איתור זכויות אישיות לפי נתוני הפרופיל; הצעות לפעולה או מימוש זכויות עם טפסים מוכנים ושליחה חכמה</li>
        <li>תיעוד שיחות ומעקב פניות – שמירת סיכום שיחות עם גופים רשמיים/רפואיים; מעקב אחר פניות פתוחות כולל סטטוס מענה, מועד יעד לתגובה</li>
        <li>יצירת קישורים חיים לפי פרטים אישיים – המערכת יוצרת קישורים מדויקים לגופים רשמיים לפי קופה, אזור מגורים, סוג בקשה; לדוגמה: קישור לטופס החזר בקופת החולים שלך בלבד</li>
        <li>שיתוף פרופיל לפי קישור או QR – אפשרות לשתף קטגוריה מסוימת או את כל הפרופיל עם גורם חיצוני; באמצעות קישור חד-פעמי או QR אישי מוגן</li>
        <li>מערכת הרשאות בתוך המשפחה – הורה, בן זוג, אפוטרופוס או ילד יכולים לקבל גישה לפי הרשאה; גישה זמנית, חלקית או מלאה לפי הצורך</li>
        <li>הפקת תיק חיים דיגיטלי לשעת חירום – קובץ כולל עם כל המידע הקריטי של המשתמש; כולל תרופות, מחלות רקע, איש קשר חירום, אלרגיות</li>
        <li>סיכום חודשי אוטומטי – דוח מפורט לפי תורים, מסמכים, הוצאות, פניות ופעולות; נשלח למשתמש אחת לחודש או על פי בקשה</li>
        <li>ניתוח עומסים ותזמון חכם – זיהוי עומסים אישיים ומקצועיים; הצעות לפעולה בעיתוי נכון לפי העדפות ויכולות</li>
        <li>סנכרון בין קטגוריות – מידע שמוזן בקטגוריה אחת מתעדכן גם בקטגוריה נלווית; לדוגמה: מסמך שהוזן ב'תיקים רפואיים' יופיע גם ב'קבלות'</li>
        <li>תמיכה אנושית חכמה (לפרימיום) – אפשרות לשלוח בקשה לייעוץ או תמיכה אנושית; שירות אישי מתווסף מעל התמיכה האוטומטית</li>
        <li>מעקב מדדים אישיים – מעקב אחר מדדים רפואיים, רגשיים או תפקודיים; כולל גרפים, השוואות, תזכורות והתראות על שינוי חריג</li>
        <li>מצב חירום – לחצן SOS אוניברסלי; כולל הצגת מידע קריטי, חיוג מהיר, QR רפואי אישי, איתור מיקום</li>
      </ol>
    </div>
  )
}