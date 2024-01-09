console.log("working");
const btn = document.querySelectorAll(".edit");
btn.forEach((b) => {
  b.addEventListener("click", (e) => {
    const des = b.dataset.edit;
    const name = b.previousElementSibling;
    const content = name.textContent;
    const markup = `
        <form action="/edit-queue/${des}" method="post">
        <input name="name" value="${content}" >
        <button type="submit" class="save" > save </button>
        </form>
        `;

    name.innerHTML = markup;
    name.querySelector("input").focus();
  });
});
