const { exec } = require('child_process');

// Full backup of the database
exec('pg_restore -U maciejmoczala -d games ./backup.tar', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Przywrócono baze danych. ${stdout}`);
});

