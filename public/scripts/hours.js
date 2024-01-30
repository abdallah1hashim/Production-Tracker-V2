const username = document.querySelector(".username").value;
const output = document.querySelector(".hours-body  .crd");
const outputDate = document.querySelector(".hours-body");
const id = username.toUpperCase() + "@meti.ai";

async function getSheet() {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/15TI7wC8qRSCK2hk32bWTOggEa54p3RYE_9aPQXTilAc?key=AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8`
  );
  const data = await res.json();
  const sheetsNames = data.sheets.map((sheet) => {
    return encodeURIComponent(sheet.properties.title);
  });
  return sheetsNames;
}

getSheet().then(async (sheetsNames) => {
  // const fileterednames = sheetsNames.filter((item) => item.includes("ab"));
  const curSheet = sheetsNames.slice(-1)[0];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/15TI7wC8qRSCK2hk32bWTOggEa54p3RYE_9aPQXTilAc/values/${curSheet}?key=AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8`
  );
  const data = await res.json();

  const myIdRow = data.values.filter((row) => {
    return row.find((value) => value === id);
  });

  output.innerHTML = "";
  outputDate.insertAdjacentHTML(
    "afterbegin",
    `<span>${curSheet.replace(/%2(\d|[A-Z])/g, "/")}</span>`
  );
  myIdRow[0].slice(7).forEach((item, i) => {
    if (!item || item == 0) return;

    const markup = `
    <div class="item">
    <p class="name">${data.values[0][i + 7]} :</p>
    <span class="num">${item}</span>
    </div>
    `;

    output.insertAdjacentHTML("beforeend", markup);
  });
});
const lodderMarkup = `<div class="loader">
Loading...
</div>`;
output.innerHTML = lodderMarkup;

getSheet().then(async (sheetsNames) => {
  let sheets = [];

  // Use map instead of forEach
  await Promise.all(
    sheetsNames.map(async (name) => {
      const sheet = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/15TI7wC8qRSCK2hk32bWTOggEa54p3RYE_9aPQXTilAc/values/${name}?key=AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8`
      );
      const data = await sheet.json();
      sheets.push(data);
    })
  );

  console.log(sheets);

  const myUserInfo = [];

  sheets.forEach((sheet) => {
    sheet.values.forEach((row) => {
      // Use includes instead of strict equality check
      if (row.includes(id)) {
        myUserInfo.push(row);
      }
    });
  });
  
  const totalHours = myUserInfo.reduce((acc, curr) => {
    return (acc = +curr[7] + +curr[8] + acc);
  }, 0);
  const markup = `
    <div class="item">
    <p class="name">Total Hours :</p>
    <span class="num">${totalHours}</span>
    </div>
    `;
  output.insertAdjacentHTML("beforeend", markup);
});
