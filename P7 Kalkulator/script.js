// =====================================================
// KALKULATOR - script.js
// Alur: tombol ditekan -> ubah variabel `ekspresi` -> tampilkan()
// =====================================================


// ---------- 1. Ambil elemen HTML yang akan dipakai ----------
const elEkspresi = document.getElementById('ekspresi');
const elHasil = document.getElementById('hasil');
const elPapan = document.getElementById('papan-tombol');
const elRiwayat = document.getElementById('riwayat');
const elDaftarRiwayat = document.getElementById('daftar-riwayat');


// ---------- 2. Data (state) ----------
let ekspresi = '';          // teks yang diketik, contoh: "12+3×4"
let selesaiHitung = false;  // true jika baru saja menekan "="
let hasilTerakhir = '';     // hasil pratinjau terakhir yang valid
let riwayat = [];           // daftar perhitungan sebelumnya

// Muat riwayat dari localStorage (penyimpanan browser).
// try/catch dipakai agar tidak error jika penyimpanan diblokir.
try {
  riwayat = JSON.parse(localStorage.getItem('riwayat-kalkulator')) || [];
} catch (e) {
  riwayat = [];
}

function simpanRiwayat() {
  try {
    localStorage.setItem('riwayat-kalkulator', JSON.stringify(riwayat.slice(0, 50)));
  } catch (e) { /* abaikan */ }
}


// ---------- 3. Fungsi bantu ----------

// Apakah karakter ini angka 0-9?
function adalahAngka(karakter) {
  return /\d/.test(karakter);
}

// Apakah karakter ini operator + - × ÷ ?
function adalahOperator(karakter) {
  return "+-×÷".includes(karakter)
}

// Ambil karakter terakhir dari ekspresi ('' jika kosong)
function karakterAkhir() {
  return ekspresi.slice(-1);
}

// Ambil angka yang sedang diketik di ujung ekspresi.
// Contoh: "12+3.5" -> "3.5"
function angkaTerakhir() {
  const cocok = ekspresi.match(/[\d.]+$/); // [\d.]+$ = angka/titik di akhir teks
  return cocok ? cocok[0] : '';
}

// Hitung berapa kali sebuah karakter muncul di teks
function hitungKarakter(teks, karakter) {
  return teks.split(karakter).length - 1;
}

// Siapkan ekspresi untuk dihitung:
// 1) buang operator di akhir ("5+" -> "5")
// 2) tutup kurung yang belum ditutup ("(2+3" -> "(2+3)")
function rapikan(teks) {
  while (teks !== '' && adalahOperator(teks.slice(-1))) {
    teks = teks.slice(0, -1);
  }
  const kurangTutup = hitungKarakter(teks, '(') - hitungKarakter(teks, ')');
  for (let i = 0; i < kurangTutup; i++) {
    teks += ')';
  }
  return teks;
}

// Hitung ekspresi menjadi angka.
// Caranya: ubah simbol kita menjadi simbol JavaScript, lalu jalankan.
// Aman karena isi ekspresi hanya berasal dari tombol kalkulator ini.
function hitung(teks) {
  const kodeJS = teks
    .replace(/×/g, '*')     // × menjadi *
    .replace(/÷/g, '/')     // ÷ menjadi /
    .replace(/%/g, '/100'); // 50% menjadi 50/100
  return new Function('return (' + kodeJS + ')')();
}

// Ubah angka menjadi teks berformat Indonesia: 1234.5 -> "1.234,5"
function formatAngka(angka) {
  angka = Number(angka.toPrecision(12)); // bulatkan, agar 0.1+0.2 = 0.3
  return angka.toLocaleString('id-ID', { maximumFractionDigits: 10 });
}

