# Landing page: asset handoff

## Foto kecil pada bagian penutup

Enam foto baru dibuat dalam rasio persegi 400 × 400 agar sesuai dengan frame:
[diskusi di perpustakaan](https://www.pexels.com/photo/close-up-shot-of-three-people-in-the-library-8199602/),
[belajar di luar ruangan](https://www.pexels.com/photo/college-girl-and-boy-studying-together-7972485/),
[mahasiswa di kelas](https://www.pexels.com/photo/students-studying-in-the-classroom-8199143/),
[belajar bersama](https://www.pexels.com/photo/a-group-of-students-sitting-in-a-library-and-studying-16420457/),
[mahasiswa di tangga kampus](https://www.pexels.com/photo/people-sitting-on-concrete-stairs-8199223/),
dan [mahasiswa di ruang kuliah](https://www.pexels.com/photo/diverse-university-students-in-lecture-hall-31367502/).

## Foto “UniSpot at a glance”

Frame menggunakan foto [mahasiswa belajar bersama di perpustakaan oleh Yan Krukau / Pexels](https://www.pexels.com/photo/group-of-people-sitting-on-chair-in-front-of-table-8199558/).
Foto disimpan sebagai `students-library-8199558.webp` dan memakai `object-fit: cover`
agar memenuhi frame mendekati persegi pada desktop dan mobile.

## Foto kategori pada section “What you can explore”

Empat slot kategori menggunakan foto berbeda yang merepresentasikan aktivitas
terkait. Frame mengikuti rasio foto masing-masing, tanpa crop atau distorsi.
Foto ini bersifat ilustratif, bukan dokumentasi acara atau program tertentu.

| Kategori | Sumber foto |
| --- | --- |
| Events & workshops | [Pembicara dan audiens di auditorium — ICSA](https://www.pexels.com/photo/man-standing-in-front-of-people-sitting-on-red-chairs-1708936/) (ilustrasi forum) |
| Scholarships & study abroad | [Mahasiswa belajar di perpustakaan — Mikhail Nilov](https://www.pexels.com/photo/man-and-woman-in-the-library-9158776/) |
| Career & competitions | [Kolaborasi peserta menggunakan laptop — Matheus Bertelli / Pexels](https://www.pexels.com/photo/focused-team-collaborating-on-laptops-in-office-setting-34774358/); ilustrasi suasana kegiatan. |
| Communities & volunteering | [Relawan membersihkan taman — Captured by Nadim](https://www.pexels.com/photo/volunteers-clean-up-park-environmental-awareness-39038090/) |

Sumber dan nama file disimpan di `src/data/landing-media.json`; persiapan ulang
file yang hilang dapat dilakukan dengan `npm run assets:landing`.

## Pembaruan HD dan tanpa crop

Delapan slot video menggunakan delapan footage Pexels yang berbeda: empat di
hero, satu di misi, dan tiga di bagian Hub. Video disimpan dalam H.264 HD
1080 × 1920 atau 1920 × 1080, sesuai orientasi sumber. Pemrosesan hanya
mengecilkan resolusi dan memotong durasi; tidak memotong gambar video.
Poster berasal dari frame lengkap video yang sama.

Frame Ugency tidak diubah. Video dan foto memakai `object-fit: contain`, jadi
seluruh isi media ditampilkan. Karena proporsi frame berbeda dari sumber,
ruang kosong bisa terlihat di sisi atau atas-bawah; ini diperlukan untuk
menghindari cropping. Tampilan dan ukuran frame tetap mengikuti template.

Empat sumber tambahan yang menggantikan pemakaian ulang:

| Bagian | Sumber |
| --- | --- |
| Misi | [Students in the Library — cottonbro studio](https://www.pexels.com/video/students-in-the-library-8567035/) |
| Hub 1 | [Students Talking in Library — Yan Krukau](https://www.pexels.com/video/students-talking-in-library-8199379/) |
| Hub 2 | [Students Reviewing on the Table — Charlotte May](https://www.pexels.com/video/students-reviewing-on-the-table-5962956/) |
| Hub 3 | [Young People Using Laptop Outdoors — Keira Burton](https://www.pexels.com/video/young-people-using-laptop-outdoors-6145955/) |

Nama output dan sumber lengkap tersimpan di `src/data/landing-media.json`.
Foto misi memakai [Young Adult Holding Tablet — Irma Sjachlan](https://www.pexels.com/photo/young-adult-holding-tablet-in-campus-setting-outdoors-40551009/), terpisah dari footage video. Frame karier yang sebelumnya dipotong sudah dibuat ulang tanpa crop.
Bagian historis di bawah mencatat implementasi sebelumnya.

---

## Batas perubahan desain

Halaman utama memakai kembali template Ugency yang tersimpan di
`src/lib/unispot-landing-source.json`. Layout, stylesheet, tipografi, warna,
spacing, bentuk kartu, urutan section, dan animasi mengikuti template tersebut.
Gambar/video baru dipasang pada slot template yang sudah ada melalui
`src/lib/landing-template-media.ts`; tidak memakai layout alternatif
`LandingPage.tsx`. Branding, copy, dan link UniSpot mengikuti adapter sebelumnya.

## Implementasi sebelumnya (historis)

- Empat video hero bertema mahasiswa: Discover (menjelajahi kampus), Join
  (berdiskusi), Grow (belajar bersama dengan laptop), Belong (high-five).
- Video disimpan lokal sebagai MP4 H.264 480 × 660 px, 24 fps, tanpa audio,
  dengan `faststart`. Discover, Join, dan Grow berdurasi 8 detik; Belong
  memakai footage aslinya yang lebih singkat, 4 detik.
- Poster WebP diambil dari frame pertama video hasil crop. Poster dan video
  memiliki komposisi identik. Perilaku playback mengikuti runtime template.
- Gambar misi berupa frame diskusi mahasiswa dari video Join, menggantikan
  peta jaringan global. Gambar kategori karier berupa frame kolaborasi laptop
  dari video Grow. Ini foto stock sementara, bukan hasil generate.
- Lima slot gambar editorial memiliki nama file tersendiri, sehingga
  penggantian gambar landing tidak mengubah gambar di katalog opportunity.

## Sumber footage

| Slot | Pembuat | Halaman sumber |
| --- | --- | --- |
| Discover | RDNE Stock project | [Group of Students Walking Outdoors](https://www.pexels.com/video/group-of-students-walking-outdoors-7683346/) |
| Join / foto misi | RDNE Stock project | [College Students Having Fun Discussing](https://www.pexels.com/video/college-students-having-fun-discussing-7683858/) |
| Grow / foto karier | Keira Burton | [Students Using a Laptop for Their Studies](https://www.pexels.com/video/a-group-of-students-using-a-laptop-on-their-studies-6146484/) |
| Belong | Zen Chung | [Two Women Doing High Five](https://www.pexels.com/video/two-women-doing-high-five-5535726/) |

[Lisensi Pexels](https://www.pexels.com/license/). Ditinjau 15 November 2026.
Footage menggambarkan aktivitas mahasiswa secara umum, bukan dokumentasi
pengguna UniSpot atau kegiatan organisasi yang tercantum di katalog.

## Gambar untuk digenerate

Folder tujuan: **`public/assets/unispot/landing/`**.
Empat gambar prioritas dan satu opsional. File saat ini sudah berisi visual
sementara yang valid, sehingga tidak ada slot kosong selama proses generate.

| File | Penggunaan | Visual sementara | Prioritas |
| --- | --- | --- | --- |
| `mission-campus-student.webp` | Our mission | Foto mahasiswa dengan tablet oleh Irma Sjachlan | Tinggi |
| `category-events-forum-1708936.webp` | Events & workshops | Foto pembicara dan audiens dari Pexels | Opsional |
| `category-scholarships-9158776.webp` | Scholarships & study abroad | Foto mahasiswa belajar dari Pexels | Opsional |
| `category-career-collaboration-34774358.webp` | Career & competitions | Foto kolaborasi dari Pexels | Opsional |
| `category-volunteering-39038090.webp` | Communities & volunteering | Foto kegiatan relawan dari Pexels | Opsional |

### Prompt dasar untuk semua gambar

Tambahkan adegan spesifik di bawah ke prompt dasar ini:

> Realistic editorial photography of Indonesian university students aged 18–25,
> naturally diverse appearances, casual campus clothing, candid expressions,
> soft natural daylight, warm balanced colors, subtle coral or magenta accents.
> Authentic activity and interaction, not a posed portrait. Medium-wide framing,
> the main activity centered, enough breathing room for a near-square crop.
> No text, no watermark, no logos, no readable text on screens or documents.
> Landscape 4:3 composition, at least 1600 × 1200 pixels.

1. **Misi — `mission-campus-student.webp`**

   > Four Indonesian university students sharing ideas around a laptop in a
   > welcoming green campus courtyard. One student points at the laptop while
   > the others listen and smile. A sense of shared curiosity and belonging.
   > Keep faces above the bottom quarter, leaving room for three small labels.

2. **Event — `category-events-forum-1708936.webp`**

   > A small hands-on workshop in a bright Indonesian university classroom.
   > A friendly facilitator and five students actively collaborating with
   > laptops and practical materials at a shared table. Capture the activity
   > from an eye-level three-quarter angle, with the main interaction centered.

3. **Beasiswa — `category-scholarships-9158776.webp`**

   > An Indonesian university student preparing a scholarship application in
   > a bright library, with a laptop, notebook and a neat folder of application
   > documents. A fellow student offers feedback. Thoughtful and optimistic,
   > focused on preparation rather than graduation or travel tourism.

4. **Karier — `category-career-collaboration-34774358.webp`**

   > Three Indonesian university students building a small prototype and
   > preparing a competition presentation. Laptops, a physical prototype and
   > notes on a shared table. One student tests the prototype while another
   > explains an idea. Visible teamwork and practical problem solving.

5. **Relawan — `category-volunteering-39038090.webp`** (opsional)

   > Indonesian university volunteers actively working together on a community
   > environmental project, planting seedlings in a neighborhood green space.
   > Gardening gloves, practical casual clothing, warm interactions, lush
   > tropical surroundings. Show the action, not a posed group photograph.

### Cara memasang hasil generate

1. Ekspor/konversi ke **WebP yang sebenarnya**, bukan hanya mengganti ekstensi.
   Target 1600 × 1200 px, kualitas 80–85, idealnya kurang dari 250 KB per gambar.
2. Ganti file dengan nama yang sama di folder tujuan di atas. Empat poster
   `*-poster.webp` tetap berasal dari video dan tidak perlu digenerate.
3. Perbarui `alt` dan `interimSource` untuk gambar terkait di
   `src/data/landing-media.json`, agar deskripsi sesuai hasil akhir. Catat alat
   dan tanggal generate sebagai sumber, bukan nama pembuat footage sementara.
4. Jalankan ulang build saat deployment dan periksa crop desktop/mobile.

Ukuran frame mengikuti template Ugency; misi memakai frame portrait 400:500,
dan kategori memakai frame 400:300. Semua foto memakai `contain` agar terlihat
utuh di berbagai breakpoint. Jangan ubah ukuran slot untuk menyesuaikan gambar.

## Featured opportunities dan logo Hub

Featured memakai gambar dari katalog: DevFest dan Google AI Essentials sudah
berasal dari sumber resmi. Logo Hub juga memakai aset organisasi dari katalog.
LPDP masih memakai gambar LPDP umum; halaman program spesifik telah diperiksa,
tetapi belum diperoleh cover khusus yang cocok dari halaman tersebut:
[LPDP–NAIST resmi](https://lpdp.kemenkeu.go.id/beasiswa/beasiswa-kemitraan-double-degree-joint-degree/lpdp-naist2026).
Sumber asli aset katalog dicatat di `docs/research/unispot/asset-manifest.json`.

## Regenerasi media dari sumber

```bash
npm run assets:landing
```

Memerlukan `curl` dan FFmpeg dengan encoder H.264 (`libx264` atau `libopenh264`)
dan WebP. Konfigurasi sumber, durasi dan crop ada di
`src/data/landing-media.json`. Sumber resolusi asli di-cache di `/tmp/opencode`.
Script mempertahankan semua output yang sudah ada, termasuk gambar yang telah
diganti dengan hasil generate. Untuk membuat ulang aset tertentu, hapus hanya
file output tersebut sebelum menjalankan script.

## Verifikasi media sebelum pemulihan template (historis)

Hasil berikut dicatat pada implementasi native yang kemudian diganti kembali
dengan template Ugency. Verifikasi aktif ada di
[ugency-restoration-QA.md](ugency-restoration-QA.md).

- `npm run typecheck`: lulus.
- `npm run build`: lulus.
- `npm run qa:landing`: 3/3 lulus; seluruh aset aktif bersifat lokal dan
  merespons HTTP 200. Hero tidak memakai URL media template lama.
- Browser Chromium pada lebar 320, 390, 768, dan 1440 px: tidak ada overflow
  horizontal maupun gambar rusak, dan keempat video berhasil didekode/diputar.
- Pause/Play berhasil menghentikan/melanjutkan keempat video. Preferensi reduced
  motion menghentikan playback. Tidak ada error aplikasi di console.
- FFprobe: keempat file adalah H.264/yuv420p, 480 × 660, tanpa stream audio.
  Total video 2.14 MiB (2,239,184 byte).
- Frame hasil crop ditinjau pada 0, 1.5, dan 3 detik. Screenshot hero serta
  bagian misi desktop/mobile ditinjau secara visual:
  - [Hero desktop](../../.playwright-mcp/landing-assets-hero-1440.png)
  - [Hero mobile](../../.playwright-mcp/landing-assets-hero-390.png)
  - [Misi desktop](../../.playwright-mcp/landing-assets-mission-1440.png)
  - [Misi mobile](../../.playwright-mcp/landing-assets-mission-390.png)
