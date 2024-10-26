// https://eslint.org/docs/user-guide/configuring

// const { default: environments } = require('./constants/environments').then(()=>{
//   console.warn('no environments loaded')
// })

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    // add more generic rulesets here, such as:
    'eslint:recommended',
  ],
}
