// Manejar el atajo de teclado
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-selector') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab) return;

    // Inyectar el content script si no está ya inyectado
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
    } catch (e) {
      console.log('Script already injected or error:', e.message);
    }

    // Enviar mensaje para toggle
    chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
  }
});
