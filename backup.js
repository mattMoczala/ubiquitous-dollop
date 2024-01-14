const { exec } = require('child_process');

// Full backup of the database
exec('pg_dump -d games -U maciejmoczala -F t > ./backup.tar', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Wykonano backup. ${stdout}`);
});