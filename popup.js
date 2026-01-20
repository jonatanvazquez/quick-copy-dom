document.getElementById('toggleBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Inyectar el content script si no está ya inyectado
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  } catch (e) {
    // El script ya está inyectado o hubo un error
    console.log('Script injection:', e.message);
  }

  // Enviar mensaje para activar/desactivar
  chrome.tabs.sendMessage(tab.id, { action: 'toggle' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
      return;
    }
    // Cerrar el popup después de activar
    window.close();
  });
});
