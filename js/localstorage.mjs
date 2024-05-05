
/**
 * Get item from localStorage. It assumes everything is JSON.
 * @param {String} key key used for localStorage
 * @returns {Object}
*/
function getItem(key) {
    if (!__local_storage__)
        throw new Error("localStorage is not supported")

    const data = localStorage.getItem(key)
    try {
        return JSON.parse(data)
    } catch (e) {
        return data
    }
}

/**
 * Set item to localStorage.
 * @param {String} key key used.
 * @param {Object} value JSON-able data.
*/
function setItem(key, value) {
    if (!__local_storage__)
        throw new Error("localStorage is not supported")
    
    localStorage.setItem(key, JSON.stringify(value))
}

/**
 * Remove item from localStorage
 * @param {string} key key used.
 */
function removeItem(key) {
    if (!__local_storage__) {
        throw new Error("localStorage is not supported")
    }
    localStorage.removeItem(key)
}

/**
 * Check if item exists in localStorage
 * @param {string} key key used
 */
function isExists(key) {
    return localStorage.key(key) !== null
}

/** Local storage support*/
var __local_storage__ = (localStorage !== undefined)

export {
    getItem,
    setItem,
    removeItem,
    isExists
}
