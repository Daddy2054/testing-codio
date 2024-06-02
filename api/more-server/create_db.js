import sqlite3 from 'sqlite3';

let db = new sqlite3.Database('pets.db',(err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

const petsList = [
  {kind: 'Cat', name: 'Felix'},
  {kind: 'Dog', name: 'Togo'},
  {kind: 'Guinea pig', name: 'Waffle'},
  {kind: 'Parrot', name: 'Perry'},
  {kind: 'Turtle', name: 'Tuga'},
  {kind: 'Hamster', name: 'Freddy'}
];

db.serialize(() => {
  db.run(`CREATE TABLE "pets" (
    "id" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
  )`);
  const stmt = db.prepare("INSERT INTO pets (kind, name) VALUES (?, ?)");
  for (const pet of petsList) {
    stmt.run(pet.kind, pet.name);
  }
  stmt.finalize();
});

const dates = [
  '2023-01-14',
  '2023-02-11',
  '2023-02-13',
  '2023-03-10',
  '2023-03-19',
  '2023-04-01',
  '2023-04-10',
  '2023-04-19',
  '2023-04-20'
];
const statuses = ['Ok', 'Well', 'Ill', 'Better'];

db.serialize(() => {
  db.run(`CREATE TABLE "checkups" (
    "id" INTEGER NOT NULL,
    "checkup_result" TEXT,
    "pet_id" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    FOREIGN KEY("pet_id") REFERENCES "pets"("id"),
    PRIMARY KEY("id" AUTOINCREMENT)
  )`);

  const stmt = db.prepare("INSERT INTO checkups (date, pet_id, checkup_result) VALUES (?, ?, ?)");
  for (const date of dates) {
    const petId = Math.floor(Math.random() * petsList.length) + 1;
    const statusIndex = Math.floor(Math.random() * statuses.length);
    stmt.run(date, petId, statuses[statusIndex]);
  }

  stmt.finalize();
});

db.close();
