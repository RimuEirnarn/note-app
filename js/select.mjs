function makeOptions(obj, defaultKey) {
    let selections = ""
    let value = ""
    for (let key in obj) {
        value = obj[key]
        selections += `<option value="${encodeURIComponent(value)}" ${defaultKey === key ? 'selected' : ''}>${sanitize(key)}</option>`
    }
    return selections
}

export { makeOptions }
