// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// let activeUser = urlParams.get("id");
//är det ok att skicka använar id:t här? tror det

//hämtar eventuell inloggad användare från localStorage
let activeUser;
let savedActiveUser = localStorage.getItem("savedActiveUser");
//problem: denna hämtas och skriver över


//kollar om det finns en inloggad användare lagrad, i så fall använd den
if (savedActiveUser) {
    activeUser = savedActiveUser
};

// localStorage.setItem("savedActiveUser", activeUser);
//skicka ett id på inloggad anv och spara i localstorage. sedan använd för att hämta användarnamn och nyhetsbrev

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
// let activeUser = getData("./activeUser", logData);

function logData(data) {
    console.log("svar från login", JSON.parse(data))
}

//hämtar eventuella sparade användare samt inloggad användare från localStorage
// let activeUser;
// let savedActiveUser = localStorage.getItem("savedActiveUser");
// let savedUsers = JSON.parse(localStorage.getItem("savedUsers"));

//kollar om det finns en inloggad användare lagrad, i så fall använd den
// if (savedActiveUser) {
//     activeUser = savedActiveUser
// };

//kollar om det finns en array av sparade användare, i så fall använd den
// if (savedUsers) {
//     users = savedUsers
// };


//lite html-element jag tänker lägga in grejor i
const menu = document.getElementsByTagName("section")[0];
const contents = document.getElementsByTagName("section")[1];
const contentsHeadline = document.getElementsByTagName("h2")[1];


function login(event){
    event.preventDefault();//onödigt?
    let formData = new FormData(document.getElementById("loginForm"));
    const formObject = Object.fromEntries(formData.entries());
    postData("http://localhost:3000/users/login", formObject, saveUser)
}

function saveUser(user) {user = JSON.parse(user); alert(user); activeUser = user; if(user && user!="incorrect"){localStorage.setItem("savedActiveUser", user)};
 printPage(user)};


//tre olika innehåll som kan visas i menydelen av sidan
const menuLogin =//ändra så att det ligger en eventlistener på loginBtn.action="http://localhost:3000/users/login" method="post"
    `<h3>Logga in</h3><label for="username">Användare:</label>
<form id="loginForm" method="post">
<input type="text" id="username" name="name" required>
<label for="password">Lösenord:</label>
<input type="password" id="password" name="pwd" required>
<button id="loginBtn" type="submit">logga in</button>
</form>
<br>
<em>eller</em><br><a href="javascript:void(0)">registrera ny användare</a>`;

const menuRegister =
    `<h3>Registrera dig</h3>
<form action="http://localhost:3000/users" method="post" />
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
</form>`;

const menuLogout = "<a href ='http://localhost:3000/users/logout'><button id='logoutBtn'>logga ut</button></a>";

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

//kör funktionen för att visa innehåll första gången sidan laddas. jag tror den ska bytas ut så den hämtar från localstorage
// getData("http://localhost:3000/users/activeUser", printPage)
printPage(activeUser)

/* skriver ut olika innehåll i menu och contents-delarna beroende på om det finns en användare inloggad eller ej,
 lägger till eventlisteners som kör funktionerna login, logout och printRegisterForm*/
function printPage(activeUser) {
    console.log("activeUser: ", activeUser)
    if (activeUser=="undefined"||activeUser==undefined||activeUser==null) {
        contents.textContent = "Logga in eller registrera dig till vänster";
        menu.innerHTML = "";
        menu.insertAdjacentHTML("afterbegin", menuLogin);
        const registerLink = document.querySelector("a");
        registerLink.addEventListener("click", () => {
            menu.innerHTML = "";
            menu.insertAdjacentHTML("afterbegin", menuRegister)
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
        activeUser = activeUser.replace(/^"(.*)"$/, '$1');//fullösning för att få bort citat
        getData("http://localhost:3000/users/userData/" + activeUser, printLoggedInPage);
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
    document.getElementById("logoutBtn").addEventListener("click", ()=>{activeUser=null; localStorage.removeItem("savedActiveUser")})
}

function changeNewsletter(newSetting) {
    let savedActiveUser = localStorage.getItem("savedActiveUser");
    let prenumeration = {
        "id": savedActiveUser,
        "newsletter": newSetting
    }

    postData("http://localhost:3000/users/changeNewsLetter", prenumeration, printNewsletterSetting)

    // fetch("http://localhost:3000/users/changeNewsLetter", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(prenumeration)
    //     })
    //     .then(res => res.json())
    //     .then(data => {
    //         const setting = document.getElementById("setting");
    //         if (data==true) {
    //             setting.textContent = "Prenumererar!";
    //         }
    //         else if (data =="error") {
    //             setting.textContent = "Användaren hittades inte";
    //         }
    //         else {
    //             setting.textContent = "Prenumererar inte";
    //         }
    //     });
}

function printNewsletterSetting(data){//den här funktionen måste gå att ta bort
    const setting = document.getElementById("setting");
    if (data==true) {
        setting.textContent = "Prenumererar!";
    }
    else if (data =="error") {
        setting.textContent = "Användaren hittades inte";
    }
    else {
        setting.textContent = "Prenumererar inte";
    }
}