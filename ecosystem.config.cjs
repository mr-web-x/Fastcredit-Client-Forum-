//для установления времени Братислава на AWS
module.exports = {
  apps: [
    {
      name: "[fastcredit-sk]-forum-next",
      script: "node_modules/.bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 10002,
        TZ: "Europe/Bratislava",
      },
      instances: 1,
      exec_mode: "fork",
    },
  ],
};
