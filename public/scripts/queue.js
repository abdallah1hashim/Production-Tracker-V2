const body = document.querySelector("tbody");
const rows = document.querySelectorAll("tr");
const addBtn = document.querySelector(".add");

rows.forEach((r) => {
  r.addEventListener("click", handleClick);
});

function handleClick(e) {
  const editBtn = e.target.closest(".edit");
  const deleteBtn = e.target.closest(".delete");
  const id = editBtn ? editBtn.dataset.edit : null;
  const cancelBtn = e.target.closest(".cancel");

  if (!deleteBtn && !editBtn && !cancelBtn) return;

  const row = e.target.closest("tr");
  const markup = row.innerHTML;

  if (editBtn) {
    const newMarkup = `
     
        <td class="name"> <form method="post" action="edit-queue"><input name="name">
       <input type="hidden" name="queueId" value="${id}"><button class="save" type="submit" >Save</button></form></td>
        <td colspan="2"><button class="cancel">Cancel</button></td>
      
    `;
    row.innerHTML = newMarkup;

    row.querySelector(".cancel").addEventListener("click", function () {
      row.innerHTML = markup;

      row.addEventListener("click", handleClick);
    });
  }

  if (cancelBtn) {
    row.innerHTML = markup;

    row.addEventListener("click", handleClick);
  }
}

let formAdded = false;

addBtn.addEventListener("click", () => {
  if (formAdded) return;
  const newMarkup = `
     
  <td class="name"> <form method="post" action="add-queue"><input type="text" name="name">
 <button class="save" type="submit" >Save</button></form></td>
  <td colspan="2"><button class="cancel">Cancel</button></td>

`;
  body.insertAdjacentHTML("beforeend", newMarkup);
  formAdded = true;

  const cancelBtn = document.querySelector(".cancel");
  cancelBtn.addEventListener("click", () => {
    // Remove the form when the cancel button is clicked
    body.removeChild(body.lastElementChild);
    formAdded = false; // Reset the flag
  });
});
