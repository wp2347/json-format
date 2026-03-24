console.log("Content script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request.action);
  
  if (request.action === "format-json") {
    console.log("Processing format-json request");
    
    const selection = window.getSelection();
    console.log("Selection:", selection);
    console.log("Selected text:", selection ? selection.toString() : "No selection");
    
    if (selection && selection.toString()) {
      try {
        const selectedText = selection.toString();
        console.log("Parsing JSON...");
        const json = JSON.parse(selectedText);
        console.log("JSON parsed successfully");
        
        const formatted = JSON.stringify(json, null, 2);
        console.log("Formatted JSON length:", formatted.length);
        
        const range = selection.getRangeAt(0);
        console.log("Range:", range);
        
        console.log("Replacing text...");
        const textNode = document.createTextNode(formatted);
        range.deleteContents();
        range.insertNode(textNode);
        
        console.log("Text replaced successfully");
        sendResponse({ success: true });
      } catch (error) {
        console.error("JSON parsing error:", error);
        sendResponse({ success: false, error: error.message });
      }
    } else {
      console.log("No text selected");
      sendResponse({ success: false, error: "No text selected" });
    }
  }
  
  return true;
});

console.log("Content script message listener set up");
