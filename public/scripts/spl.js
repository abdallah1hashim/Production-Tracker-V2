const username = document.querySelector(".username").value;
const output = document.querySelector(".spl-body  .crd");
const outputDate = document.querySelector(".spl-body");

async function getSheet() {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/1ajyh_K1GLt99bcUximlt01AFQi2RM-j1cAPqRULjfDQ?key=AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8`
  );
  const data = await res.json();
  const sheetsNames = data.sheets.map((sheet) => {
    return encodeURIComponent(sheet.properties.title);
  });
  return sheetsNames;
}

getSheet().then(async (sheetsNames) => {
  const fileterednames = sheetsNames.filter((item) => item.includes("ab"));
  const curSheet = fileterednames.slice(-1)[0];
  console.log(curSheet[0]);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/1ajyh_K1GLt99bcUximlt01AFQi2RM-j1cAPqRULjfDQ/values/${curSheet}?key=AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8`
  );
  const data = await res.json();
  console.log(data.values);
  console.log(data.values[0]);
  const id = username.toUpperCase() + "@meti.ai";

  const myIdRow = data.values.filter((row) => {
    return row.find((value) => value === id);
  });
  console.log(username, myIdRow[0]);
  output.innerHTML = "";
  outputDate.insertAdjacentHTML(
    "afterbegin",
    `<span>${curSheet.replace(/%2(\d|[A-Z])/g, "/")}</span>`
  );
  myIdRow[0].slice(7).forEach((item, i) => {
    if (!item || item == 0) return;
    console.log(i);
    const markup = `
    <span class="num">${item}</span>
    <p class="name">${
      data.values[0][i + 7] &&
      data.values[0][i + 6] &&
      data.values[0][i + 5] &&
      data.values[0][i + 4]
    }</p>
    `;
    console.log(data.values[0][i + 5]);
    output.insertAdjacentHTML("beforeend", markup);
  });
});
const lodderMarkup = `<div class="loader">
Loading...
</div>`;
output.innerHTML = lodderMarkup;
