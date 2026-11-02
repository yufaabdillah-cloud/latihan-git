const result = document.getElementById('result');
const buttons = document.querySelectorAll('.choices button');
const resetButton = document.getElementById('resetButton');
const choices = ['batu', 'gunting', 'kertas'];

// Tambahkan event listener untuk setiap tombol pilihan
buttons.forEach(button => {
  button.addEventListener('click', () => playGame(button.id));
});

function playGame(playerChoice) {
  const computerChoice = choices[Math.floor(Math.random() * 3)];
  let message = `Kamu pilih ${playerChoice} — Komputer pilih ${computerChoice} <br>`;

  if (playerChoice === computerChoice) {
    message  += "⚖️ Hasil: Seri!";
  } else if (
    (playerChoice === 'batu' && computerChoice === 'gunting') ||
    (playerChoice === 'gunting' && computerChoice === 'kertas') ||
    (playerChoice === 'kertas' && computerChoice === 'batu')
  ) {
    message += "🎉 Kamu Menang!";
  } else {
    message += "😢 Kamu Kalah!";
  }

    result.innerHTML = message;
}

// Tombol reset
resetButton.addEventListener('click', () => {
  result.innerHTML = "Pilih untuk mulai bermain!";
});
