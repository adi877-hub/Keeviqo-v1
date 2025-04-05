function generateFeatureHtml(category, subcategory, feature) {
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keeviqo - ${feature.label}</title>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Rubik', sans-serif;
      direction: rtl;
      text-align: right;
      background-color: #f5f7fa;
      color: #333;
      margin: 0;
      padding: 0;
    }
    
    header {
      background-color: #1976D2;
      color: white;
      padding: 15px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .logo {
      font-size: 24px;
      font-weight: bold;
      display: flex;
      align-items: center;
    }
    
    .logo .material-icons {
      margin-left: 10px;
    }
    
    .user-menu {
      display: flex;
      align-items: center;
    }
    
    .user-menu .material-icons {
      margin-left: 15px;
      cursor: pointer;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .back-button {
      display: inline-flex;
      align-items: center;
      background-color: #f0f0f0;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      margin-bottom: 20px;
      cursor: pointer;
      font-family: 'Rubik', sans-serif;
    }
    
    .back-button .material-icons {
      margin-left: 8px;
    }
    
    .breadcrumbs {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      font-size: 14px;
      color: #666;
    }
    
    .breadcrumbs .material-icons {
      font-size: 16px;
      margin: 0 5px;
    }
    
    .breadcrumbs a {
      color: #1976D2;
      text-decoration: none;
    }
    
    .breadcrumbs a:hover {
      text-decoration: underline;
    }
    
    .feature-header {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 20px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }
    
    .feature-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 20px;
      font-size: 30px;
    }
    
    .feature-icon.upload { background-color: #e3f2fd; color: #1976D2; }
    .feature-icon.reminder { background-color: #e8f5e9; color: #388E3C; }
    .feature-icon.external_link { background-color: #f3e5f5; color: #7B1FA2; }
    .feature-icon.form { background-color: #fff3e0; color: #F57C00; }
    
    .feature-details {
      flex: 1;
    }
    
    .feature-title {
      font-size: 24px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 10px;
      color: #1976D2;
    }
    
    .feature-description {
      font-size: 16px;
      color: #666;
      margin: 0;
      line-height: 1.5;
    }
    
    .feature-content {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 20px;
      margin-bottom: 30px;
    }
    
    .feature-section-title {
      font-size: 20px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 20px;
      color: #333;
    }
    
    .upload-area {
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      margin-bottom: 20px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .upload-area:hover {
      background-color: #f9f9f9;
    }
    
    .upload-icon {
      font-size: 48px;
      color: #1976D2;
      margin-bottom: 15px;
    }
    
    .upload-text {
      font-size: 18px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .upload-subtext {
      font-size: 14px;
      color: #999;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-label {
      display: block;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .form-input {
      width: 100%;
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: 'Rubik', sans-serif;
      font-size: 16px;
    }
    
    .form-textarea {
      width: 100%;
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: 'Rubik', sans-serif;
      font-size: 16px;
      min-height: 120px;
      resize: vertical;
    }
    
    .form-select {
      width: 100%;
      padding: 10px 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: 'Rubik', sans-serif;
      font-size: 16px;
      background-color: white;
    }
    
    .form-button {
      display: inline-flex;
      align-items: center;
      background-color: #1976D2;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 10px 20px;
      font-family: 'Rubik', sans-serif;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .form-button:hover {
      background-color: #1565C0;
    }
    
    .form-button .material-icons {
      margin-left: 8px;
    }
    
    .reminder-date-time {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .reminder-date-time > div {
      flex: 1;
    }
    
    .reminder-frequency {
      margin-bottom: 20px;
    }
    
    .reminder-frequency-options {
      display: flex;
      gap: 15px;
      margin-top: 10px;
    }
    
    .reminder-frequency-option {
      flex: 1;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .reminder-frequency-option:hover {
      background-color: #f5f7fa;
    }
    
    .reminder-frequency-option.active {
      border-color: #1976D2;
      background-color: #e3f2fd;
    }
    
    .reminder-frequency-option .material-icons {
      font-size: 24px;
      margin-bottom: 8px;
      color: #1976D2;
    }
    
    .external-links-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .external-link-item {
      display: flex;
      align-items: center;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      margin-bottom: 15px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .external-link-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .external-link-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #f3e5f5;
      color: #7B1FA2;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 15px;
    }
    
    .external-link-details {
      flex: 1;
    }
    
    .external-link-title {
      font-size: 16px;
      font-weight: 700;
      margin: 0 0 5px;
    }
    
    .external-link-description {
      font-size: 14px;
      color: #666;
      margin: 0;
    }
    
    .external-link-button {
      background-color: #7B1FA2;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 15px;
      font-family: 'Rubik', sans-serif;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    
    .external-link-button .material-icons {
      margin-left: 5px;
      font-size: 16px;
    }
    
    .loading-indicator {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    }
    
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #1976D2;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loading-indicator" id="loadingIndicator">
    <div class="loading-spinner"></div>
  </div>

  <header>
    <div class="header-content">
      <div class="logo">
        <span class="material-icons">dashboard</span>
        <span>Keeviqo</span>
      </div>
      <div class="user-menu">
        <span class="material-icons">notifications</span>
        <span class="material-icons">account_circle</span>
      </div>
    </div>
  </header>
  
  <div class="container">
    <div class="breadcrumbs">
      <a href="/" onclick="navigateToHome(); return false;">דאשבורד</a>
      <span class="material-icons">chevron_left</span>
      <a href="/category/${category.id}" onclick="navigateToCategory(${category.id}); return false;">${category.name}</a>
      <span class="material-icons">chevron_left</span>
      <a href="/subcategory/${category.id}/${subcategory.id}" onclick="navigateToSubcategory(${category.id}, ${subcategory.id}); return false;">${subcategory.name}</a>
      <span class="material-icons">chevron_left</span>
      <span>${feature.label}</span>
    </div>
    
    <div class="feature-header">
      <div class="feature-icon ${feature.type}">
        <span class="material-icons">${getFeatureIcon(feature.type)}</span>
      </div>
      <div class="feature-details">
        <h1 class="feature-title">${feature.label}</h1>
        <p class="feature-description">${getFeatureDescription(feature.type, category.name, subcategory.name)}</p>
      </div>
    </div>
    
    <div class="feature-content">
      ${generateFeatureContent(feature, category, subcategory)}
    </div>
  </div>
  
  <script>
    function showLoading() {
      document.getElementById('loadingIndicator').style.display = 'flex';
    }
    
    function hideLoading() {
      document.getElementById('loadingIndicator').style.display = 'none';
    }
    
    function navigateToHome() {
      showLoading();
      window.location.href = '/';
    }
    
    function navigateToCategory(categoryId) {
      showLoading();
      window.location.href = '/category/' + categoryId;
    }
    
    function navigateToSubcategory(categoryId, subcategoryId) {
      showLoading();
      window.location.href = '/subcategory/' + categoryId + '/' + subcategoryId;
    }
    
    document.addEventListener('DOMContentLoaded', function() {
      hideLoading();
      
      ${generateFeatureScript(feature)}
    });
  </script>
</body>
</html>`;
}

function generateFeatureContent(feature, category, subcategory) {
  switch(feature.type) {
    case 'upload':
      return `
        <h2 class="feature-section-title">העלאת מסמכים</h2>
        
        <div class="upload-area" id="uploadArea">
          <div class="upload-icon">
            <span class="material-icons">cloud_upload</span>
          </div>
          <div class="upload-text">גרור קבצים לכאן או לחץ לבחירת קבצים</div>
          <div class="upload-subtext">ניתן להעלות קבצים מסוג PDF, DOCX, XLSX, JPG, PNG</div>
          <input type="file" id="fileInput" style="display: none;" multiple>
        </div>
        
        <div class="form-group">
          <button class="form-button" id="uploadButton">
            <span class="material-icons">upload_file</span>
            העלאת מסמכים
          </button>
        </div>
      `;
    
    case 'reminder':
      return `
        <h2 class="feature-section-title">הגדרת תזכורת</h2>
        
        <div class="form-group">
          <label class="form-label">כותרת התזכורת</label>
          <input type="text" class="form-input" id="reminderTitle" placeholder="הזן כותרת לתזכורת">
        </div>
        
        <div class="form-group">
          <label class="form-label">תיאור</label>
          <textarea class="form-textarea" id="reminderDescription" placeholder="הזן תיאור מפורט לתזכורת"></textarea>
        </div>
        
        <div class="reminder-date-time">
          <div class="form-group">
            <label class="form-label">תאריך</label>
            <input type="date" class="form-input" id="reminderDate">
          </div>
          
          <div class="form-group">
            <label class="form-label">שעה</label>
            <input type="time" class="form-input" id="reminderTime">
          </div>
        </div>
        
        <div class="reminder-frequency">
          <label class="form-label">תדירות</label>
          <div class="reminder-frequency-options">
            <div class="reminder-frequency-option" data-frequency="once">
              <span class="material-icons">looks_one</span>
              <div>חד פעמי</div>
            </div>
            <div class="reminder-frequency-option" data-frequency="daily">
              <span class="material-icons">today</span>
              <div>יומי</div>
            </div>
            <div class="reminder-frequency-option" data-frequency="weekly">
              <span class="material-icons">view_week</span>
              <div>שבועי</div>
            </div>
            <div class="reminder-frequency-option" data-frequency="monthly">
              <span class="material-icons">calendar_month</span>
              <div>חודשי</div>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <button class="form-button" id="saveReminderButton">
            <span class="material-icons">notifications_active</span>
            שמירת תזכורת
          </button>
        </div>
      `;
    
    case 'external_link':
      return `
        <h2 class="feature-section-title">קישורים חיצוניים</h2>
        
        <ul class="external-links-list">
          ${feature.links ? feature.links.map(link => `
            <li class="external-link-item">
              <div class="external-link-icon">
                <span class="material-icons">link</span>
              </div>
              <div class="external-link-details">
                <h3 class="external-link-title">${link.title || 'קישור חיצוני'}</h3>
                <p class="external-link-description">${link.description || 'אתר חיצוני הקשור ל' + subcategory.name + ' ב' + category.name}</p>
              </div>
              <a href="${link.url}" target="_blank" class="external-link-button">
                <span class="material-icons">open_in_new</span>
                פתיחה
              </a>
            </li>
          `).join('') : `
            <li class="external-link-item">
              <div class="external-link-icon">
                <span class="material-icons">link</span>
              </div>
              <div class="external-link-details">
                <h3 class="external-link-title">${feature.label || 'קישור חיצוני'}</h3>
                <p class="external-link-description">אתר חיצוני הקשור ל${subcategory.name} ב${category.name}</p>
              </div>
              <a href="${feature.url || '#'}" target="_blank" class="external-link-button">
                <span class="material-icons">open_in_new</span>
                פתיחה
              </a>
            </li>
          `}
        </ul>
      `;
    
    case 'form':
      return `
        <h2 class="feature-section-title">מילוי טופס</h2>
        
        <div class="form-group">
          <label class="form-label">שם מלא</label>
          <input type="text" class="form-input" id="fullName" placeholder="הזן שם מלא">
        </div>
        
        <div class="form-group">
          <label class="form-label">מספר זהות</label>
          <input type="text" class="form-input" id="idNumber" placeholder="הזן מספר זהות">
        </div>
        
        <div class="form-group">
          <label class="form-label">כתובת</label>
          <input type="text" class="form-input" id="address" placeholder="הזן כתובת מלאה">
        </div>
        
        <div class="form-group">
          <label class="form-label">טלפון</label>
          <input type="tel" class="form-input" id="phone" placeholder="הזן מספר טלפון">
        </div>
        
        <div class="form-group">
          <label class="form-label">דואר אלקטרוני</label>
          <input type="email" class="form-input" id="email" placeholder="הזן כתובת דואר אלקטרוני">
        </div>
        
        <div class="form-group">
          <label class="form-label">הערות נוספות</label>
          <textarea class="form-textarea" id="notes" placeholder="הזן הערות נוספות"></textarea>
        </div>
        
        <div class="form-group">
          <button class="form-button" id="submitFormButton">
            <span class="material-icons">send</span>
            שליחת הטופס
          </button>
        </div>
      `;
    
    default:
      return `
        <h2 class="feature-section-title">פעולה לא זמינה</h2>
        <p>הפיצ'ר הזה עדיין לא זמין. אנא נסה שוב מאוחר יותר.</p>
      `;
  }
}

function generateFeatureScript(feature) {
  switch(feature.type) {
    case 'upload':
      return `
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const uploadButton = document.getElementById('uploadButton');
        
        uploadArea.addEventListener('click', () => {
          fileInput.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
          e.preventDefault();
          uploadArea.style.backgroundColor = '#f0f7ff';
        });
        
        uploadArea.addEventListener('dragleave', () => {
          uploadArea.style.backgroundColor = '';
        });
        
        uploadArea.addEventListener('drop', (e) => {
          e.preventDefault();
          uploadArea.style.backgroundColor = '';
          
          if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
          }
        });
        
        fileInput.addEventListener('change', () => {
          if (fileInput.files.length > 0) {
            handleFiles(fileInput.files);
          }
        });
        
        uploadButton.addEventListener('click', () => {
          fileInput.click();
        });
        
        function handleFiles(files) {
          alert('נבחרו ' + files.length + ' קבצים להעלאה. בגרסה זו, ההעלאה היא לצורך הדגמה בלבד.');
        }
      `;
    
    case 'reminder':
      return `
        const reminderTitle = document.getElementById('reminderTitle');
        const reminderDescription = document.getElementById('reminderDescription');
        const reminderDate = document.getElementById('reminderDate');
        const reminderTime = document.getElementById('reminderTime');
        const saveReminderButton = document.getElementById('saveReminderButton');
        const frequencyOptions = document.querySelectorAll('.reminder-frequency-option');
        
        let selectedFrequency = 'once';
        
        const today = new Date();
        reminderDate.value = today.toISOString().split('T')[0];
        
        const nextHour = new Date(today.getTime() + 60 * 60 * 1000);
        reminderTime.value = nextHour.getHours().toString().padStart(2, '0') + ':' + 
                            nextHour.getMinutes().toString().padStart(2, '0');
        
        frequencyOptions.forEach(option => {
          option.addEventListener('click', () => {
            frequencyOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedFrequency = option.dataset.frequency;
          });
        });
        
        document.querySelector('[data-frequency="once"]').classList.add('active');
        
        saveReminderButton.addEventListener('click', () => {
          if (!reminderTitle.value) {
            alert('אנא הזן כותרת לתזכורת');
            return;
          }
          
          if (!reminderDate.value) {
            alert('אנא בחר תאריך לתזכורת');
            return;
          }
          
          if (!reminderTime.value) {
            alert('אנא בחר שעה לתזכורת');
            return;
          }
          
          alert('התזכורת נשמרה בהצלחה! בגרסה זו, השמירה היא לצורך הדגמה בלבד.');
        });
      `;
    
    case 'external_link':
      return `
        const externalLinks = document.querySelectorAll('.external-link-button');
        
        externalLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            console.log('External link clicked:', link.href);
          });
        });
      `;
    
    case 'form':
      return `
        const submitFormButton = document.getElementById('submitFormButton');
        const fullName = document.getElementById('fullName');
        const idNumber = document.getElementById('idNumber');
        const email = document.getElementById('email');
        
        submitFormButton.addEventListener('click', () => {
          if (!fullName.value) {
            alert('אנא הזן שם מלא');
            return;
          }
          
          if (!idNumber.value) {
            alert('אנא הזן מספר זהות');
            return;
          }
          
          if (!email.value) {
            alert('אנא הזן כתובת דואר אלקטרוני');
            return;
          }
          
          alert('הטופס נשלח בהצלחה! בגרסה זו, השליחה היא לצורך הדגמה בלבד.');
        });
      `;
    
    default:
      return '';
  }
}
