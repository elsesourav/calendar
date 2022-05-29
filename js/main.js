const userDtls = localStorage.getItem("sb-calendar-userName").split("--");
let userData = [];

// // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
let userId;
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    location.replace("../index.html");
  } else {
    userId = firebase.auth().currentUser.uid;
  }
});

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const section = document.querySelector("section");
const monthYearTitle = document.getElementById("month-year-title");
const leftMonth = document.getElementById("left-month");
const rightMonth = document.getElementById("right-month");
const monthInput = document.getElementById("month-input");
const yearInput = document.getElementById("year-input");
const memberList = document.getElementById("scroll");
const openTab = document.getElementById("open-tab");
const main = document.querySelector("main");
const addNewInput = document.getElementById("add-new-input");
const closeFlotTab = document.getElementById("close");
const colorPickeer = document.getElementById("color-pickeer");
const openNewMT = document.getElementById("open-new-m-t");
const addMemberFlotingWindow = document.getElementById(
  "add-member-floting-window"
);
const dayInfCloseBtn = document.getElementById("day-inf-close-btn");
const inputWhySpecial = document.getElementById("input-why-special");
const scrollCard = document.getElementById("scroll-card");
const inputPersonName = document.getElementById("input-person-name");
const colorsSelect = document.querySelectorAll("#color-pickeer span");
const addMB_span = document.querySelector("#add-member-button span");
const inputNote = document.getElementById("input-note");
const dayInfDate = document.getElementById("day-inf-date");
const showDayName = document.getElementById("show-day-name");
const fullScreen = document.getElementById("fullScreen");
const welcomeUser = document.getElementById("welcome-user");
const logoutBtn = document.getElementById("logout");

const deleteAlert = document.getElementById("delete-alert");
const deleteCancel = document.getElementById("delete-cancel");
const confirmDelete = document.getElementById("confirm-delete");
const logoutAlert = document.getElementById("logout-alert");
const showUsername = document.getElementById("show-username");
const showGmail = document.getElementById("show-gmail");
const logoutCancel = document.getElementById("logout-cancel");
const confirmLogout = document.getElementById("confirm-logout");

const dayInformation = document.getElementById("day-information");
const showDate = document.getElementById("show-date");
const openNewMoment = document.getElementById("open-new-whyspecial");
const scrollBox = document.getElementById("scroll-box");
const infoScrollList = document.getElementById("info-scroll-list");
const title_p = document.querySelector("#title p");

// firebase function 
logoutBtn.addEventListener("click", () => {
  setCookie("sb-calendar", ``, 0);
  logoutAlert.classList.add("active");
  showUsername.innerHTML = `Username: ${userDtls[1]}`;
  showGmail.innerHTML = `Gmail: ${userDtls[2]}`;
  confirmLogout.addEventListener("click", () => {
    firebase
    .database()
    .ref(`users/${userId}/saveData`)
    .set(userData)
    .then(() => {
      firebase.auth().signOut();
    });
  })
  logoutCancel.addEventListener("click", () => {
    logoutAlert.classList.remove("active");
  })
});

/* -------------- inmportant function ------------- */
// chack year is lepe year
const isLepeYear = (year) => !(year % 4);

// get  age start to end
const getAge = (startDate, endDate, inMonth = false) => {
  let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let ms = endDate.getTime() - startDate.getTime();
  if (ms < 0)
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
    };
  let days = ms / (1000 * 3600 * 24);
  let _years = startDate.getFullYear();
  let _months = startDate.getMonth();
  let yy = 0,
    mn = 0,
    mm = (days % Math.floor(days)) * 24 * 60,
    dd = Math.floor(days),
    hh = 0;

  while (mm >= 60) {
    hh++;
    mm -= 60;
  }

  while (
    !inMonth &&
    ((isLepeYear(_years) && dd > 365) || (!isLepeYear(_years) && dd > 364))
  ) {
    if (isLepeYear(_years) && dd > 365) dd -= 366;
    else if (dd > 364) dd -= 365;
    _years++;
    yy++;
  }
  while (
    (isLepeYear(_years) && _months === 1 && dd > months[_months]) ||
    ((!isLepeYear(_years) || _months !== 1) && dd >= months[_months])
  ) {
    if (_months === 1 && isLepeYear(_years) && dd > 28) dd -= 29;
    else if (dd >= months[_months]) dd -= months[_months];
    _months = (_months + 1) % 11;
    mn++;
  }

  return {
    years: yy,
    months: mn,
    days: Math.floor(dd),
    hours: hh,
    minutes: Math.floor(mm) + 1,
  };
};

