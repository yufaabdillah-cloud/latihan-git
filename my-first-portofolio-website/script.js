// Mengambil tombol dari HTML
const tombolHalo = document.getElementById("tombolHalo");

// Mengambil tempat untuk menampilkan pesan
const pesan = document.getElementById("pesan");

// Menjalankan kode ketika tombol diklik
tombolHalo.addEventListener("click", function () {
    pesan.textContent = "Terima kasih sudah mengunjungi website saya!";
});

// Mengambil tahun saat ini dari komputer
const tahun = document.getElementById("tahun");

// Menampilkan tahun pada bagian footer
tahun.textContent = new Date().getFullYear();
