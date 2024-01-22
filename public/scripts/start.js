const list = document.querySelector("input[list='items']");
list.addEventListener("input", (e) => {
  const listId = list.getAttribute("list");
  // const options = document.querySelectorAll("#" + listId + " option");
  const hiddenInput = document.querySelector("input[name='queueName']");
  const inputValue = list.value;

  const optionValue = document.querySelector(
    `datalist option[value='${inputValue}']`
  ).dataset.value;
  hiddenInput.value = optionValue;
});

// const tringle = document.querySelector(".tringle");
// list.addEventListener("click", () => {
//   tringle.classList.add("rotate");
// });