// find index in array
const getArrayIndex = (ary, id) => ary.findIndex((e) => e.id == id);

// return string to integer
const Int = (num) => parseInt(num);

// given age exist in data
const ageExistInData = (yy, mm, dd) => {
  let ary = [];
  const e = userData;
  for (let i = 0; i < e.length; i++) {
    if (Int(e[i].yy) <= yy && Int(e[i].mm) == mm + 1 && Int(e[i].dd) == dd)
      ary.push(e[i]);
  }
  return (ary = ary.length > 0 ? ary : false);
};

// scroll element left to right
const scrollElement = (element, duration, delay = 0) => {
  element.scrollLeft = 0;
  const FPS = 90;
  let distence = element.scrollWidth;
  let times = distence / FPS;
  let i = 0;
  setTimeout(() => {
    const f = () => {
      infoScrollList.scrollLeft += times;
      if (i++ < FPS) setTimeout(f, duration / FPS);
    };
    f();
  }, delay);
};

let winWidth = window.innerWidth;
let winHeight = window.innerHeight;

let Delete, m_spans;
let editUserIndex = false;
addNewInput.defaultValue = "2001-07-07";

const d_ = () => new Date();
let crntMM = d_().getMonth();
let crntYY = d_().getFullYear();
let crntDD = d_().getDate();
let crntHH = d_().getHours();
let currentMinute = d_().getMinutes();
let currentSecond = d_().getSeconds();
let selectedColorI = 0;
let tabOpenIs = false;
let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const tudayDate = {
  year: crntYY,
  month: crntMM,
  day: crntDD,
  hour: crntHH,
  minute: currentMinute,
  second: currentSecond,
};
const monthName = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const daysName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const shortDayName = ["SUN", "MON", "TUE", "WED", "THD", "FRI", "SAT"];

// -----------------------------------------------------
// ------ first time initilizion -----
if (JSON.parse(localStorage.getItem("sb-calendar"))) {
  userData = JSON.parse(localStorage.getItem("sb-calendar"));
}

userData.forEach((e) => {
  addMember(e);
});
setTimeout(() => {
  main.style.bottom = `${-main.clientHeight}px`;
}, 350);

welcomeUser.innerHTML = `<h1>Welcome</h1><div class="nm" style="animation:ani-color 5s linear infinite">${userDtls[0]}</div>
  <br>
  <p style="padding: 5px 0">Please Scroll Down</p>
  <span id="d1"></span><span id="d2"></span>
  <span id="d3"></span><span id="d4"></span>
  <span id="d5"></span>
  `;

setBord();
monthInput.value = monthName[crntMM];
yearInput.value = crntYY;

// hover class set
hover(leftMonth);
hover(rightMonth);
hover(deleteCancel);
hover(confirmDelete);
hover(logoutCancel);
hover(confirmLogout);

// ------- left right month event hendaler -------
leftMonth.addEventListener("click", goLeft);
rightMonth.addEventListener("click", goRight);

// ----- go left right to use touch ---- //
let sx = 0,
  storex = 0;
const sence = 100;
let moveLock = false;

const lrStart = (e) => {
  sx = e.touches[0].clientX;
};
const lrMove = (e) => {
  if (moveLock) return;
  let x = e.touches[0].clientX;
  let nx = sx - x;
  storex += nx;
  if (storex > sence) {
    goLeft();
    moveLock = true;
  } else if (storex < -sence) {
    goRight();
    moveLock = true;
  }
  sx = x;
};
const lrEnd = () => {
  moveLock = false;
  storex = 0;
};

