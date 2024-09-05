# Cara menjalankan program

1. **Install modules**

   Install di terminal sesuai path folder masing-masing, dengan perintah :

   `npm install`

2. **Migrate database dan seeding**

   Sebelum migrate database, buat file `.env` dengan variable `DATABASE_URL` sama seperti file `.env.development`.

   Generate prisma/client dengan perintah berikut :

   `npm run prisma generate`

   Buat database dengan nama `antusiusdb`, setelah membuat database migrate melalui terminal :

   `npm run prisma migrate dev`

   Kemudian jalankan perintah berikut, untuk seeding data :

   `npm run prisma db seed`

   _Note: Jika migrate tidak dapat dilakukan, rubah nilai varibale `DATABASE_URL` yang ada di file `.env` dan `.env.development` sesuai dengan username dan password (optional) mysql ada._

3. **Run program**

   Jalankan api dan web di terminal sesuai path masing-masing, dengan perintah :

   `npm run dev`
