module.exports = {
  apps : [{
    name: "toot-sweet",
    script: "./app.js",
    watch: ["*.js"],
    env: {
      NODE_ENV: "development",
      DEBUG: 'toot-sweet'
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}