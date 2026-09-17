// infra/ecosystem.config.js
// Run from the app root on the EC2 instance:
//   pm2 start infra/ecosystem.config.js
//   pm2 save
//   pm2 startup   (follow the printed command once, so PM2 survives reboots)
module.exports = {
  apps: [
    {
      name: "vivah-vedam",
      cwd: __dirname + "/..",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "500M",
      out_file: "/home/ubuntu/logs/vivah-vedam-out.log",
      error_file: "/home/ubuntu/logs/vivah-vedam-error.log",
      time: true,
    },
  ],
};