dayInformation.addEventListener("touchstart", () => (moveLock = true));
document.body.addEventListener("touchstart", lrStart);
document.body.addEventListener("touchmove", lrMove);
document.body.addEventListener("touchend", lrEnd);

function goLeft() {
  if (crntYY <= 1 && crntMM == 0) return;
  if (crntMM <= 0) {
    crntMM = 11;
    crntYY--;
    setYearInInput(crntYY);
  } else crntMM--;
  monthInput.value = monthName[crntMM];
  setBord();
}
function goRight() {
  if (crntYY >= 9999 && crntMM == 11) return;
  if (crntMM >= 11) {
    crntMM = 0;
    crntYY++;
    setYearInInput(crntYY);
  } else crntMM++;
  monthInput.value = monthName[crntMM];
  setBord();
}

// -------- input event hendale -----------
monthInput.addEventListener("focusout", (e) => {
  monthInput.setAttribute("type", "text");
  e.target.value = monthName[crntMM];
});
monthInput.addEventListener("click", (e) => {
  monthInput.setAttribute("type", "number");
  e.target.value = crntMM + 1 < 10 ? `0${crntMM + 1}` : crntMM + 1;
  monthInput.select();
});
monthInput.addEventListener("input", (e) => {
  monthInput.setAttribute("type", "number");
  let val = Number(e.target.value);
  if (val > 0 && val < 13) crntMM = val - 1;
  e.target.value = val;
  setBord();
});

//------------------------------------
yearInput.addEventListener("focusout", (e) => {
  setYearInInput(crntYY);
});
yearInput.addEventListener("click", (e) => {
  yearInput.select();
});
yearInput.addEventListener("input", (e) => {
  yearInput.setAttribute("type", "number");
  if (e.target.value > 0 && e.target.value < 9001) crntYY = Int(e.target.value);
  setBord();
});

let wy,
  sy = 0,
  olrady = false;

const touchStart = (e) => m_and_t_start(e.touches[0].clientY);
const touchMove = (e) => m_and_t_move(e.touches[0].clientY);
const touchEnd = () => m_and_t_end();

let mseMoveLock = false;
const mouseDown = (e) => {
  mseMoveLock = true;
  m_and_t_start(e.clientY);
};
const mouseMove = (e) => {
  if (mseMoveLock) m_and_t_move(e.clientY);
};
const mouseLeave = () => {
  mseMoveLock = false;
  m_and_t_end();
};

function m_and_t_start(_y) {
  wy = _y;
  welcomeUser.style.transition = `none`;
}

function m_and_t_move(_y) {
  if (olrady) return;
  let y = wy - _y;
  sy += y * 2;
  welcomeUser.style.transform = `translateY(${-sy}px)`;
  wy = _y;
}

function m_and_t_end() {
  if (sy > 100) {
    olrady = true;
    fullScreen.style.top = `${-winHeight * 1.4}px`;
    welcomeUser.style.transition = `linear 0.3s`;
    welcomeUser.style.transform = `translateY(${0}px)`;
    fullScreenPag();
    sy = 0;
  }else {
    sy = 0;
    olrady = false;
    welcomeUser.style.transition = `linear 0.3s`;
    welcomeUser.style.transform = `translateY(${sy}px)`;
  }
}

fullScreen.addEventListener("touchstart", touchStart);
fullScreen.addEventListener("touchmove", touchMove);
fullScreen.addEventListener("touchend", touchEnd);
fullScreen.addEventListener("mousedown", mouseDown);
fullScreen.addEventListener("mousemove", mouseMove);
fullScreen.addEventListener("mouseleave", mouseLeave);
fullScreen.addEventListener("mouseup", mouseLeave);

