## En websida med login och registrering av användare
Med Node, express, MongoDB, crypto.js

### hur du startar projektet lokalt:
1) ladda ner projektmappen och öppna html-filen med live server plugin t ex i visual studio code
2) sidan hämtar nu data från en node.js express-app som ligger online på heroku samt från databas på mongoDBAtlas
3) ladda ner backend-repot på https://github.com/rebecka-oscarsson/nyhetsbrev-back och följ instruktioner
4) ändra konstanten längst upp i script.js så att const url = "http://localhost:3000"
5) Vill du även ha en lokal mongoDB behöver du ändra const mongoUrl längst upp i app.js-filen i backend-repot till adressen till din lokala databas.
Databasen heter "nyhetsbrev" och collection "users".

### hur du ser projektet online:
1) Gå till https://rebecka-oscarsson.github.io/nyhetsbrev/
2) Du kan skapa användare och ändra prenumeration
3) Två användare bör redan finnas, musse med lösenord pigg samt kalle lösenord anka
