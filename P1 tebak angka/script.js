// Variabel untuk menyimpan angka rahasia
let correctNumber;
let gameActive = true;

// Ambil elemen-elemen dari HTML
const guessInput = document.getElementById('guessInput');
const checkButton = document.getElementById('checkButton');
const resultMessage = document.getElementById('resultMessage');
const playAgainButton = document.getElementById('playAgainButton');

// Fungsi untuk memulai atau mereset game
function initializeGame() {
    // 1. Menghasilkan angka acak antara 1 dan 10
    correctNumber = Math.floor(Math.random() * 10) + 1;
    gameActive = true;
    
    // Reset tampilan
    resultMessage.textContent = 'Menunggu tebakan...';
    resultMessage.classList.remove('error-message');
    guessInput.value = '';
    guessInput.disabled = false;
    checkButton.disabled = false;
    playAgainButton.classList.add('hidden');
    guessInput.focus();
    
    console.log("Angka rahasia (untuk debugging): " + correctNumber);
}

// Fungsi untuk memeriksa tebakan
function checkGuess() {
    if (!gameActive) return;

    // Ambil nilai dari input dan konversi ke angka
    const guessedNumber = parseInt(guessInput.value);

    // 2. Memeriksa validitas input
    if (isNaN(guessedNumber) || guessedNumber < 1 || guessedNumber > 10){
        resultMessage.textContent = 'Masukkan angka yang valid antara 1 dan 10!';
        resultMessage.classList.add('error-message');
        return;
    }
    
    // 3. Logika permainan menggunakan if
    if (guessedNumber === correctNumber) {
        // Tebakan Benar
        resultMessage.textContent = `SELAMAT! Angka yang benar adalah ${correctNumber}.`;
        resultMessage.classList.remove('error-message');
       endGame(true);
        
    } else {
        // Tebakan Salah (Meniru tampilan gambar)
        resultMessage.innerHTML = `Tebakan Anda salah. Angka yang benar adalah ${correctNumber}.`;
        resultMessage.classList.add('error-message');
        endGame(false); 
    }
}


// Fungsi untuk mengakhiri sesi tebakan (mengunci input dan menampilkan tombol main lagi)
function endGame(isCorrect) {
    gameActive = false;
    guessInput.disabled = true;
    checkButton.disabled = true;
    playAgainButton.classList.remove('hidden');
}

// Event Listeners
checkButton.addEventListener('click', checkGuess);
playAgainButton.addEventListener('click', initializeGame);

// Juga memungkinkan tebakan dengan menekan Enter
guessInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        checkGuess();
    }
});

// Inisialisasi game saat halaman dimuat
initializeGame();