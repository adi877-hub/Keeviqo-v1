export function generateSmartFeatureHtml(featureName) {
  let icon, title, description, content;
  
  switch(featureName) {
    case 'KeeviAI':
      icon = 'smart_toy';
      title = 'KeeviAI - עוזר אישי חכם';
      description = 'עוזר אישי חכם המבוסס על בינה מלאכותית';
      content = `
        <div class="chat-interface">
          <div class="chat-messages" id="chatMessages">
            <div class="chat-message system">
              <div class="message-content">
                <p>שלום! אני KeeviAI, העוזר האישי החכם שלך. כיצד אוכל לעזור לך היום?</p>
              </div>
            </div>
          </div>
          <div class="chat-input-container">
            <input type="text" id="chatInput" class="chat-input" placeholder="הקלד את שאלתך כאן...">
            <button id="sendMessageButton" class="chat-send-button">
              <span class="material-icons">send</span>
            </button>
          </div>
        </div>
      `;
      break;
      
    case 'KeeviScan':
      icon = 'document_scanner';
      title = 'KeeviScan - סריקה חכמה';
      description = 'סריקה וזיהוי אוטומטי של מסמכים';
      content = `
        <div class="scan-interface">
          <div class="scan-area" id="scanArea">
            <div class="scan-icon">
              <span class="material-icons">document_scanner</span>
            </div>
            <div class="scan-text">גרור מסמך לכאן או לחץ לבחירת קובץ לסריקה</div>
            <div class="scan-subtext">ניתן לסרוק מסמכים מסוג PDF, JPG, PNG</div>
            <input type="file" id="scanInput" style="display: none;" accept="image/*,.pdf">
          </div>
        </div>
      `;
      break;
      
    case 'KeeviRemind':
      icon = 'notifications_active';
      title = 'KeeviRemind - תזכורות חכמות';
      description = 'תזכורות חכמות ומותאמות אישית';
      content = `
        <div class="reminders-interface">
          <div class="reminders-header">
            <h3 class="reminders-title">התזכורות שלי</h3>
            <button class="add-reminder-button" id="addReminderButton">
              <span class="material-icons">add</span>
              <span>תזכורת חדשה</span>
            </button>
          </div>
          <div class="reminders-list" id="remindersList"></div>
        </div>
      `;
      break;
      
    case 'KeeviMap':
      icon = 'map';
      title = 'KeeviMap - מיפוי חכם';
      description = 'מיפוי חכם של המידע האישי שלך';
      content = `
        <div class="map-interface">
          <div class="map-visualization" id="mapVisualization">
            <div class="map-center">
              <div class="map-node main-node">
                <span class="material-icons">person</span>
                <span>המידע שלי</span>
              </div>
            </div>
          </div>
        </div>
      `;
      break;
      
    case 'KeeviShare':
      icon = 'share';
      title = 'KeeviShare - שיתוף מאובטח';
      description = 'שיתוף מאובטח של מידע עם אחרים';
      content = `
        <div class="share-interface">
          <div class="share-options">
            <h3 class="options-title">אפשרויות שיתוף</h3>
            <div class="share-option-group">
              <h4 class="option-group-title">בחר מידע לשיתוף</h4>
              <div class="option-items">
                <label class="option-item">
                  <input type="checkbox" name="shareItem" value="medical">
                  <span class="option-icon"><span class="material-icons">health_and_safety</span></span>
                  <span class="option-text">מידע רפואי</span>
                </label>
                <label class="option-item">
                  <input type="checkbox" name="shareItem" value="financial">
                  <span class="option-icon"><span class="material-icons">account_balance</span></span>
                  <span class="option-text">מידע פיננסי</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      `;
      break;
      
    default:
      icon = 'star';
      title = 'פיצ\'ר חכם';
      description = 'פיצ\'ר חכם של Keeviqo';
      content = `
        <div class="feature-not-found">
          <div class="not-found-icon">
            <span class="material-icons">help_outline</span>
          </div>
          <h3 class="not-found-title">הפיצ'ר המבוקש אינו זמין</h3>
          <p class="not-found-message">הפיצ'ר "${featureName}" אינו קיים או אינו זמין כרגע.</p>
        </div>
      `;
  }
  
  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keeviqo - ${title}</title>
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
    
    .smart-feature-header {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 20px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }
    
    .smart-feature-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #e3f2fd;
      color: #1976D2;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 20px;
      font-size: 30px;
    }
    
    .smart-feature-details {
      flex: 1;
    }
    
    .smart-feature-title {
      font-size: 24px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 10px;
      color: #1976D2;
    }
    
    .smart-feature-description {
      font-size: 16px;
      color: #666;
      margin: 0;
      line-height: 1.5;
    }
    
    .smart-feature-content {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 20px;
      margin-bottom: 30px;
    }
    
    /* Chat Interface Styles */
    .chat-interface {
      display: flex;
      flex-direction: column;
      height: 500px;
    }
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    
    .chat-message {
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
    }
    
    .chat-message.user {
      align-items: flex-end;
    }
    
    .chat-message.system {
      align-items: flex-start;
    }
    
    .message-content {
      max-width: 80%;
      padding: 10px 15px;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    
    .chat-message.user .message-content {
      background-color: #e3f2fd;
      color: #0d47a1;
    }
    
    .chat-message.system .message-content {
      background-color: white;
      color: #333;
    }
    
    .message-content p {
      margin: 0;
    }
    
    .chat-input-container {
      display: flex;
      align-items: center;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 5px;
    }
    
    .chat-input {
      flex: 1;
      border: none;
      padding: 10px;
      font-family: 'Rubik', sans-serif;
      font-size: 16px;
      outline: none;
    }
    
    .chat-send-button {
      background-color: #1976D2;
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    
    /* Scan Interface Styles */
    .scan-interface {
      display: flex;
      flex-direction: column;
    }
    
    .scan-area {
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      margin-bottom: 20px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .scan-area:hover {
      background-color: #f9f9f9;
    }
    
    .scan-icon {
      font-size: 48px;
      color: #1976D2;
      margin-bottom: 15px;
    }
    
    .scan-text {
      font-size: 18px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .scan-subtext {
      font-size: 14px;
      color: #999;
    }
    
    /* Reminders Interface Styles */
    .reminders-interface {
      display: flex;
      flex-direction: column;
    }
    
    .reminders-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .reminders-title {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
      color: #333;
    }
    
    .add-reminder-button {
      display: inline-flex;
      align-items: center;
      background-color: #1976D2;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 15px;
      cursor: pointer;
      font-family: 'Rubik', sans-serif;
    }
    
    .add-reminder-button .material-icons {
      margin-left: 5px;
    }
    
    .reminders-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    /* Map Interface Styles */
    .map-interface {
      display: flex;
      flex-direction: column;
    }
    
    .map-visualization {
      height: 500px;
      background-color: #f9f9f9;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    
    .map-center {
      position: relative;
    }
    
    .map-node {
      background-color: white;
      border-radius: 50%;
      width: 100px;
      height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      position: absolute;
      z-index: 2;
    }
    
    .map-node.main-node {
      position: relative;
      background-color: #e3f2fd;
      border: 2px solid #1976D2;
      z-index: 3;
    }
    
    .map-node .material-icons {
      font-size: 36px;
      color: #1976D2;
      margin-bottom: 5px;
    }
    
    /* Share Interface Styles */
    .share-interface {
      display: flex;
      flex-direction: column;
    }
    
    .share-options {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
    }
    
    .options-title {
      font-size: 20px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 20px;
      color: #333;
    }
    
    .share-option-group {
      margin-bottom: 25px;
    }
    
    .option-group-title {
      font-size: 16px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 15px;
      color: #333;
    }
    
    .option-items {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 10px;
    }
    
    .option-item {
      display: flex;
      align-items: center;
      padding: 10px;
      border-radius: 8px;
      background-color: white;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .option-item:hover {
      background-color: #f0f7ff;
    }
    
    .option-item input[type="checkbox"] {
      margin-left: 10px;
    }
    
    .option-icon {
      margin-left: 10px;
      color: #1976D2;
    }
    
    .option-text {
      font-size: 14px;
      color: #333;
    }
    
    /* Feature Not Found Styles */
    .feature-not-found {
      text-align: center;
      padding: 40px 0;
    }
    
    .not-found-icon {
      font-size: 64px;
      color: #ccc;
      margin-bottom: 20px;
    }
    
    .not-found-title {
      font-size: 24px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 10px;
      color: #333;
    }
    
    .not-found-message {
      font-size: 16px;
      color: #666;
      margin: 0;
    }
  </style>
</head>
<body>
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
    <div class="smart-feature-header">
      <div class="smart-feature-icon">
        <span class="material-icons">${icon}</span>
      </div>
      <div class="smart-feature-details">
        <h1 class="smart-feature-title">${title}</h1>
        <p class="smart-feature-description">${description}</p>
      </div>
    </div>
    
    <div class="smart-feature-content">
      ${content}
    </div>
  </div>
  
  <script>
    if (document.getElementById('chatInput') && document.getElementById('sendMessageButton')) {
      const chatInput = document.getElementById('chatInput');
      const sendMessageButton = document.getElementById('sendMessageButton');
      const chatMessages = document.getElementById('chatMessages');
      
      function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message ' + (isUser ? 'user' : 'system');
        messageDiv.innerHTML = \`
          <div class="message-content">
            <p>\${message}</p>
          </div>
        \`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
      
      sendMessageButton.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
          addMessage(message, true);
          chatInput.value = '';
          
          setTimeout(() => {
            addMessage('אני מבין את השאלה שלך. אני אעזור לך למצוא את המידע הרלוונטי.');
          }, 1000);
        }
      });
      
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          sendMessageButton.click();
        }
      });
    }
    
    if (document.getElementById('scanArea') && document.getElementById('scanInput')) {
      const scanArea = document.getElementById('scanArea');
      const scanInput = document.getElementById('scanInput');
      
      scanArea.addEventListener('click', () => {
        scanInput.click();
      });
      
      scanArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        scanArea.style.backgroundColor = '#f0f7ff';
      });
      
      scanArea.addEventListener('dragleave', () => {
        scanArea.style.backgroundColor = '';
      });
      
      scanArea.addEventListener('drop', (e) => {
        e.preventDefault();
        scanArea.style.backgroundColor = '';
        
        if (e.dataTransfer.files.length > 0) {
          handleFiles(e.dataTransfer.files);
        }
      });
      
      scanInput.addEventListener('change', () => {
        if (scanInput.files.length > 0) {
          handleFiles(scanInput.files);
        }
      });
      
      function handleFiles(files) {
        for (let file of files) {
          setTimeout(() => {
            alert('המסמך נסרק בהצלחה: ' + file.name);
          }, 1500);
        }
      }
    }
    
    if (document.getElementById('addReminderButton') && document.getElementById('remindersList')) {
      const addReminderButton = document.getElementById('addReminderButton');
      const remindersList = document.getElementById('remindersList');
      
      addReminderButton.addEventListener('click', () => {
        const title = prompt('כותרת התזכורת:');
        if (title) {
          const date = prompt('תאריך התזכורת (DD/MM/YYYY):');
          if (date) {
            const reminderDiv = document.createElement('div');
            reminderDiv.className = 'reminder-item';
            reminderDiv.innerHTML = \`
              <div class="reminder-icon">
                <span class="material-icons">event</span>
              </div>
              <div class="reminder-details">
                <h4 class="reminder-title">\${title}</h4>
                <p class="reminder-date">\${date}</p>
              </div>
              <div class="reminder-actions">
                <button class="reminder-action-button edit">
                  <span class="material-icons">edit</span>
                </button>
                <button class="reminder-action-button delete">
                  <span class="material-icons">delete</span>
                </button>
              </div>
            \`;
            remindersList.appendChild(reminderDiv);
          }
        }
      });
    }
    
    if (document.getElementById('mapVisualization')) {
      const mapVisualization = document.getElementById('mapVisualization');
      
      setTimeout(() => {
        const categories = [
          { name: 'בריאות', icon: 'health_and_safety', angle: 0 },
          { name: 'פיננסים', icon: 'account_balance', angle: 72 },
          { name: 'חינוך', icon: 'school', angle: 144 },
          { name: 'נדל"ן', icon: 'home', angle: 216 },
          { name: 'קריירה', icon: 'work', angle: 288 }
        ];
        
        const connections = document.createElement('div');
        connections.className = 'map-connections';
        
        categories.forEach(category => {
          const connection = document.createElement('div');
          connection.className = 'map-connection';
          connection.style.transform = \`rotate(\${category.angle}deg)\`;
          
          const node = document.createElement('div');
          node.className = 'map-node category-node';
          node.style.left = '150px';
          node.style.top = '-80px';
          node.innerHTML = \`
            <span class="material-icons">\${category.icon}</span>
            <span>\${category.name}</span>
          \`;
          
          connection.appendChild(node);
          connections.appendChild(connection);
        });
        
        mapVisualization.querySelector('.map-center').appendChild(connections);
      }, 500);
    }
    
    if (document.querySelector('.share-interface')) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          const checkedItems = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
          
          if (checkedItems.length > 0) {
            console.log('Selected items for sharing:', checkedItems);
          }
        });
      });
    }
  </script>
</body>
</html>`;
}
