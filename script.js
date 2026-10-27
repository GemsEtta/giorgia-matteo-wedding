/* ==========================
   PASSWORD
========================== */
const passwordScreen = document.getElementById("password-screen");
const siteContent = document.getElementById("site-content");
const passwordError = document.getElementById("password-error");

function checkPassword(){
    const password = document.getElementById("site-password").value.trim();

    if(password.toUpperCase() === "GM"){
        passwordScreen.style.display = "none";
        siteContent.style.display = "block";
        window.scrollTo(0, 0);
        updateMenuColor();
    }else{
        passwordError.textContent = "Password non corretta. Riprova.";
    }
}

passwordScreen.addEventListener("submit", (e) => {
    e.preventDefault();
    checkPassword();
});

/* ==========================
   SCRITTA
========================== */
document.getElementById("typing").innerHTML = "Giorgia & Matteo<br>si sposano";

/* ==========================
   MENU LATERALE
========================== */
const menuButton = document.querySelector(".menu-button");
const menuPanel = document.querySelector(".menu-panel");
const countdownSection = document.getElementById("countdown");

function setMenu(aperto){
    menuPanel.classList.toggle("active", aperto);
    menuButton.classList.toggle("open", aperto);
    menuButton.setAttribute("aria-expanded", aperto);
}

menuButton.addEventListener("click", () => {
    setMenu(!menuPanel.classList.contains("active"));
});

document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") setMenu(false);
});

document.querySelectorAll(".menu-panel a").forEach(link => {
    link.addEventListener("click", () => setMenu(false));
});

/* Menu bianco SOLO mentre si e' nella sezione countdown */
function updateMenuColor(){
    const inizio = countdownSection.offsetTop - 100;
    const fine = countdownSection.offsetTop + countdownSection.offsetHeight - 100;
    const chiaro = window.scrollY >= inizio && window.scrollY < fine;

    menuButton.classList.toggle("light", chiaro);
    menuButton.classList.toggle("dark", !chiaro);
}

window.addEventListener("scroll", updateMenuColor, { passive: true });

/* ==========================
   ANIMAZIONE INVITO
========================== */
const invitationSection = document.querySelector(".invitation-section");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        invitationSection.classList.toggle("show", entry.isIntersecting);
    });
}, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });   /* parte quando l'invito arriva a meta' schermo */

observer.observe(invitationSection);

/* ==========================
   COUNTDOWN
========================== */
/* Punta alla cerimonia (11:00). Per l'orario del pranzo usa T15:00:00 */
const weddingDate = new Date("2027-09-12T11:00:00").getTime();

function updateCountdown(){
    const distance = Math.max(weddingDate - Date.now(), 0);

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ==========================
   RSVP DINAMICA
========================== */
const guestDetails = document.getElementById("guest-details");
const partecipantiList = document.getElementById("partecipanti-list");
const dietDetails = document.getElementById("diet-details");
const note = document.getElementById("note");

function creaCampoAccompagnatore(){
    const numero = document.querySelectorAll(".guest-name").length + 1;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "guest-name";
    input.placeholder = "Nome e Cognome accompagnatore " + numero;
    input.required = true;

    partecipantiList.appendChild(input);
}

document.getElementById("addGuest").addEventListener("click", creaCampoAccompagnatore);

document.getElementById("removeGuest").addEventListener("click", () => {
    const ospiti = document.querySelectorAll(".guest-name");

    if(ospiti.length > 1){
        ospiti[ospiti.length - 1].remove();
    }
});

function aggiornaForm(valore){
    const conAccompagnatori = valore === "accompagnatori";
    const presente = valore !== "assente";

    guestDetails.classList.toggle("hidden", !conAccompagnatori);
    dietDetails.classList.toggle("hidden", !presente);
    note.required = presente;

    if(conAccompagnatori){
        if(partecipantiList.children.length === 0){
            creaCampoAccompagnatore();
        }
    }else{
        partecipantiList.innerHTML = "";
    }

    if(!presente){
        note.value = "";
    }
}

document.querySelectorAll('input[name="presenza"]').forEach(radio => {
    radio.addEventListener("change", () => {
        if(radio.checked) aggiornaForm(radio.value);
    });
});

/* ==========================
   INVIO RSVP
========================== */
const rsvpForm = document.getElementById("rsvp-form");

rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const bottone = rsvpForm.querySelector('button[type="submit"]');
    bottone.disabled = true;   /* evita doppi invii */

    const presenza =
        document.querySelector('input[name="presenza"]:checked')?.value || "";

    const ospiti = [];
    document.querySelectorAll(".guest-name").forEach(campo => {
        if(campo.value.trim() !== ""){
            ospiti.push(campo.value.trim());
        }
    });

    const dati = {
        nome: document.getElementById("nome").value,
        nomiPartecipanti: ospiti.join(" | "),
        email: document.getElementById("email").value,
        presenza: presenza,
        partecipanti:
            presenza === "solo" ? 1
            : presenza === "assente" ? 0
            : document.querySelectorAll(".guest-name").length + 1,
        note: note.value || ""
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
    <div class="success-icon">💌</div>
    <h2>Grazie!</h2>
    <p>Abbiamo ricevuto la tua conferma.</p>
    <p>Siamo felici di poter condividere con te questo giorno speciale.</p>
    <p>Ci vediamo il 12 Settembre 2027.</p>
    <span>Giorgia &amp; Matteo</span>
</div>`;
    }catch(err){
        bottone.disabled = false;
        alert("Si è verificato un errore. Riprova tra qualche istante.");
        console.error(err);
    }
});


/* ==========================
  LISTA NOZZE
========================== */
function selectGift(category, iban, causale) {
    // Rimuove classe active da tutte le card
    document.querySelectorAll('.gift-card').forEach(card => card.classList.remove('active'));
    
    // Evidenzia la card cliccata
    event.currentTarget.classList.add('active');
    
    // Mostra il box IBAN
    const displayBox = document.getElementById('iban-display');
    displayBox.classList.remove('hidden');
    
    // Aggiorna i testi
    document.getElementById('cat-title').innerText = "Regalo Selezionato: " + category.toUpperCase();
    document.getElementById('iban-code').innerText = iban;
    document.getElementById('causale-text').innerText = causale;
}

function copyIbanToClipboard() {
    const iban = document.getElementById('iban-code').innerText;
    navigator.clipboard.writeText(iban).then(() => {
        alert("IBAN copiato negli appunti!");
    });
}