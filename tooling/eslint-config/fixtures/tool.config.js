// Config files may log and await at the top level.
console.warn("config")

export default await Promise.resolve({})
