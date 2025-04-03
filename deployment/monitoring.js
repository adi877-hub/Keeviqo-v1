import pm2 from 'pm2';
import dotenv from 'dotenv';

dotenv.config();

pm2.connect((err) => {
  if (err) {
    console.error('Error connecting to PM2:', err);
    process.exit(1);
  }

  pm2.start({
    name: 'keeviqo',
    script: 'npm',
    args: 'run start',
    watch: true,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || 3000,
    },
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }, (err) => {
    if (err) {
      console.error('Error starting application with PM2:', err);
      pm2.disconnect();
      process.exit(1);
    }

    pm2.dump((err) => {
      if (err) {
        console.error('Error saving PM2 configuration:', err);
      } else {
        console.log('PM2 configuration saved successfully');
      }

      pm2.startup('systemd', (err, result) => {
        if (err) {
          console.error('Error setting up PM2 startup:', err);
        } else {
          console.log('PM2 startup setup successfully');
          console.log('Run the following command to complete setup:');
          console.log(result);
        }

        pm2.disconnect();
      });
    });
  });
});
