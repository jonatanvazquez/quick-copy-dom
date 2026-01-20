(() => {
  // Prevent multiple injections
  if (window.__quickCopyDomInitialized) return;
  window.__quickCopyDomInitialized = true;

  let isActive = false;
  let overlay = null;
  let tooltip = null;
  let currentElement = null;

  // Create the highlight overlay
  function createOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'quick-copy-dom-overlay';
    overlay.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 2147483647;
      border: 2px solid #3b82f6;
      background-color: rgba(59, 130, 246, 0.1);
      transition: all 0.05s ease-out;
      display: none;
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
    `;
    document.body.appendChild(overlay);

    // Create tooltip for element info
    tooltip = document.createElement('div');
    tooltip.id = 'quick-copy-dom-tooltip';
    tooltip.style.cssText = `
      position: fixed;
      z-index: 2147483647;
      background: #1e293b;
      color: #f1f5f9;
      padding: 6px 10px;
      border-radius: 6px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      font-size: 11px;
      pointer-events: none;
      display: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      max-width: 400px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
    document.body.appendChild(tooltip);
  }

  // Show toast notification
  function showToast(message, type = 'success') {
    const existingToast = document.getElementById('quick-copy-dom-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.id = 'quick-copy-dom-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 14px 24px;
      background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      border-radius: 10px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 2147483647;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      animation: quickCopySlideIn 0.3s ease-out;
      display: flex;
      align-items: center;
      gap: 10px;
    `;

    const icon = type === 'success'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';

    toast.innerHTML = `${icon}<span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'quickCopySlideOut 0.3s ease-out forwards';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Get element selector string for tooltip
  function getElementSelector(el) {
    let selector = el.tagName.toLowerCase();

    if (el.id) {
      selector += `#${el.id}`;
    } else if (el.className && typeof el.className === 'string') {
      const classes = el.className.trim().split(/\s+/).slice(0, 2).join('.');
      if (classes) selector += `.${classes}`;
    }

    const dimensions = `${Math.round(el.offsetWidth)}×${Math.round(el.offsetHeight)}`;
    return `${selector} (${dimensions})`;
  }

  // Update overlay position
  function updateOverlay(element) {
    if (!overlay || !element) return;

    const rect = element.getBoundingClientRect();

    overlay.style.display = 'block';
    overlay.style.top = `${rect.top}px`;
    overlay.style.left = `${rect.left}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;

    // Update tooltip
    tooltip.textContent = getElementSelector(element);
    tooltip.style.display = 'block';

    // Position tooltip above or below element
    const tooltipHeight = 30;
    const margin = 8;

    if (rect.top > tooltipHeight + margin) {
      tooltip.style.top = `${rect.top - tooltipHeight - margin}px`;
    } else {
      tooltip.style.top = `${rect.bottom + margin}px`;
    }

    tooltip.style.left = `${Math.max(8, rect.left)}px`;
  }

  // Mouse move handler
  function handleMouseMove(e) {
    if (!isActive) return;

    const element = document.elementFromPoint(e.clientX, e.clientY);

    // Ignore our own elements
    if (!element ||
        element.id === 'quick-copy-dom-overlay' ||
        element.id === 'quick-copy-dom-tooltip' ||
        element.id === 'quick-copy-dom-toast') {
      return;
    }

    currentElement = element;
    updateOverlay(element);
  }

  // Click handler
  function handleClick(e) {
    if (!isActive || !currentElement) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // Copy outerHTML to clipboard
    const html = currentElement.outerHTML;

    navigator.clipboard.writeText(html).then(() => {
      showToast('HTML copied to clipboard!');
    }).catch(err => {
      showToast('Failed to copy', 'error');
      console.error('Quick Copy DOM - Error:', err);
    });

    // Deactivate after copying
    deactivate();

    return false;
  }

  // Escape key handler
  function handleKeyDown(e) {
    if (e.key === 'Escape' && isActive) {
      e.preventDefault();
      deactivate();
      showToast('Selector cancelled', 'error');
    }
  }

  // Activate the selector
  function activate() {
    if (isActive) return;

    isActive = true;

    if (!overlay) {
      createOverlay();
      addStyles();
    }

    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown, true);

    document.body.style.cursor = 'crosshair';
    showToast('Click on any element to copy its HTML');
  }

  // Deactivate the selector
  function deactivate() {
    isActive = false;
    currentElement = null;

    document.removeEventListener('mousemove', handleMouseMove, true);
    document.removeEventListener('click', handleClick, true);
    document.removeEventListener('keydown', handleKeyDown, true);

    if (overlay) {
      overlay.style.display = 'none';
    }
    if (tooltip) {
      tooltip.style.display = 'none';
    }

    document.body.style.cursor = '';
  }

  // Add animation styles
  function addStyles() {
    const style = document.createElement('style');
    style.id = 'quick-copy-dom-styles';
    style.textContent = `
      @keyframes quickCopySlideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes quickCopySlideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Toggle the selector
  function toggle() {
    if (isActive) {
      deactivate();
    } else {
      activate();
    }
  }

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggle') {
      toggle();
      sendResponse({ success: true, isActive });
    }
    return true;
  });
})();
