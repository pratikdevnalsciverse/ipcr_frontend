const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'Impedance_graph.csv');
const jsonPath = path.join(__dirname, 'impedance_dummy_data.json');
const frontendJsonPath = path.join(__dirname, 'frontend', 'src', 'pages', 'impedanceProfile', 'impedance_dummy_data.json');

if (!fs.existsSync(csvPath)) {
  console.error('Error: Impedance_graph.csv not found in the workspace root.');
  process.exit(1);
}

const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split('\n');

const points = [];
let startTime = null;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const parts = line.split(',');
  if (parts.length < 2) continue;

  const timeStr = parts[0];
  const impedanceVal = parseFloat(parts[1]);

  if (isNaN(impedanceVal)) continue;

  // Parse timeStr "2026-06-11 12:33:27"
  const date = new Date(timeStr.replace(' ', 'T') + 'Z');
  const ms = date.getTime();
  if (isNaN(ms)) continue;

  if (startTime === null) {
    startTime = ms;
  }

  const elapsedSeconds = Math.round((ms - startTime) / 1000);

  points.push({
    time: timeStr,
    elapsed_seconds: elapsedSeconds,
    impedance: impedanceVal
  });
}

const output = {
  description: "Dummy impedance graph simulation data",
  generated_at: new Date().toISOString(),
  points: points
};

const jsonString = JSON.stringify(output, null, 2);

fs.writeFileSync(jsonPath, jsonString, 'utf8');
console.log(`Successfully generated ${jsonPath}`);

// Make sure target dir exists
const targetDir = path.dirname(frontendJsonPath);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(frontendJsonPath, jsonString, 'utf8');
console.log(`Successfully copied to ${frontendJsonPath}`);
