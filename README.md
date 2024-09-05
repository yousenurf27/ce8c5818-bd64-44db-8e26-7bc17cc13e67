# Cara menjalankan program

1. **Install modules**

   Install di terminal sesuai path folder masing-masing, dengan perintah :

   `npm install`

2. **Migrate database dan seeding**

   Sebelum migrate database, buat file `.env` dengan variable `DATABASE_URL` sama seperti file `.env.development`.

   1. Buat database dengan nama `antusiusdb`

   2. Generate prisma/client, dengan perintah :

      `npm run prisma generate`

   3. Kemudian migrate table ke database, dengan perintah :

      `npm run prisma migrate dev`

   4. Kemudian seeding data ke database, dengan perintah :

      `npm run prisma db seed`

   _Note: Jika migrate tidak dapat dilakukan, rubah nilai varibale `DATABASE_URL` yang ada di file `.env` dan `.env.development` sesuai dengan username dan password (optional) mysql ada._

3. **Run program**

   Jalankan api dan web di terminal sesuai path masing-masing, dengan perintah :

   `npm run dev`
