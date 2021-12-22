// We're able to import and re-use the same code we use in our app
const seed = require('../server/db');

module.exports = (on) => {
  on('task', {
    'seed:db' (data) {
      seed(data);
      return true;
    }
  })

  on('task', {
    log(message) {
      console.log(message)

      return null
    },
  })
}