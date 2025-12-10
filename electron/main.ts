import * as electron from "electron";
import * as path from "path";

let mainWindow: electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1350,
    height: 750,
    frame: false,
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 15, y: 10 },

    // Native Blur Effects (Required for Desktop Blur)
    vibrancy: "under-window", // macOS
    visualEffectState: "followWindow", // MacOS: followWindow handles Genie animation better than 'active'
    backgroundMaterial: "acrylic", // Windows 11 Acrylic
    hasShadow: true,

    transparent: true,
    backgroundColor: "#00000000", // Transparent hex
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true, // Enable <webview> tag
      zoomFactor: 1.0
    },
  });

  const startUrl =
    process.env.ELECTRON_START_URL ||
    `file://${path.join(__dirname, "../out/index.html")}`;

  mainWindow.loadURL(startUrl);

  // Comprehensive Context Menu (Right Click)
  mainWindow.webContents.on('context-menu', (e, props) => {
    const { selectionText, isEditable } = props;
    const template: electron.MenuItemConstructorOptions[] = [
      { label: 'Cortar', role: 'cut', enabled: isEditable },
      { label: 'Copiar', role: 'copy', enabled: isEditable || selectionText.length > 0 },
      { label: 'Pegar', role: 'paste', enabled: isEditable },
      { type: 'separator' },
      { label: 'Seleccionar todo', role: 'selectAll' },
    ];
    if (mainWindow) {
      electron.Menu.buildFromTemplate(template).popup({ window: mainWindow });
    }
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.setZoomFactor(1.0);
  });

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

electron.app.whenReady().then(() => {
  createWindow();

  // Handle permissions for integrations (Camera, Mic, Notifications, Screen Share, etc.)
  electron.session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowedPermissions = [
      'media', 'geolocation', 'notifications', 'midi',
      'clipboard-read', 'clipboard-write', 'fullscreen',
      'display-capture', 'pointer-lock', 'background-sync'
    ];
    callback(allowedPermissions.includes(permission));
  });

  electron.app.on('web-contents-created', (event, contents) => {
    // Set default zoom to 90% for webviews
    if (contents.getType() === 'webview') {
      contents.setZoomFactor(0.9);
      contents.on('did-finish-load', () => {
        contents.setZoomFactor(0.9);
      });
    }

    // Enable spellcheck (it should be on by default in webprefs, but good to ensure here if possible)

    contents.on('context-menu', (e, props) => {
      const { selectionText, isEditable, dictionarySuggestions } = props;
      const hasText = selectionText.length > 0;

      const template: electron.MenuItemConstructorOptions[] = [];

      // 0. Spellcheck Suggestions (Top Priority)
      if (dictionarySuggestions && dictionarySuggestions.length > 0) {
        dictionarySuggestions.forEach((suggestion) => {
          template.push({
            label: suggestion,
            click: () => contents.replaceMisspelling(suggestion),
          });
        });
        template.push({ type: 'separator' });
      }

      // 1. History (Undo/Redo) - Explicitly requested
      template.push(
        { label: 'Deshacer', role: 'undo', enabled: isEditable },
        { label: 'Rehacer', role: 'redo', enabled: isEditable },
        { type: 'separator' }
      );

      // 2. Editing (Cut/Copy/Paste/Delete) - Explicitly requested
      template.push(
        { label: 'Cortar', role: 'cut', enabled: isEditable },
        { label: 'Copiar', role: 'copy', enabled: hasText || isEditable },
        { label: 'Pegar', role: 'paste', enabled: isEditable },
        { label: 'Eliminar', role: 'delete', enabled: isEditable },
        { label: 'Seleccionar todo', role: 'selectAll' },
        { type: 'separator' }
      );

      // 3. AVI & Smart Features (Requested)
      template.push({
        label: 'Preguntar AVI',
        submenu: [
          { label: '🧠 Explicar esto', enabled: hasText, click: () => console.log('AVI Explain:', selectionText) },
          { label: '📝 Resumir', enabled: hasText, click: () => console.log('AVI Summarize:', selectionText) },
          { label: '🌐 Traducir', enabled: hasText, click: () => console.log('AVI Translate:', selectionText) },
        ]
      });

      // 4. Autofill (Requested)
      template.push({
        label: 'Autorrelleno',
        submenu: [
          {
            label: 'Añadir al diccionario',
            enabled: hasText,
            click: () => contents.session.addWordToSpellCheckerDictionary(selectionText),
          },
          { type: 'separator' },
          {
            label: 'Generar Contraseña Segura',
            click: () => {
              const password = Array(16).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*")
                .map(x => x[Math.floor(Math.random() * x.length)]).join('');

              // Try to insert if editable, otherwise copy
              if (isEditable) {
                contents.insertText(password);
              } else {
                electron.clipboard.writeText(password);
              }
            }
          }
        ]
      });

      // 5. Speech / Read Selection (Requested "leer seleccion")
      template.push({ type: 'separator' });
      template.push({
        label: 'Leer selección',
        role: 'startSpeaking',
        enabled: hasText
      });
      template.push({
        label: 'Detener lectura',
        role: 'stopSpeaking',
        visible: false // Usually hidden unless speaking, but Electron rules might vary
      });


      // 6. Navigation (Webview Extra)
      if (contents.getType() === 'webview') {
        template.push({ type: 'separator' });
        template.push(
          { label: 'Atrás', click: () => contents.goBack(), enabled: contents.canGoBack() },
          { label: 'Adelante', click: () => contents.goForward(), enabled: contents.canGoForward() },
          { label: 'Recargar', click: () => contents.reload() }
        );
      }

      // 7. Dev Tools (Bottom)
      template.push({ type: 'separator' });
      template.push({
        label: 'Inspeccionar',
        click: () => contents.inspectElement(props.x, props.y)
      });

      if (mainWindow) {
        electron.Menu.buildFromTemplate(template).popup({ window: mainWindow });
      }
    });

    // Handle Window Open (Popups) - Redirect to Default Browser or Handle internally
    contents.setWindowOpenHandler(({ url }) => {
      // Allow popups if they are oauth or related, but verify security
      // For now, allow external opening for safety
      if (url.startsWith('http')) {
        electron.shell.openExternal(url);
      }
      return { action: 'deny' };
    });
  });

  electron.app.on('activate', function () {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

electron.app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});

// IPC Handlers
electron.ipcMain.handle('dialog:openFile', async () => {
  if (!mainWindow) return null;
  const result = await electron.dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Documentos', extensions: ['pdf', 'doc', 'docx', 'jpg', 'png', 'txt'] }]
  });
  return result;
});

electron.ipcMain.handle('fs:readFile', async (_, filePath: string) => {
  const fs = require('fs/promises');
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
});

electron.ipcMain.handle('notification:show', (_, { title, body }) => {
  if (electron.Notification.isSupported()) {
    new electron.Notification({ title, body }).show();
    return true;
  }
  return false;
});