function getFullScreen() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullscreenElement ||
    document.msFullscreenElement
  );
}
document.addEventListener("fullscreenchange", (e) => {
  if (getFullScreen() === undefined) {
    fullScreen.style.top = 0;
  }
});
document.addEventListener("resize", () => {
  const root = document.querySelector(":root");
  winWidth = window.innerWidth;
  winHeight = window.innerHeight;
  root.style.setProperty("--winWidth", `${winWidth}px`);
  root.style.setProperty("--winHeight", `${winHeight}px`);
});
function fullScreenPag() {
  if (getFullScreen()) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
}

colorsSelect.forEach((e, i) => {
  e.addEventListener("click", () => {
    colorsSelect.forEach((E) => {
      E.classList.remove("select");
    });
    selectedColorI = i;
    e.classList.add("select");
    chackAllInputFill();
  });
});
function setColorSelector(index) {
  colorsSelect.forEach((e, i) => {
    if (i == index) e.classList.add("select");
    else e.classList.remove("select");
  });
}
let inputFill = false;
document.addEventListener("input", chackAllInputFill);
function chackAllInputFill() {
  inputFill = false;
  if (
    inputWhySpecial.value.length > 2 &&
    inputPersonName.value.length > 2 &&
    inputNote.value.length > 2 &&
    addNewInput.value != ""
  ) {
    addMB_span.style.background = "#0000ff";
    inputFill = true;
  } else {
    inputFill = false;
    addMB_span.style.background = "#a0a0ff";
  }
}
hover(addMB_span);
addMB_span.addEventListener("click", () => {
  if (!inputFill) return;
  let DATE = addNewInput.value.split("-");
  const spl = inputWhySpecial.value;
  const nm = inputPersonName.value;
  const note = inputNote.value;
  const obj = {
    whySpecial: spl,
    personeName: nm,
    dd: DATE[2],
    id: Date.now(),
    mm: DATE[1],
    yy: DATE[0],
    note: note,
    colorI: selectedColorI,
  };
  if (editUserIndex) {
    userData[Int(editUserIndex)] = obj;
    memberList.innerHTML = "";
    userData.forEach((e) => {
      addMember(obj);
    });
  } else {
    addMember(obj, true);
    userData.push(obj);
    addNewInput.value = "2001-07-07";
    inputNote.value = "";
    inputWhySpecial.value = "";
    inputPersonName.value = "";
    selectedColorI = 0;
  }
  localStorage.setItem("sb-calendar", JSON.stringify(userData));
  firebase.database().ref(`users/${userId}/saveData`).set(userData);
  setBord();
  addMemberFlotingWindow.classList.remove("active");
});

//------------------------------------------------
hover(closeFlotTab);
closeFlotTab.addEventListener("click", () => {
  addNewInput.value = "2001-07-07";
  inputNote.value = "";
  inputWhySpecial.value = "";
  inputPersonName.value = "";
  selectedColorI = 0;
  editUserIndex = false;
  chackAllInputFill();
  addMemberFlotingWindow.classList.remove("active");
});
hover(openNewMT);
openNewMT.addEventListener("click", () => {
  addMemberFlotingWindow.classList.add("active");
  setColorSelector(selectedColorI);
});
function setYearInInput(year) {
  yearInput.value =
    year < 10
      ? `000${year}`
      : year < 100
      ? `00${year}`
      : year < 1000
      ? `0${year}`
      : year;
}

//---------------------------------------------------
dayInformation.style.display = `grid`;
dayInfCloseBtn.addEventListener("click", () => {
  dayInformation.style.background = `transparent`;
  setTimeout(() => {
    dayInformation.style.transform = `scale(0)`;
  }, 100);
  setTimeout(() => {
    dayInformation.style.transform = `scale(0)`;
    setBord();
  }, 300);
});

