const url = "https://nyhetsbrev-kiwi.herokuapp.com"
const urlLocal = "http://localhost:3000";

//hämtar eventuell inloggad användare från localStorage
let activeUser;
let savedActiveUser = localStorage.getItem("savedActiveUser");

//kollar om det finns en inloggad användare lagrad, i så fall använd den
if (savedActiveUser) {
    activeUser = savedActiveUser
};

function getData(url, callbackFunction) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (callbackFunction) {
                callbackFunction(data)
            }
        })
}

function postData(url, dataToSend, callbackFunction) {
    fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => response.json())
        .then(data => {
            if (callbackFunction) {
                callbackFunction(data)
            }
        })
}


// let users = getData("./savedUsers", logData);

// function logData(data) {
//     console.log("svar från login", JSON.parse(data))
// }

//lite html-element jag tänker lägga in grejor i
const menu = document.getElementsByTagName("section")[0];
const contents = document.getElementsByTagName("section")[1];
const contentsHeadline = document.getElementsByTagName("h2")[1];


function login(event) {
    event.preventDefault(); //onödigt?
    let formData = new FormData(document.getElementById("loginForm"));
    const formObject = Object.fromEntries(formData.entries());
    postData(url + "/users/login", formObject, saveUser)
}

function register(event) {
    event.preventDefault(); //onödigt?
    let formData = new FormData(document.getElementById("registerForm"));
    const formObject = Object.fromEntries(formData.entries());
    postData(url + "/users", formObject, saveUser)
}

function saveUser(user) {
    user = JSON.parse(user);
    activeUser = user;
    if (user && user != "incorrect") {
        localStorage.setItem("savedActiveUser", user)
    };
    printPage(user)
};

//tre olika innehåll som kan visas i menydelen av sidan
const menuLogin =
    `<h3>Logga in</h3>
<form id="loginForm" method="post">
<label for="username">Användare:</label>
<input type="text" id="username" name="name" required>
<label for="password">Lösenord:</label>
<input type="password" id="password" name="pwd" required>
<button id="loginBtn" type="submit">logga in</button>
</form>
<br>
<span><em>eller </em><a href="javascript:void(0)">registrera dig</a></span>`;

const menuRegister =
    `<h3>Registrera dig</h3>
<form id="registerForm" method="post" />  
<label for="newUsername">Välj ett användarnamn:</label>
<input type="text" id="newUsername" name="name" />
<label for="password">Välj ett lösenord:</label>
<input type="password" id="newPassword" name="pwd" />
<label for="email">Din email:</label>
<input type="email" id="email" name="email" required />
<label for="newsletter">Ge mig nyhetsbrev </label>
<input type="checkbox" id="newsletter" name="newsletter" checked="checked" />
<br>
<button id="registerBtn" type="submit">registrera</button>
</form>
<br>
<span><em>eller</em><a href="javascript:printPage(${activeUser});"> logga in</a></span>`;

const menuLogout = "<button id='logoutBtn'>logga ut</button>";

//tre olika innehåll som kan visas i contents-delen av sidan
function contentsLoggedIn(user) {
    let welcomeTemplate = `<h3>Välkommen!</h3>
<p>
Du är inloggad som ${user}.
<br>
<form action="http://localhost:3000/newsletter" method="post">
<label for="newsletter">Vill du ha nyhetsbrev om kiwifåglar? </label>
<input type="checkbox" id="newsletter" name="news">
</form>
</p>`;
    return welcomeTemplate
}

const contentsError = `<h3>Error!</h3>
<p>
Felaktigt användarnamn eller lösenord
</p>`;

//kör funktionen för att visa innehåll första gången sidan laddas.
printPage(activeUser)

/* skriver ut olika innehåll i menu och contents-delarna beroende på om det finns en användare inloggad eller ej,
 lägger till eventlisteners som kör funktionerna login, logout och printRegisterForm*/
function printPage(activeUser) {
    console.log("activeUser: ", activeUser)
    if (activeUser == "undefined" || activeUser == undefined || activeUser == null) {
        contents.textContent = "Logga in eller registrera dig till vänster";
        menu.innerHTML = "";
        menu.insertAdjacentHTML("afterbegin", menuLogin);
        const registerLink = document.querySelector("a");
        registerLink.addEventListener("click", () => {
            menu.innerHTML = "";
            menu.insertAdjacentHTML("afterbegin", menuRegister);
            const registerForm = document.getElementById("registerForm")
            registerForm.addEventListener("submit", register);
        });
        const loginForm = document.getElementById("loginForm")
        loginForm.addEventListener("submit", login);
    } else if (activeUser === "incorrect") {
        contents.innerHTML = "";
        contents.insertAdjacentHTML("afterbegin", contentsError);
        menu.innerHTML = "";
        menu.insertAdjacentHTML("afterbegin", menuLogin);
        const registerLink = document.querySelector("a");
        registerLink.addEventListener("click", () => {
            menu.innerHTML = "";
            menu.insertAdjacentHTML("afterbegin", menuRegister)
        });
    } else {
        activeUser = activeUser.replace(/^"(.*)"$/, '$1'); //fullösning för att få bort citat
        getData(url + "/users/userData/" + activeUser, printLoggedInPage);//ibland körs denna innan posten är klar?
    }
}

function printLoggedInPage(user) {
    let currentSetting;
    if (user.newsletter) {
        currentSetting = "Prenumererar!"
    } else {
        currentSetting = "Prenumererar inte"
    }
    let welcomeTemplate = `<h3>Välkommen!</h3>
<p>
Du är inloggad som ${user.name}.
<br>
<label for="newsletter">Vill du ha nyhetsbrev om kiwifåglar? </label>
<input type="checkbox" id="newsletter" name="news">
<br>
Nuvarande inställning: <span id="setting">${currentSetting}</span>
</p>`;
    contents.innerHTML = "";
    contents.insertAdjacentHTML("afterbegin", welcomeTemplate);
    menu.innerHTML = "";
    menu.insertAdjacentHTML("afterbegin", menuLogout);
    let checkbox = document.getElementById("newsletter");
    if (user.newsletter) {
        checkbox.checked = true
    }
    checkbox.addEventListener("change", () => {
        changeNewsletter(checkbox.checked)
    })
    document.getElementById("logoutBtn").addEventListener("click", () => {
        activeUser = null;
        localStorage.removeItem("savedActiveUser");
        printPage(activeUser)
    })
}

function changeNewsletter(newSetting) {
    let savedActiveUser = localStorage.getItem("savedActiveUser");
    let prenumeration = {
        "id": savedActiveUser,
        "newsletter": newSetting
    }
    postData(url + "/users/changeNewsLetter", prenumeration, printNewsletterSetting)
}

function printNewsletterSetting(data) { //den här funktionen måste gå att ta bort
    const setting = document.getElementById("setting");
    if (data == true) {
        setting.textContent = "Prenumererar!";
    } else if (data == "error") {
        setting.textContent = "Användaren hittades inte";
    } else {
        setting.textContent = "Prenumererar inte";
    }
}