// --- 1. Variablen Setup ---
let score = 0;
let fallSpeed = 5; 
let isGameOver = false; // Schalter für den Spielstatus
const scoreDisplay = document.getElementById('score');

// Highscore aus dem Browser-Speicher laden (oder 0, falls noch leer)
let highscore = localStorage.getItem('meinSpielRekord') || 0;
document.getElementById('highscore').innerText = highscore;


// --- 2. Spieler Setup & Bewegung ---
const player = document.getElementById('player');
let playerX = 175;
const speed = 20;

document.addEventListener('keydown', function(event) {
    // Wenn das Spiel vorbei ist, blockieren wir die Steuerung
    if (isGameOver === true) return; 

    // Bewegung nach links und rechts
    if (event.key === 'ArrowLeft') {
        playerX = playerX - speed; 
    }
    else if (event.key === 'ArrowRight') {
        playerX = playerX + speed; 
    }

    // Grenzen einbauen (damit die Figur im 400px breiten Spielfeld bleibt)
    if (playerX < 0) {
        playerX = 0;
    }
    if (playerX > 350) { // 400px - 50px Spielerbreite
        playerX = 350;
    }

    player.style.left = playerX + 'px';
});


// --- 3. Fallende Objekte & Game-Loop ---
const gameContainer = document.getElementById('game-container');
let gameInterval; // Variable, um sich den Erschaffungs-Zyklus zu merken

function createFallingObject() {
    // Neues Objekt erschaffen und stylen
    const obj = document.createElement('div');
    obj.classList.add('falling-object'); 
    
    // Zufällige X-Position berechnen
    const randomX = Math.floor(Math.random() * 370);
    obj.style.left = randomX + 'px';
    
    gameContainer.appendChild(obj);
    
    // Motor für das fallende Objekt
    let objY = 0;
    const fallInterval = setInterval(function() {
        
        // Wenn das Spiel vorbei ist, Motor sofort stoppen (Einfrieren)
        if (isGameOver === true) {
            clearInterval(fallInterval);
            return; 
        }

        // Objekt nach unten bewegen
        objY = objY + fallSpeed; 
        obj.style.top = objY + 'px';
        
        // Kollisionsabfrage
        const playerRect = player.getBoundingClientRect();
        const objRect = obj.getBoundingClientRect();
        
        if (
            objRect.bottom >= playerRect.top &&
            objRect.top <= playerRect.bottom &&
            objRect.right >= playerRect.left &&
            objRect.left <= playerRect.right
        ) {
            // Treffer! Objekt gefangen
            clearInterval(fallInterval); 
            obj.remove(); 
            
            // Punkte erhöhen
            score = score + 1;
            scoreDisplay.innerText = score;
            
            // Spiel schwerer machen
            fallSpeed = fallSpeed + 0.5; 
        }
        
        // Game Over: Objekt erreicht den unteren Rand
        else if (objY > 600) {
            clearInterval(fallInterval);
            obj.remove(); 
            
            clearInterval(gameInterval); // Stoppt das Erschaffen NEUER Objekte
            isGameOver = true; // Legt den Schalter um! (Friert Steuerung und Blöcke ein)
            
            // Prüfen, ob der aktuelle Score ein neuer Rekord ist
            let isNewHighscore = false; 
            
            if (score > highscore) {
                highscore = score; 
                localStorage.setItem('meinSpielRekord', highscore); 
                document.getElementById('highscore').innerText = highscore; 
                isNewHighscore = true; 
            }
            
            // Endbildschirm-Werte eintragen
            document.getElementById('final-score').innerText = score;
            document.getElementById('final-highscore').innerText = highscore; 
            
            // Jubel-Meldung einblenden, FALLS es ein neuer Rekord ist
            if (isNewHighscore === true) {
                document.getElementById('new-highscore-msg').style.display = 'block';
            } else {
                document.getElementById('new-highscore-msg').style.display = 'none'; 
            }

            // Endbildschirm sichtbar machen
            document.getElementById('game-over-screen').style.display = 'flex'; 
        }
    }, 50); 
}


// --- 4. Start- & Restart-Logik (Buttons) ---
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');

startButton.addEventListener('click', function() {
    startScreen.style.display = 'none'; // Vorhang ausblenden
    
    // Die Schleife starten, die alle 2 Sekunden ein Objekt erschafft
    gameInterval = setInterval(createFallingObject, 2000); 
});

// Restart Button
document.getElementById('restart-button').addEventListener('click', function() {
    location.reload(); // Lädt die Seite neu
});