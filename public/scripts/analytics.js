const username = document.querySelector(".username").value;
const delayDiv = document.querySelector(".delay-num");
const attendanceDiv = document.querySelector(".attendence-num");

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
  try {
    delayDiv.querySelector("span").innerHTML = "Loading...";
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/1uIq-o9hWSlolTnYop9nMNtKRCduGcJ8AjawnQ4JgrRQ/values/${sheetsNames[2]}?key=AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8`
    );
    const data = await res.json();

    if (!res.ok) throw new Error("faild to fetch data from sheet. Try again");

    const id = username.toUpperCase();

    const myIdRow = data.values.filter((row) => {
      return row.find((value) => value === id);
    });
    if (!myIdRow) throw new Error("faild to find the data");
    delayDiv.querySelector("span").innerHTML = myIdRow[0][37];
  } catch (error) {}
});

async function getAttendenceSheet() {
  try {
    attendanceDiv.querySelector("span").innerHTML = "Loading...";
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/1VGCmgn4eySV8ERcqG9H1Uhqtl8DatlRD3teG2v2S3Lc/values/Attendance?key=AIzaSyA1DiDSTDT-E1KtlFhUpeecLxnKh_Uxxf8`
    );
    if (!res.ok) throw new Error("faild to fetch data");
    const data = await res.json();
    if (!data) throw new Error("faild to fetch data");
    console.log(data);
    const userAttendance = data.values
      .filter((value) => value.includes(username.toUpperCase()))[0]
      .slice(8);
    console.log(userAttendance);
    const attainedDays = userAttendance
      .map((day, i) =>
        day === "P" ||
        day === "T" ||
        day === "T1" ||
        day === "T2" ||
        day === "T3"
          ? i + 1
          : null
      )
      .filter((dayIndex) => dayIndex !== null);
    const apsentDays = userAttendance
      .map((day, i) => (day === "0" ? i + 1 : null))
      .filter((dayIndex) => dayIndex !== null);
    console.log(userAttendance, attainedDays, apsentDays);
    attendanceDiv.querySelector("span").innerHTML = attainedDays.length;
    attendanceDiv.insertAdjacentHTML(
      "beforeend",
      `<br><span>${apsentDays.length}</span> Absent Days`
    );
  } catch (error) {
    attendanceDiv.querySelector("span").innerHTML = error.message;
  }
}
getAttendenceSheet();
