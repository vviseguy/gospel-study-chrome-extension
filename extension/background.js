async function getCrossReferencesToHighlight() {
  let highlight = window.getSelection().toString(); // TODO: MAKE THE TEXT CHAT FRIENDLY (remove footnotes)

  alert(await fetch("https://bomproj.vviseguy.click/ask/q/"+highlight)
    .then((response) => response.json())
    .then((response) => response.msg));
}

  
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getCrossReferencesToHighlight
  });
});
