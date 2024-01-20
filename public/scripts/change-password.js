const passwordInput = document.querySelector("#new-password");
const confirmPasswordInput = document.querySelector("#confirm-password");
const inputs = document.querySelectorAll("input[type='password']");
const error = document.querySelector(".error");
const form = document.querySelector(".info form");
const checkbox = document.querySelector(".checkbox input");
console.log(inputs);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (password.length < 6) {
    const markup = `
        <i class="fa-solid fa-circle-exclamation"></i> Please choose a longer password (at least 6 characters)
        `;
    error.innerHTML = markup;
    return;
  }
  if (password !== confirmPassword) {
    const markup = `
        <i class="fa-solid fa-circle-exclamation"></i> Those passwords don't match. Try again.
        `;
    error.innerHTML = markup;
    return;
  }

  form.submit();
});

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    inputs.forEach((input) => {
      input.setAttribute("type", "text");
    });
  }
  if (!checkbox.checked) {
    inputs.forEach((input) => {
      input.setAttribute("type", "password");
    });
  }
});