// Beri titik ribuan dan koma desimal pada ekspresi yang ditampilkan.
// Contoh: "1234.5+2" -> "1.234,5+2"
function formatEkspresi(teks) {
  return teks
    .replace(/\d+(\.\d*)?|\.\d+/g, function (angka) {
      const bagian = angka.split('.');                                  // pisah desimal
      const bulat = bagian[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');    // titik tiap 3 digit
      const desimal = bagian.length > 1 ? ',' + bagian[1] : '';
      return (bulat || '0') + desimal;
    })
    .replace(/-/g, '−'); // tanda minus yang lebih panjang
}


// ---------- 4. Menampilkan ke layar ----------

// Tulis teks ke layar, dan atur ukuran font sesuai panjang hasil
function tulisLayar(teksEkspresi, teksHasil, error) {
  elEkspresi.textContent = teksEkspresi;
  elHasil.textContent = teksHasil;

  let kelas = 'hasil';
  if (error) kelas += ' error';
  else if (teksHasil.length > 14) kelas += ' kecil';
  else if (teksHasil.length > 9) kelas += ' sedang';
  elHasil.className = kelas;
}

// Perbarui layar berdasarkan isi `ekspresi` (dipanggil setelah setiap tombol)
function tampilkan() {
  if (ekspresi === '') {
    tulisLayar('', '0', false);
    return;
  }

  // Pratinjau hasil langsung saat mengetik
  let pratinjau = hasilTerakhir;
  const siap = rapikan(ekspresi);
  if (adalahAngka(siap.replace(/[^\d]/g, ''))) {   // ada minimal satu angka?
    try {
      const nilai = hitung(siap);
      if (isFinite(nilai)) {
        pratinjau = formatAngka(nilai);
        hasilTerakhir = pratinjau;
      } else {
        pratinjau = 'Tidak bisa dibagi 0';
      }
    } catch (e) {
      // ekspresi belum lengkap: pakai pratinjau sebelumnya
    }
  } else {
    pratinjau = '';
  }

  tulisLayar(formatEkspresi(ekspresi), pratinjau, pratinjau === 'Tidak bisa dibagi 0');
}


// ---------- 5. Aksi tiap jenis tombol ----------

function tekanAngka(angka) {
  if (selesaiHitung) {            // setelah "=", mengetik angka memulai hitungan baru
    ekspresi = '';
    selesaiHitung = false;
  }
  if (karakterAkhir() === ')' || karakterAkhir() === '%') {
    ekspresi += '×';              // "(2)3" dianggap "(2)×3"
  }
  if (angkaTerakhir() === '0') {
    ekspresi = ekspresi.slice(0, -1); // ganti "0" tunggal, supaya tidak jadi "05"
  }
  ekspresi += angka;
}

function tekanTitik() {
  if (selesaiHitung) {
    ekspresi = '';
    selesaiHitung = false;
  }
  if (angkaTerakhir().includes('.')) return; // satu angka hanya boleh punya satu titik
  if (!adalahAngka(karakterAkhir())) {
    if (karakterAkhir() === ')' || karakterAkhir() === '%') ekspresi += '×';
    ekspresi += '0';               // "." di awal menjadi "0."
  }
  ekspresi += '.';
}

function tekanOperator(operator) {
  selesaiHitung = false;           // lanjutkan perhitungan dari hasil sebelumnya

  if (ekspresi === '') {           // kosong: hanya "−" yang boleh (angka negatif)
    if (operator === '-') ekspresi = '-';
    return;
  }

  if (adalahOperator(karakterAkhir())) {
    if (ekspresi.length === 1) return;        // hanya "-": abaikan
    ekspresi = ekspresi.slice(0, -1);         // ganti operator sebelumnya
  } else if (karakterAkhir() === '(' && operator !== '-') {
    return;                                   // "(+" tidak valid
  }
  ekspresi += operator;
}

function tekanKurungBuka() {
  if (selesaiHitung) {
    ekspresi = '';
    selesaiHitung = false;
  }
  const akhir = karakterAkhir();
  if (adalahAngka(akhir) || akhir === ')' || akhir === '%') {
    ekspresi += '×';               // "2(" dianggap "2×("
  }
  ekspresi += '(';
}

function tekanKurungTutup() {
  const adaYangBelumDitutup = hitungKarakter(ekspresi, '(') > hitungKarakter(ekspresi, ')');
  const akhir = karakterAkhir();
  if (adaYangBelumDitutup && (adalahAngka(akhir) || akhir === ')' || akhir === '%')) {
    ekspresi += ')';
  }
}

function tekanPersen() {
  selesaiHitung = false;
  if (adalahAngka(karakterAkhir()) || karakterAkhir() === ')') {
    ekspresi += '%';
  }
}

function hapusSatu() {
  selesaiHitung = false;
  ekspresi = ekspresi.slice(0, -1); // buang karakter terakhir
}

function hapusSemua() {
  ekspresi = '';
  selesaiHitung = false;
  hasilTerakhir = '';
}

function tekanSamaDengan() {
  if (ekspresi === '') return;

  const siap = rapikan(ekspresi);
  try {
    const nilai = hitung(siap);

    if (!isFinite(nilai)) {                       // contoh: 5 ÷ 0
      tulisLayar(formatEkspresi(siap), 'Tidak bisa dibagi 0', true);
      return;
    }

    const teksHasil = formatAngka(nilai);

    // Simpan ke riwayat (terbaru di paling atas)
    riwayat.unshift({
      ekspresi: formatEkspresi(siap),
      hasil: teksHasil,
      nilai: String(Number(nilai.toPrecision(12)))
    });
    simpanRiwayat();

    // Hasil menjadi ekspresi baru, supaya bisa dilanjutkan (mis. tekan "+")
    const nilaiBaru = String(Number(nilai.toPrecision(12)));
    ekspresi = nilaiBaru.includes('e') ? '' : nilaiBaru; // angka sangat besar/kecil: kosongkan
    selesaiHitung = true;
    hasilTerakhir = teksHasil;

    tulisLayar(formatEkspresi(siap), teksHasil, false);
  } catch (e) {
    tulisLayar(formatEkspresi(ekspresi), 'Format tidak valid', true);
  }
}


// ---------- 6. Pusat pengatur tombol ----------
// Semua tombol lewat sini. `tombol` berisi nilai dari data-tombol di HTML.
function tekanTombol(tombol) {
  if (adalahAngka(tombol))      tekanAngka(tombol);
  else if (tombol === '.')      tekanTitik();
  else if (adalahOperator(tombol)) tekanOperator(tombol);
  else if (tombol === '(')      tekanKurungBuka();
  else if (tombol === ')')      tekanKurungTutup();
  else if (tombol === '%')      tekanPersen();
  else if (tombol === 'hapus')  hapusSatu();
  else if (tombol === 'C')      hapusSemua();
  else if (tombol === '=')      { tekanSamaDengan(); return; } // "=" sudah menulis layar sendiri

  tampilkan();
}


// ---------- 7. Event: klik tombol & tahan hapus ----------

// Satu listener di papan tombol untuk semua tombol (disebut "event delegation")
let timerTahan = null;   // timer untuk deteksi tahan lama
let sudahDitahan = false;

elPapan.addEventListener('click', function (e) {
  const tombol = e.target.closest('button');
  if (!tombol) return;

  // Jika tombol hapus baru saja ditahan lama, jangan hapus satu karakter lagi
  if (tombol.dataset.tombol === 'hapus' && sudahDitahan) {
    sudahDitahan = false;
    return;
  }
  tekanTombol(tombol.dataset.tombol);
});

// Tahan tombol hapus 0,5 detik -> hapus semua
elPapan.addEventListener('pointerdown', function (e) {
  const tombol = e.target.closest('button');
  if (!tombol || tombol.dataset.tombol !== 'hapus') return;

  sudahDitahan = false;
  clearTimeout(timerTahan);
  timerTahan = setTimeout(function () {
    sudahDitahan = true;
    tekanTombol('C');
  }, 500);
});

// Jika jari/mouse dilepas atau keluar dari tombol, batalkan timer
['pointerup', 'pointerleave', 'pointercancel'].forEach(function (nama) {
  elPapan.addEventListener(nama, function () { clearTimeout(timerTahan); });
});

// Cegah menu klik-kanan/tahan bawaan browser di papan tombol
elPapan.addEventListener('contextmenu', function (e) { e.preventDefault(); });

// Dukungan keyboard
document.addEventListener('keydown', function (e) {
  if (elRiwayat.classList.contains('tampil')) return; // abaikan saat riwayat terbuka
  const k = e.key;

  if (adalahAngka(k) || k === '(' || k === ')' || k === '%' || k === '+' || k === '-') tekanTombol(k);
  else if (k === '.' || k === ',') tekanTombol('.');
  else if (k === '*' || k === 'x') tekanTombol('×');
  else if (k === '/')              { e.preventDefault(); tekanTombol('÷'); }
  else if (k === 'Enter' || k === '=') { e.preventDefault(); tekanTombol('='); }
  else if (k === 'Backspace')      tekanTombol('hapus');
  else if (k === 'Escape' || k === 'Delete') tekanTombol('C');
});


// ---------- 8. Riwayat & tombol Salin ----------

function bukaRiwayat() {
  elDaftarRiwayat.innerHTML = '';

  if (riwayat.length === 0) {
    elDaftarRiwayat.innerHTML = '<div class="kosong">Belum ada riwayat</div>';
  }

  riwayat.forEach(function (item) {
    const baris = document.createElement('div');
    baris.className = 'item-riwayat';

    const kecil = document.createElement('small');
    kecil.textContent = item.ekspresi + ' =';
    const tebal = document.createElement('b');
    tebal.textContent = item.hasil;
    baris.append(kecil, tebal);

    // Ketuk item riwayat -> pakai hasilnya lagi
    baris.addEventListener('click', function () {
      ekspresi = item.nilai;
      selesaiHitung = true;
      hasilTerakhir = item.hasil;
      elRiwayat.classList.remove('tampil');
      tulisLayar('', item.hasil, false);
    });

    elDaftarRiwayat.appendChild(baris);
  });

  elRiwayat.classList.add('tampil');
}

document.getElementById('btn-riwayat').addEventListener('click', bukaRiwayat);

document.getElementById('btn-tutup-riwayat').addEventListener('click', function () {
  elRiwayat.classList.remove('tampil');
});

document.getElementById('btn-hapus-riwayat').addEventListener('click', function () {
  riwayat = [];
  simpanRiwayat();
  bukaRiwayat(); // gambar ulang daftar yang sudah kosong
});

document.getElementById('btn-salin').addEventListener('click', function () {
  const tombolSalin = document.getElementById('btn-salin');
  navigator.clipboard.writeText(elHasil.textContent).then(function () {
    tombolSalin.textContent = 'Tersalin';
    setTimeout(function () { tombolSalin.textContent = 'Salin'; }, 1200);
  });
});


// ---------- 9. Tampilan awal ----------
tampilkan();