// --------------------------------------------------
function setBord() {
  section.innerHTML = "";

  const month = crntMM;
  const year = crntYY;

  // set days name
  shortDayName.forEach((e) => {
    const n = document.createElement("div");
    n.innerText = e;
    n.classList.add("day-name");
    section.appendChild(n);
  });

  let gapDays = new Date(year, month).getDay();

  for (i = 0; i < gapDays; i++) {
    const n = document.createElement("div");
    n.innerText = "";
    n.classList.add("_gap");
    section.appendChild(n);
  }

  // set when lipyer and month is feb
  let newMonth = isLepeYear(year) && month === 1 ? 29 : months[month];
  for (let i = 1; i <= newMonth; i++) {
    const n = document.createElement("div");
    n.innerText = i;
    n.classList.add("days");

    userData.forEach((e) => {
      if (year >= Int(e.yy) && Int(e.dd) == i && Int(e.mm) == month + 1) {
        n.classList.add(`bg${e.colorI}`);
        n.classList.add(`glow`);
      }
    });
    if (
      year === tudayDate.year &&
      month === tudayDate.month &&
      tudayDate.day == i
    ) {
      n.classList.add("tuday");
      n.classList.add("glow");
    } else if (i % 2 && !n.classList.contains("glow")) {
      n.classList.add("odd");
    }
    section.appendChild(n);
    n.addEventListener("click", () => {
      const element = ageExistInData(crntYY, crntMM, i);
      if (element) {
        scrollCard.innerHTML = "";
        element.forEach((e) => {
          dayInformation.style.transform = `scale(1)`;
          setTimeout(() => {
            dayInformation.style.background = `rgba(0, 0, 0, 0.6)`;
          }, 200);
          bordMaker(e);
        });
        scrollElement(infoScrollList, 300, 300);
      } else {
        let cm = crntMM + 1;
        let mm = cm.toString().length > 1 ? cm : `0${cm}`;
        let dd = i.toString().length > 1 ? i : `0${i}`;
        addNewInput.value = `${crntYY}-${mm}-${dd}`;
        inputNote.value = "";
        inputWhySpecial.value = "";
        inputPersonName.value = "";
        selectedColorI = 0;
        addMemberFlotingWindow.classList.add("active");
        setColorSelector(selectedColorI);
        if (!tabOpenIs) {
          toggelAddMemberMenu();
        }
      }
    });
  }
}
function giveMeName(str) {
  let s = "";
  str.split(" ").forEach((e) => {
    s += `<p>${e}</p>`;
  });
  return s;
}

function bordMaker(obj) {
  const _year = Int(obj.yy),
    _months = Int(obj.mm) - 1,
    _days = Int(obj.dd);
  const cyy = d_().getFullYear(),
    cmm = d_().getMonth(),
    cdd = d_().getDate();

  let y;

  if (isLepeYear(crntYY) && _months == 1 && _days == 29) {
    y = crntYY + 4 >= cyy ? crntYY : crntYY + 4;
  } else if (
    (crntYY == cyy && crntMM == cmm && _days < cdd) ||
    (crntYY == cyy && crntMM < cmm)
  ) {
    y = crntYY + 1;
  } else {
    y = crntYY;
  }

  let nextAge = new Date(y, _months, _days);
  let age = new Date(_year, _months, _days);
  let currentAge = new Date(crntYY, crntMM, _days);

  let totalAge = getAge(age, d_());
  let leftAge = getAge(d_(), nextAge, true);

  dayInfDate.innerHTML = `${obj.dd}-${obj.mm}-${crntYY}`;
  showDayName.innerHTML = daysName[currentAge.getDay()];
  scrollCard.innerHTML += `<div class="card bg${obj.colorI}"> 
  <div class="card-inset"> 
  <div class="-card-back"></div>
  <div class="why-special">${obj.whySpecial}</div> 
  <div class="start-date-dayname">
    ${obj.dd}-${obj.mm}-${obj.yy}  ${daysName[age.getDay()]}
  </div>
  <div class="person-name">
    ${giveMeName(obj.personeName)}
  </div>
  <div class="note">
    <p>
    ${obj.note}
    </p>
  </div>
  <div class="time-left">
    <legend><p>Time Left</p></legend>
    <div class="-block">
      <div class="-months flex">
        <div class="key">Months:</div>
        <div class="value">${leftAge.months}</div>
      </div>
      <div class="-day flex">
        <div class="key">Day:</div>
        <div class="value">${leftAge.days}</div>
      </div>
      <div class="-hours flex">
        <div class="key">Hours:</div>
        <div class="value">${leftAge.hours}</div>
      </div>
      <div class="-minutes flex">
        <div class="key">Minutes:</div>
        <div class="value">${leftAge.minutes}</div>
      </div>
    </div>
  </div>
  <div class="total-time">
    <legend><p>Total Time</p></legend>
    <div class="-block">
      <div class="-years flex">
        <div class="key">Year:</div>
        <div class="value">${totalAge.years}</div>
      </div>
      <div class="-months flex">
        <div class="key">Months:</div>
        <div class="value">${totalAge.months}</div>
      </div>
      <div class="-day flex">
        <div class="key">Day:</div>
        <div class="value">${totalAge.days}</div>
      </div>
      <div class="-hours flex">
        <div class="key">Hours:</div>
        <div class="value">${totalAge.hours}</div>
      </div>
    </div>
  </div>
</div>
</div>`;
}

