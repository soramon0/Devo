export const removeField = (field, item) => Object.keys(field).reduce((object, key) => {
  if (key !== item) {
    object[key] = field[key]
  }
  return object
}, {})
