let getMessages = async function() {
  let response = await fetch(new URL("https://gabes-demos.appspot.com/messages"));
  let json = await response.json();
  json.reverse();
  let tmpl = document.querySelector("#tmpl").content;
  let msg = tmpl.querySelector(".message");
  let messages = document.querySelector(".messages");
  let existingMessages = [...messages.querySelectorAll(".message")] || [];
  console.group("messagechecker");
  console.log(existingMessages);
  let i = 0;
  let scroll = false;
  console.log(json);
  while (i < json.length
        && i < existingMessages.length) {
    console.log(`${existingMessages[i].dataset.id} | ${json[i]["id"]}`)
    if (existingMessages[i].dataset.id !== json[i]["id"]) {
      messages.removeChild(existingMessages[i]);
      existingMessages.splice(i, 1);
      console.log("Remove!");
    } else {
      i++;
    }
  }
  while (i < json.length) {
    console.log("Add!");
    msg.innerText = json[i]["message"];
    msg.dataset.id = json[i]["id"];
    messages.append(tmpl.cloneNode(true));
    scroll = true;
    i++;
  }
  if (scroll) {
    messages.scrollTo({top: messages.scrollHeight});
  }
  console.groupEnd("messagechecker")
};

let sendJSON = function(e) {
  e.preventDefault();
  let message = document.querySelector("#message");
  let post = fetch(new URL("https://gabes-demos.appspot.com/message"), {
    method: 'POST',
    mode: "cors",
    headers: {
        'Content-Type': 'application/json',
        'Origin': '*',
    },
    body: `{"message": "${message.value}"}`,
  });

  let tmpl = document.querySelector("#tmpl").content;
  let msg = tmpl.querySelector(".message");
  let messages = document.querySelector(".messages");
  msg.innerText = message.value;
  msg.dataset.id="newelement";
  messages.append(tmpl.cloneNode(true));
  messages.scrollTo({top: messages.scrollHeight});

  message.value = "";
  return false;
};

document.addEventListener("DOMContentLoaded", function(e) {
  getMessages();
  setInterval(getMessages, 2500);
  let submitButton = document.querySelector("#jsonform");
  submitButton.onsubmit = sendJSON;
});