openTab.addEventListener("click", toggelAddMemberMenu);
function toggelAddMemberMenu() {
  if (tabOpenIs) {
    main.style.bottom = `${-main.clientHeight}px`;
    openTab.classList.remove("active");
  } else {
    main.style.bottom = 0;
    openTab.classList.add("active");
  }
  tabOpenIs = tabOpenIs ? false : true;
}

function addMember(element, is = false) {
  const member = document.createElement("div");
  const status = document.createElement("span");
  const edit = document.createElement("div");
  const dlte = document.createElement("div");
  hover(dlte);
  hover(edit);

  member.classList.add("members");
  dlte.classList.add("delete");
  edit.classList.add("edit");

  status.innerHTML = `
      <p>${element.personeName}</p>
      <small>${element.dd}/${element.mm}/${element.yy}</small>
  `;
  edit.innerHTML = `<i class="sb-edit"></i>`;
  dlte.innerHTML = `<i class="sb-delete"></i>`;
  member.appendChild(status);
  member.appendChild(edit);
  member.appendChild(dlte);
  memberList.appendChild(member);

  if (is)
    setTimeout(() => {
      member.style.height = "40px";
    }, 300);
  else member.style.height = "40px";

  status.addEventListener("click", () => {
    dayInformation.style.transform = `scale(1)`;
    setTimeout(() => {
      dayInformation.style.background = `rgba(0, 0, 0, 0.6)`;
    }, 200);
    let index = getArrayIndex(userData, element.id);
    scrollCard.innerHTML = "";
    bordMaker(userData[index]);
  });
  edit.addEventListener("click", () => {
    let index = getArrayIndex(userData, element.id);
    let da = userData[index];
    addNewInput.value = `${da.yy}-${da.mm}-${da.dd}`;
    inputNote.value = da.note;
    inputWhySpecial.value = da.whySpecial;
    inputPersonName.value = da.personeName;
    selectedColorI = Int(da.colorI);
    editUserIndex = index.toString();
    addMemberFlotingWindow.classList.add("active");
    setColorSelector(selectedColorI);
    setBord();
  });
  dlte.addEventListener("click", () => {
    let index = getArrayIndex(userData, element.id);
    deleteMember(index, member);
  });
}

function deleteMember(index, member) {
  deleteAlert.classList.add("active");
  confirmDelete.addEventListener("click", () => {
    userData.splice(index, 1);
    firebase.database().ref(`users/${userId}/saveData`).set(userData);
    member.style.height = 0;
    setTimeout(() => {
      memberList.removeChild(member);
    }, 300);
    deleteAlert.classList.remove("active");
    localStorage.setItem("sb-calendar", JSON.stringify(userData));
    setBord();
  })
  deleteCancel.addEventListener("click", () => {
    deleteAlert.classList.remove("active");
  });
}
