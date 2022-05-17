module.exports = {
  apps: [{
    name: "littlebigfamily-api",
    script: "./index.js",
    env: {
      cwd: "/home/test/littlebigfamily/api",
    },
    max_memory_restart: "500M",
    instances: 1,
    port: 4000,
    exec_mode: "cluster",
    watch: ["lib"],
    ignore_watch: ["node_modules", "bin", "db", "log", "settings", "snippets", "test"],
    watch_options: {
      followSymlinks: false
    },
    time: true
  }]
};
