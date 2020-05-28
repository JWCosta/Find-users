// lists
let allUsers = [];
let filteredUsers = [];

// elements
let inputElement = null;
let userList = null;
let countUsers = null;
let countFemale = null;
let countMale = null;
let totalUsers = null;
let ageSumElement = null;
let avgAge = null;
let userStatistics = null;

// statistics
let totalFilteredUsers = 0;
let totalFilteredMale = 0;
let totalFilteredFemale = 0;
let ageSum = 0;

let numberFormat = Intl.NumberFormat("pt-BR");

window.addEventListener("load", () => {
  selectElements();
  fetchUsers();
});

function selectElements() {
  inputElement = document.querySelector("#findUser");
  inputElement.focus();
  inputElement.addEventListener("input", filterUsers);
  userList = document.querySelector("#userlist");
  countUsers = document.querySelector("#countUsers");
  countMale = document.querySelector("#countMale");
  countFemale = document.querySelector("#countFemale");
  ageSumElement = document.querySelector("#sumAge");
  avgAge = document.querySelector("#avgAge");
  userStatistics = document.querySelector("#users-statistics");
}

async function fetchUsers() {
  const res = await fetch(
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo"
  );
  const json = await res.json();
  allUsers = json.results.map((user) => {
    const { gender, name, dob, picture } = user;
    return {
      name: name.first + " " + name.last,
      age: dob.age,
      gender,
      thumbnail: picture.thumbnail,
    };
  });
}

function filterUsers() {
  const name = event.target.value.trim();
  if (!name) {
    filteredUsers = [];
  } else {
    filteredUsers = allUsers.filter((user) => {
      return user.name.toLowerCase().includes(name.toLowerCase());
    });
    filteredUsers = sortUsers(filteredUsers);
  }
  calc();
  render();
}

function render() {
  statistics();
  list();
}

function sortUsers() {
  return filteredUsers.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

const list = () => {
  if (!filteredUsers) {
    return;
  }
  let userListHTML = "<ul>";
  filteredUsers.forEach((user) => {
    userListHTML += `
    <li>
      <img src="${user.thumbnail}" alt="${user.name}" />
      <span>${user.name}</span>
      <span> / ${user.age} anos</span>
    </li>
    `;
  });
  userListHTML += "</ul>";
  userList.innerHTML = userListHTML;
  countUsers.textContent = totalFilteredUsers;
};

const statistics = () => {
  countMale.textContent = totalFilteredMale;
  countFemale.textContent = totalFilteredFemale;
  countUsers.textContent = totalFilteredUsers;
  ageSumElement.textContent = formatNumber(ageSum);
  avgAge.textContent = formatNumber(ageAverage);
};

const calc = () => {
  totalFilteredUsers = filteredUsers.length;
  totalFilteredMale = totalByGender("male");
  totalFilteredFemale = totalByGender("female");
  ageSum = sumAge();
  ageAverage = average();
};

const totalByGender = (gender) =>
  filteredUsers.filter((user) => user.gender === gender).length;

const sumAge = () => filteredUsers.reduce((acc, curr) => acc + curr.age, 0);

const average = () => {
  if (totalFilteredUsers === 0) {
    return 0;
  }
  return ageSum / totalFilteredUsers;
};

const formatNumber = (number) => {
  return numberFormat.format(parseFloat(number).toFixed(2));
};
