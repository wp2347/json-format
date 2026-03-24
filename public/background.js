chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "format-json",
    title: "Format JSON",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.selectionText) {
    chrome.tabs.sendMessage(tab.id, {
      action: "format-json",
      text: info.selectionText,
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "format-json") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "format-json" });
    });
  }
});
