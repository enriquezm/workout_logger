// logWorkout.mjs
import fs from 'fs';
import readline from 'readline';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOG_FILE = path.join(__dirname, 'workout_log.json');

const WorkoutTypes = {
  PUSHUP: 'pushup',
  PULLUP: 'pullup',
};

const validWorkoutTypes = Object.values(WorkoutTypes);
const workoutNames = ['Phase 1 - Regular'];

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
  // Ask for workout name via dropdown
  const { workoutName } = await inquirer.prompt([
    {
      type: 'list',
      name: 'workoutName',
      message: chalk.cyanBright('Select workout name:'),
      choices: workoutNames,
    },
  ]);

  // Ask for workout type via dropdown
  const { workoutType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'workoutType',
      message: chalk.cyanBright('Select workout type:'),
      choices: validWorkoutTypes,
    },
  ]);

  // Use readline for numeric input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const sets = [];
  for (let i = 1; i <= 4; i++) {
    const reps = await askQuestion(rl, chalk.yellow(`Enter reps for set ${i}: `));
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

  console.log(chalk.greenBright('\n✅ Workout logged successfully!'));
  rl.close();
}

logWorkout();
