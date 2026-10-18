/* ==========================
   GM
========================== */
function checkPassword(){

    const password =
        document.getElementById("site-password").value;

    if(password === "GM"){

        document.getElementById("password-screen")
            .style.display = "none";

        document.getElementById("site-content")
            .style.display = "block";

    }else{

        alert("Password non corretta");

    }

}

/* ==========================
   SCRITTA
========================== */
document.getElementById("typing").innerHTML =
"Giorgia & Matteo<br>si sposano";

/* ==========================
   MENU LATERALE
========================== */
const menuButton =
document.querySelector(".menu-button");

const menuPanel =
document.querySelector(".menu-panel");

menuButton.addEventListener("click", () => {

    menuPanel.classList.toggle("active");

});

/* CAMBIO COLORE MENU */

window.addEventListener("scroll", () => {

    const countdown =
    document.getElementById("countdown");

    const countdownTop =
    countdown.offsetTop;

    if(window.scrollY >= countdownTop - 100){

        menuButton.classList.remove("dark");

        menuButton.classList.add("light");

    }else{

        menuButton.classList.remove("light");

        menuButton.classList.add("dark");

    }

});


const menuLinks =
document.querySelectorAll(".menu-panel a");

menuLinks.forEach(link => {

    link.addEventListener("click", () => {

        menuPanel.classList.remove("active");

    });

});

/* ==========================
   ANIMAZIONE INVITI
========================== */
const invitationSection =
document.querySelector(".invitation-section");

const observer =
new IntersectionObserver((entries)=>{

    entries.forEach(entry => {

        if(entry.isIntersecting){

            invitationSection.classList.add("show");

        }else{

            invitationSection.classList.remove("show");

        }

    });

},{
    threshold:0.4
});

observer.observe(invitationSection);

/* ==========================
   COUNTDOWN
========================== */
const weddingDate =
new Date("2027-09-12T15:00:00").getTime();

function updateCountdown(){

    const now = new Date().getTime();

    const distance =
    weddingDate - now;

    const days =
    Math.floor(
    distance / (1000 * 60 * 60 * 24)
    );

    const hours =
    Math.floor(
    (distance %
    (1000 * 60 * 60 * 24))
    /
    (1000 * 60 * 60)
    );

    const minutes =
    Math.floor(
    (distance %
    (1000 * 60 * 60))
    /
    (1000 * 60)
    );

    const seconds =
    Math.floor(
    (distance %
    (1000 * 60))
    /
    1000
    );

    document.getElementById("days").innerText =
    days;

    document.getElementById("hours").innerText =
    hours;

    document.getElementById("minutes").innerText =
    minutes;

    document.getElementById("seconds").innerText =
    seconds;
}

updateCountdown();

setInterval(updateCountdown,1000);



//*SITO E FORM*//
const form = document.getElementById("rsvp-form");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const presenza =
        document.querySelector(
            'input[name="presenza"]:checked'
        )?.value || "";
    
        console.log(document.getElementById("nome"));
console.log(document.getElementById("email"));
console.log(document.getElementById("note"));

    const ospiti = [];

document
.querySelectorAll(".guest-name")
.forEach(campo => {

    if(campo.value.trim() !== "")
    {
        ospiti.push(campo.value.trim());
    }

});

    const dati = {

        nome:
            document.getElementById("nome").value,


        nomiPartecipanti:
    ospiti.join(" | "),

        email:
            document.getElementById("email").value,

         presenza:
        presenza,

        partecipanti:

        presenza === "solo"
        ? 1

        : presenza === "assente"
        ? 0

        : document.querySelectorAll(".guest-name").length + 1,

        note:
        document.getElementById("note")?.value || ""

    };

    try {

        await fetch(
            "https://script.google.com/macros/s/AKfycbzxjvZqiwv1c6fvGO62p_ZfVLtJq8jAGNhYPctFdQhTVROmruUqdIeI3NcwfC_EGkrcPw/exec",
            {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(dati)
            }
        );

       document.getElementById("rsvp").innerHTML = `

<div class="rsvp-success">

    <div class="success-icon"></div>

    <h2>Grazie!</h2>

    <p>
        Abbiamo ricevuto la tua conferma.
    </p>

    <p>
        Siamo felici di poter condividere con te
        questo giorno speciale.
    </p>

    <p>
        Ci vediamo il 12 Settembre 2027.
    </p>

    <span>
        Giorgia & Matteo
    </span>

</div>

`;
    } catch (err) {

        alert("Si è verificato un errore.");

        console.error(err);

    }

});

/* ==========================
   RSVP DINAMICA
========================== */

const guestDetails =
document.getElementById("guest-details");

const partecipantiList =
document.getElementById("partecipanti-list");

const addGuest =
document.getElementById("addGuest");

const removeGuest =
document.getElementById("removeGuest");

function creaCampoAccompagnatore(){

    const numero =
        document.querySelectorAll(".guest-name").length + 1;

    const input =
        document.createElement("input");

    input.type = "text";

    input.className = "guest-name";

    input.placeholder =
    "Nome e Cognome accompagnatore " + numero;

    input.required = true;

    partecipantiList.appendChild(input);

}

addGuest.addEventListener("click", () => {

    creaCampoAccompagnatore();

});

removeGuest.addEventListener("click", () => {

    const ospiti =
        document.querySelectorAll(".guest-name");

    if(ospiti.length > 1){

        ospiti[ospiti.length - 1].remove();

    }

});

const dietDetails =
document.getElementById("diet-details");

const note =
document.getElementById("note");

document
.querySelectorAll('input[name="presenza"]')
.forEach(radio => {

    radio.addEventListener("change", () => {

 if (
    radio.checked &&
    radio.value === "accompagnatori"
) {
    if(
    partecipantiList.children.length === 0
){

    creaCampoAccompagnatore();

}

    guestDetails.style.display = "block";
    dietDetails.style.display = "block";
    note.required = true;

}

else if (
    radio.checked &&
    radio.value === "solo"
) {

    guestDetails.style.display = "none";
    dietDetails.style.display = "block";

    partecipantiList.innerHTML = "";

    note.required = true;

}

else if (
    radio.checked &&
    radio.value === "assente"
) {

    guestDetails.style.display = "none";
    dietDetails.style.display = "none";

    partecipantiList.innerHTML = "";
    guestDetails.querySelectorAll(".guest-name")
    .forEach(campo => campo.value = "");
    note.value = "";
    note.required = false;

}

    });

});