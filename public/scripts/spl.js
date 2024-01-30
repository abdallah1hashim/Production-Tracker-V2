const username = document.querySelector(".username").value;
const splList = document.querySelector(".spl-body  .crd ");
const outputDate = document.querySelector(".spl-body");

async function getSheet() {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/1I3HSt1_WYaVlChTK37VJyYSW07xIA09sq-4lsZyN4og?key=AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8`
  );
  const data = await res.json();
  const sheetsNames = data.sheets.map((sheet) => {
    return encodeURIComponent(sheet.properties.title);
  });
  return sheetsNames;
}

getSheet().then(async (sheetsNames) => {
  const curSheet = sheetsNames.slice(-1)[0];
  console.log(curSheet[0]);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/1I3HSt1_WYaVlChTK37VJyYSW07xIA09sq-4lsZyN4og/values/${curSheet}?key=AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8`
  );
  const data = await res.json();
  console.log(data.values);
  console.log(data.values[0]);
  const id = username.toUpperCase() + "@meti.ai";

  const myIdRow = data.values.filter((row) => {
    return row.find((value) => value === id);
  });
  console.log(username, myIdRow[0]);
  splList.innerHTML = "";
  outputDate.insertAdjacentHTML(
    "afterbegin",
    `<span>${curSheet.replace(/%2(\d|[A-Z])/g, "/")}</span>`
  );
  myIdRow[0].slice(7).forEach((item, i) => {
    if (!item || item == 0) return;

    const markup = `
    <div>
      <p class="name">${
        (data.values[0][i + 7] !== "" && data.values[0][i + 7] + "(FP)") ||
        (data.values[0][i + 6] !== "" && "NO. labels FP") ||
        (data.values[0][i + 5] !== "" && data.values[0][i + 5] + "(QA)") ||
        (data.values[0][i + 4] !== "" && "NO. labels QA")
      }</p>
      <span class="num">${item}</span>
    </div>
      `;

    splList.insertAdjacentHTML("beforeend", markup);
  });
});
const lodderMarkup = `<div class="loader">
Loading...
</div>`;
splList.innerHTML = lodderMarkup;
