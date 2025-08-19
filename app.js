document.addEventListener('DOMContentLoaded', init);

const firebaseConfig = { apiKey: "YOUR_API_KEY", authDomain: "YOUR_PROJECT_ID.firebaseapp.com", projectId: "YOUR_PROJECT_ID" };
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const SHARED_PASSWORDS = { kayton: '0301', tray: '0609', hunter: '0703', public: '2575', kyzler: '0311', hazen: '1212' };

function init() {
populateScreens();
const splashScreen = document.getElementById('splash-screen');
setTimeout(() => {
splashScreen.classList.add('fade-out');
setupAuthListener();
}, 1500);
}

function populateScreens() {
document.getElementById('splash-screen').innerHTML = `<div id="logo"><span id="logo-letter">J</span></div><h1>Jena</h1>`;
document.getElementById('auth-screen').innerHTML = `<div class="container"><div id="logo"><span id="logo-letter">J</span></div><h1 id="auth-title">Log In</h1><p id="auth-error" style="color:red;min-height:1.2em;"></p><div id="email-login-container"><input type="email" id="email-input" placeholder="Email"><input type="password" id="password-input" placeholder="Password"><button id="email-submit-btn">Log In</button><button id="toggle-signup-btn" class="secondary">Need an account? Sign Up</button></div><div id="code-login-container" class="hidden"><input type="password" id="code-input" placeholder="Password"><button id="code-submit-btn">Unlock</button></div><button id="toggle-login-mode-btn" class="secondary">Or, use a shared code</button></div>`;
document.getElementById('mode-selection-screen').innerHTML = `<div class="container"><h2>Select Your Mode</h2><button id="select-power-mode">Power Up Mode</button><button id="select-debug-mode" class="secondary">Debug Mode</button><button id="select-local-mode" class="secondary">Local Mode</button><button id="select-school-mode" class="secondary">School Mode</button><button id="logout-btn-mode-select" class="secondary" style="background-color:#c82333;">Log Out</button></div>`;
document.getElementById('main-workspace').innerHTML = `<div id="sidebar"><h1>Jena</h1><button id="back-to-modes" class="secondary">Back to Modes</button><div style="margin-top:20px;"><label for="project-switcher" style="font-size:14px;">Project:</label><select id="project-switcher" style="width:100%;padding:5px;"><option>Project Alpha</option><option>Project Beta</option></select></div><button id="plugins-btn" class="secondary">Plugins 🧩</button><button id="logout-btn-workspace" style="margin-top: auto; background-color:#c82333;">Log Out</button></div><div id="chat-area"><p>Workspace Area</p></div>`;
document.getElementById('command-palette').innerHTML = `<div class="container"><input type="text" placeholder="Type a command..."><p style="font-size:12px; text-align:center;">(e.g., New Chat, Clear History, Toggle Theme)</p></div>`;
}

function setupAuthListener() {
auth.onAuthStateChanged(user => {
const sharedUser = sessionStorage.getItem('sharedUser');
if (user || sharedUser) {
showModeSelectionScreen(user);
} else {
showAuthScreen();
}
});
}

function showAuthScreen() {
document.getElementById('auth-screen').classList.remove('hidden');
document.getElementById('mode-selection-screen').classList.add('hidden');
document.getElementById('main-workspace').classList.add('hidden');
setupLoginScreen();
}

function showModeSelectionScreen(user) {
document.getElementById('auth-screen').classList.add('hidden');
document.getElementById('mode-selection-screen').classList.remove('hidden');
document.getElementById('main-workspace').classList.add('hidden');

document.getElementById('logout-btn-mode-select').onclick = () => logout(user);
document.getElementById('select-power-mode').onclick = () => showWorkspace(user, 'Power Up');
}

function showWorkspace(user, mode) {
document.getElementById('mode-selection-screen').classList.add('hidden');
document.getElementById('main-workspace').classList.remove('hidden');

document.getElementById('logout-btn-workspace').onclick = () => logout(user);
document.getElementById('back-to-modes').onclick = () => showModeSelectionScreen(user);
}

function setupLoginScreen() {
let isEmailLogin = true, isSignUpMode = false;
const emailContainer = document.getElementById('email-login-container');
const codeContainer = document.getElementById('code-login-container');
const authTitle = document.getElementById('auth-title');
const toggleModeBtn = document.getElementById('toggle-login-mode-btn');
const toggleSignupBtn = document.getElementById('toggle-signup-btn');
const emailSubmitBtn = document.getElementById('email-submit-btn');
const codeSubmitBtn = document.getElementById('code-submit-btn');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const codeInput = document.getElementById('code-input');
const errorP = document.getElementById('auth-error');

toggleModeBtn.onclick = () => {
isEmailLogin = !isEmailLogin;
emailContainer.classList.toggle('hidden', !isEmailLogin);
codeContainer.classList.toggle('hidden', isEmailLogin);
authTitle.textContent = isEmailLogin ? 'Log In' : 'Shared Access';
toggleModeBtn.textContent = isEmailLogin ? 'Or, use a shared code' : 'Or, log in with an account';
};

toggleSignupBtn.onclick = () => {
isSignUpMode = !isSignUpMode;
authTitle.textContent = isSignUpMode ? 'Sign Up' : 'Log In';
emailSubmitBtn.textContent = isSignUpMode ? 'Create Account' : 'Log In';
toggleSignupBtn.textContent = isSignUpMode ? 'Have an account? Log In' : 'Need an account? Sign Up';
};

emailSubmitBtn.onclick = () => {
if (isSignUpMode) {
auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value).catch(err => errorP.textContent = err.message);
} else {
auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value).catch(err => errorP.textContent = err.message);
}
};

codeSubmitBtn.onclick = () => {
if (Object.values(SHARED_PASSWORDS).includes(codeInput.value)) {
sessionStorage.setItem('sharedUser', 'true');
showModeSelectionScreen(null);
} else {
errorP.textContent = 'Incorrect password.';
}
};
}

function logout(user) {
if (user) auth.signOut();
else sessionStorage.removeItem('sharedUser');
}

document.addEventListener('keydown', e => {
if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
e.preventDefault();
document.getElementById('command-palette').classList.toggle('hidden');
}
if (e.key === 'Escape') {
document.getElementById('command-palette').classList.add('hidden');
}
});