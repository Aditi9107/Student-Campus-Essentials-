// Shared helpers used by every page.
// Change this if your Java backend runs on a different address.
const API_BASE = "http://localhost:8080/api";

// Calls the Java backend and returns the parsed JSON.
// Throws an Error with the server's message if the request fails.
async function api(path, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) headers["Authorization"] = "Bearer " + token;

  let res;
  try {
    res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
  } catch (e) {
    throw new Error("Cannot reach the server. Check that the backend is running.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong.");
    err.status = res.status;
    err.code = data.code; // e.g. "UNVERIFIED"
    throw err;
  }
  return data;
}

function showMessage(el, text, type) {
  el.textContent = text;
  el.className = "msg show " + type;
}

function setFieldError(inputId, text) {
  document.getElementById(inputId + "-error").textContent = text;
}

// Builds the top bar. Shows different links for logged-in users.
function renderNav() {
  const loggedIn = !!localStorage.getItem("token");
  document.getElementById("nav").innerHTML =
    '<a class="brand" href="index.html">Campus Thrift &amp; Rent Hub</a><div class="links">' +
    '<a href="listings.html">Listings</a><a href="needs.html">Needs</a>' +
    (loggedIn
      ? '<a href="my-requests.html">My requests</a><a href="dashboard.html">My account</a>'
      : '<a href="login.html">Log in</a><a href="register.html">Register</a>') +
    "</div>";
}

// ---- Added for the needs, requests, deal and dashboard pages ----
function esc(s) {
  const d = document.createElement("div");
  d.textContent = s == null ? "" : String(s);
  return d.innerHTML;
}
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
// Send the visitor to Login if they are not logged in. Returns true if logged in.
function requireLogin() {
  if (!localStorage.getItem("token")) { window.location.href = "login.html"; return false; }
  return true;
}
// Call from a catch block: handles an expired login. Returns true if it redirected.
function handleExpired(err) {
  if (err.status === 401) { localStorage.removeItem("token"); window.location.href = "login.html"; return true; }
  return false;
}
