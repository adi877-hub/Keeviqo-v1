import pm2 from 'pm2';
import dotenv from 'dotenv';

dotenv.config();

pm2.connect((err) => {
  if (err) {
    globalThis.console.error('Error connecting to PM2:', err);
    globalThis.process.exit(1);
  }

  pm2.start({
    name: 'keeviqo',
    script: 'npm',
    args: 'run start',
    watch: true,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: globalThis.process.env.PORT || 3000,
    },
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }, (err) => {
    if (err) {
      globalThis.console.error('Error starting application with PM2:', err);
      pm2.disconnect();
      globalThis.process.exit(1);
    }

    pm2.dump((err) => {
      if (err) {
        globalThis.console.error('Error saving PM2 configuration:', err);
      } else {
        globalThis.console.log('PM2 configuration saved successfully');
      }

      pm2.startup('systemd', (err, result) => {
        if (err) {
          globalThis.console.error('Error setting up PM2 startup:', err);
        } else {
          globalThis.console.log('PM2 startup setup successfully');
          globalThis.console.log('Run the following command to complete setup:');
          globalThis.console.log(result);
        }

        pm2.disconnect();
      });
    });
  });
});
