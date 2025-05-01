const fs = require('fs');
const readline = require('readline');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'workout_log.json');

// Workout type enum
const WorkoutTypes = {
  PUSHUP: 'pushup',
  PULLUP: 'pullup',
};

const validWorkoutTypes = Object.values(WorkoutTypes);

function loadLog() {
  if (fs.existsSync(LOG_FILE)) {
    const data = fs.readFileSync(LOG_FILE, 'utf-8');
    return JSON.parse(data);
  }
  return [];
}

function saveLog(log) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf-8');
}

function askQuestion(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function logWorkout() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Ask for workout name (freeform)
  const workoutName = (await askQuestion(rl, `Enter workout name (freeform): `)).trim();

  // Ask for workout type (restricted enum)
  let workoutType;
  while (true) {
    const input = await askQuestion(
      rl,
      `Enter workout type (${validWorkoutTypes.join('/')}): `
    );
    const normalized = input.trim().toLowerCase();
    if (validWorkoutTypes.includes(normalized)) {
      workoutType = normalized;
      break;
    } else {
      console.log(`❌ Invalid type. Choose from: ${validWorkoutTypes.join(', ')}`);
    }
  }

  // Ask for sets
  const sets = [];
  for (let i = 1; i <= 4; i++) {
    const reps = await askQuestion(rl, `Enter reps for set ${i}: `);
    sets.push(parseInt(reps, 10));
  }

  const entry = {
    date: new Date().toISOString(),
    workout: workoutName,
    type: workoutType,
    sets,
  };

  const log = loadLog();
  log.push(entry);
  saveLog(log);

  console.log('✅ Workout logged!');
  rl.close();
}

logWorkout();
