chrome.action.onClicked.addListener(() => {
  openMainPage();
});

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    await openMainPage();
  }
});

async function openMainPage() {
  const url = chrome.runtime.getURL('main/index.html');
  const curr = await chrome.tabs.query({ active: true, currentWindow: true });
  if (curr.length > 0 && curr[0].url?.startsWith('chrome://new-tab-page')) {
    await chrome.tabs.update(curr[0].id!, { url });
    return;
  }
  await chrome.tabs.create({ url });
}
