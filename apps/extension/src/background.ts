chrome.action.onClicked.addListener(async () => {
  const url = chrome.runtime.getURL("popup.html");
  try {
    const tabs = await chrome.tabs.query({ url });
    if (tabs.length > 0 && tabs[0]?.id) {
      await chrome.tabs.update(tabs[0].id, { active: true });
      if (tabs[0].windowId) {
        await chrome.windows.update(tabs[0].windowId, { focused: true });
      }
      return;
    }
  } catch {
    // Abaikan jika query tab gagal, lanjut buat tab baru
  }
  await chrome.tabs.create({ url });
});
