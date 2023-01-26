function submitToAPI(e) {
  e.preventDefault();
  let URL =
    "https://f1lf9h7iv4.execute-api.ap-southeast-2.amazonaws.com/v1/contact-me";

  let name = document.getElementById("contact-name");
  let email = document.getElementById("contact-email");
  let msg = document.getElementById("contact-message");

  let Namere = /[A-Za-z]{2}/;
  if (!Namere.test(name.value)) {
    name.focus();
    name.setCustomValidity("Please enter more than 2 characters for your name");
    name.reportValidity();
    return;
  }

  if (!email.value) {
    email.focus();
    email.setCustomValidity("Please enter your email");
    email.reportValidity();
    return;
  }

  let reeamil = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,6})?$/;
  if (!reeamil.test(email.value)) {
    email.focus();
    email.setCustomValidity("Please enter a valid email e.g. example@mail.com");
    email.reportValidity();
    return;
  }

  if (!msg.value) {
    msg.focus();
    msg.setCustomValidity("Please enter your message");
    msg.reportValidity();
    return;
  }

  let data = {
    name: name.value,
    email: email.value,
    message: msg.value,
  };

  console.log(data);

  fetch(URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Origin: "csphotography.chris-sa.com",
    },
  })
    .then((response) => {
      console.log(response);
      document.getElementById("success_toast").style.display = "block";
      document.getElementById("contact-form").reset();
      timeout("success_toast");
    })
    .catch((error) => {
      document.getElementById("fail_toast").style.display = "block";
      timeout("fail_toast");
    });
}

function timeout(element) {
  setTimeout(function () {
      document.getElementById(element).style.display = "none";
  }, 2000);
}