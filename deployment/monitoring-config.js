export default {
  apps: [
    {
      name: 'keeviqo',
      script: 'npm',
      args: 'run start',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/keeviqo/error.log',
      out_file: '/var/log/keeviqo/out.log',
      time: true,
    },
  ],
};
