import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const translationsHE = {
  common: {
    back: 'חזרה',
    loading: 'טוען...',
    error: 'שגיאה',
    save: 'שמור',
    cancel: 'ביטול',
    submit: 'שלח',
    success: 'הצלחה',
    notFound: 'לא נמצא',
  },
  dashboard: {
    title: 'Keeviqo Dashboard',
    categories: 'קטגוריות',
    smartFeatures: 'פיצ\'רים חכמים',
    includes: 'כולל',
  },
  features: {
    upload: 'העלאת מסמך',
    reminder: 'יצירת תזכורת',
    externalLink: 'קישור חיצוני',
    form: 'מילוי טופס',
    availableActions: 'פעולות זמינות',
  },
  upload: {
    title: 'העלאת מסמך',
    dragDrop: 'לחץ לבחירת קובץ או גרור לכאן',
    uploadButton: 'העלאה',
    uploading: 'מעלה...',
    success: 'הקובץ הועלה בהצלחה!',
    uploadAnother: 'העלאת קובץ נוסף',
    error: 'שגיאה בהעלאת הקובץ',
  },
  reminder: {
    title: 'יצירת תזכורת',
    titleField: 'כותרת',
    description: 'תיאור',
    date: 'תאריך',
    frequency: 'תדירות',
    frequencies: {
      once: 'חד פעמי',
      daily: 'יומי',
      weekly: 'שבועי',
      monthly: 'חודשי',
    },
    success: 'התזכורת נוצרה בהצלחה!',
    createAnother: 'יצירת תזכורת נוספת',
    error: 'שגיאה ביצירת התזכורת',
  },
  form: {
    title: 'מילוי טופס',
    requiredFields: 'יש למלא את כל שדות החובה',
    success: 'הטופס נשלח בהצלחה!',
    fillAnother: 'מילוי טופס נוסף',
    error: 'שגיאה בשליחת הטופס',
  },
};

const translationsEN = {
  common: {
    back: 'Back',
    loading: 'Loading...',
    error: 'Error',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    success: 'Success',
    notFound: 'Not Found',
  },
  dashboard: {
    title: 'Keeviqo Dashboard',
    categories: 'Categories',
    smartFeatures: 'Smart Features',
    includes: 'Includes',
  },
  features: {
    upload: 'Upload Document',
    reminder: 'Create Reminder',
    externalLink: 'External Link',
    form: 'Fill Form',
    availableActions: 'Available Actions',
  },
  upload: {
    title: 'Upload Document',
    dragDrop: 'Click to select a file or drag it here',
    uploadButton: 'Upload',
    uploading: 'Uploading...',
    success: 'File uploaded successfully!',
    uploadAnother: 'Upload Another File',
    error: 'Error uploading file',
  },
  reminder: {
    title: 'Create Reminder',
    titleField: 'Title',
    description: 'Description',
    date: 'Date',
    frequency: 'Frequency',
    frequencies: {
      once: 'Once',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
    },
    success: 'Reminder created successfully!',
    createAnother: 'Create Another Reminder',
    error: 'Error creating reminder',
  },
  form: {
    title: 'Fill Form',
    requiredFields: 'Please fill all required fields',
    success: 'Form submitted successfully!',
    fillAnother: 'Fill Another Form',
    error: 'Error submitting form',
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      he: {
        translation: translationsHE,
      },
      en: {
        translation: translationsEN,
      },
    },
    lng: 'he', // Default language
    fallbackLng: 'he',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
