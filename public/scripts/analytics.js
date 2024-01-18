const username = document.querySelector(".delay input").value;
const output = document.querySelector(".delay-num span");

async function getSheet() {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/1uIq-o9hWSlolTnYop9nMNtKRCduGcJ8AjawnQ4JgrRQ?key=AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8`
  );
  const data = await res.json();
  const sheetsNames = data.sheets.map((sheet) => {
    return encodeURIComponent(sheet.properties.title);
  });
  return sheetsNames;
}

getSheet().then(async (sheetsNames) => {
  console.log(sheetsNames);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/1uIq-o9hWSlolTnYop9nMNtKRCduGcJ8AjawnQ4JgrRQ/values/${sheetsNames[1]}?key=AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8`
  );
  const data = await res.json();
  console.log(data.values[0][37]);
  const id = `me494032`.toUpperCase();

  const myIdRow = data.values.filter((row) => {
    return row.find((value) => value === id);
  });
  output.innerHTML = myIdRow[0][37];
});
