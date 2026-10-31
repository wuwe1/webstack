var legacy = 1 // expect: no-var

module.exports = { legacy, missing } // expect: no-undef
