const mysql = require('mysql');
const fs = require('fs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'workouts_db',
});

connection.connect();

const data = JSON.parse(fs.readFileSync('workout_log.json', 'utf-8'));

data.forEach((entry) => {
  const { date, workout, sets } = entry;
  const setsString = JSON.stringify(sets); // For MySQL, we convert sets array to a string

  connection.query(
    'INSERT INTO workouts (date, workout_name, sets) VALUES (?, ?, ?)',
    [date, workout, setsString],
    (err, results) => {
      if (err) throw err;
      console.log('Inserted workout:', results.insertId);
    }
  );
});

connection.end();