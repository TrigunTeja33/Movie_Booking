const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

const showPopupBtn = document.querySelector(".login-btn");
const formPopup = document.querySelector(".form-popup");
const hidePopupBtn = formPopup.querySelector(".close-btn");
const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");

const userStatusElement = document.getElementById('user-status');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const signupForm = document.getElementById('signup-form');

const loginEmail = document.getElementById('login-email');
const signupEmail = document.getElementById('signup-email');

// Check if the user is already logged in
updateUserStatus();

function updateUserStatus(email) {
  if (isLoggedIn()) {
    userStatusElement.innerHTML = `Logged In as <b>${email}</b> | <button id="logout-btn" style="width:140px;height:40px;border:none;outline:none;background:#fff;color:#275360;font-size:1rem;font-weight:600;padding:10px18px;border-radius:3px;cursor:pointer;transition:ease;">Logout</button>`;
    document.getElementById('logout-btn').addEventListener('click', logout);
  } else {
    userStatusElement.innerHTML = 'Not Logged In | <button id="login-btn" style="width:140px;height:40px;border:none;outline:none;background:#fff;color:#275360;font-size:1rem;font-weight:600;padding:10px18px;border-radius:3px;cursor:pointer;transition:ease;">Login</button>';
    document.getElementById('login-btn').addEventListener('click', showLoginPopup);
  }
}

// Function to check if the user is logged in
function isLoggedIn() {
  // Check if the authentication token exists in local storage
  const token = localStorage.getItem('authToken');
  return token !== null;
}



// Password Validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Show login popup
showPopupBtn.addEventListener("click", () => {
  document.body.classList.toggle("show-popup");
});

// Hide login popup
hidePopupBtn.addEventListener("click", () => showPopupBtn.click());

// Show or hide signup form
signupLoginLink.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    formPopup.classList[link.id === "signup-link" ? "add" : "remove"](
      "show-signup"
    );
  });
});

// Get initial movies
getMovies(API_URL)

async function getMovies(url) {
    const res = await fetch(url)
    const data = await res.json()

    showMovies(data.results)
}

function showMovies(movies) {
  movies.sort((b,a) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);
    return dateA - dateB;
});
    main.innerHTML = ''

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview,release_date } = movie

        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview" style=max-height:50%;overflow-y:auto;>
          <h3>Overview</h3>
          ${overview}
        </div>
        `
        movieEl.addEventListener('click', () => {

            // Check if the user is logged in
            if (isLoggedIn()) {
              if (release_date) {
              const movieReleaseDate = new Date(release_date);
              const date1 = new Date('2024-01-31');
              const date2 = new Date('2024-12-29');
              if (movieReleaseDate < date1) {
                alert('Bookings for this movie has closed');
              } else if(movieReleaseDate > date2 ){
                alert('Bookings for this movie have not opened yet');
              } else {
                // Log the clicked movie title to the console
                console.log('Clicked Movie Title:', title);
                // Open html.html in a new window or tab
                window.location.href = `Folder/html.html?movieTitle=${encodeURIComponent(title)}`;
              }
            } else {
              alert('Movie release date is not finalized.');
            }
              } else {
                alert('Please log in to view movie details.');
            }
        });
        
        main.appendChild(movieEl)
    })
}

function getClassByRate(vote) {
    if(vote >= 8) {
        return 'green'
    } else if(vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

// Funtion to Search Movies
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchTerm = search.value

    if(searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm)

        search.value = ''
    } else {
        window.location.reload()
    }
})

// Function to validate email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Function to validate password
function validatePassword(password) {
  return passwordRegex.test(password);
}

//Login Form Validation
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (!validatePassword(password)) {
    alert('Please enter a valid password (minimum 8 characters, at least one uppercase letter, one lowercase letter, and one digit).');
    return;
  }

  login(email, password);
});

const userData = [{ email: 'trigun@gmail.com', password: 'passWORD123' },];
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;


  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (!validatePassword(password)) {
    alert('Please enter a valid password (minimum 8 characters, at least one uppercase letter, one lowercase letter, and one digit).');
    return;
  }
  
  const existingUser = userData.find((user) => user.email === email);

  if (existingUser) {
    alert('User already exist. Please choose another.');
    return;
  }
  userData.push({ email, password });
  alert(`User data for ${email} saved successfully!`);
  const token = 'your_auth_token';

  // Store the token in local storage
  localStorage.setItem('authToken', token);

  // Update the UI with the logged-in email
  updateUserStatus(email);

  // Display a welcome message
  alert(`Welcome, ${email}!`);

  closeLoginPopup();

});

function login(email, password) {
  const authenticatedUser = userData.find(
    (user) => user.email === email && user.password === password);   if (authenticatedUser) {
  const token = 'your_auth_token';

  // Store the token in local storage
  localStorage.setItem('authToken', token);

  // Update the UI
  updateUserStatus(email);


  closeLoginPopup();
} else {
  // Display an alert for incorrect credentials
  alert('Invalid email or password. Please try again.');
}
}

// Function to log out the user
function logout() {
  // Remove the authentication token from local storage
  localStorage.removeItem('authToken');

  // Update the UI
  updateUserStatus();
}

function showLoginPopup() {
  document.body.classList.add("show-popup");
}

// Function to close the login popup
function closeLoginPopup() {
  document.body.classList.remove("show-popup");
}
