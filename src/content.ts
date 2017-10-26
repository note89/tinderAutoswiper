//const element =  document.querySelector('button[aria-label="Like"]')
//const element1 = document.getElementsByClassName("recsGamepad__button--like")[0]

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.log("message recived ", request.payload)
  });
