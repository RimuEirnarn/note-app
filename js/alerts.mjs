// Alerts

import { sanitize, randint, now } from "./utils.mjs"

const ALERT_CONFIG = {
    target: "#alerts"
}

const _n = () => {
    const history = []
    const limit = 50

    const proxied = new Proxy(history, {
        get(obj, prop) {
            if (["push", "unshift", 'reverse', 'concat', 'fill', 'pop', 'shift', 'join', 'slice', 'sort'].includes(prop)) {
                throw new Error("Cannot edit history directly.")
            }
            return obj[prop]
        }
    })

    return {
        get history() {
            return history.toSorted((a, b) => {
                return a.since > b.since ? 1 : -1
            })
        },

        push(element) {
            // Notification must have title, content, and since.
            if (element.title === undefined ||
                element.content === undefined ||
                element.since === undefined)
                throw new Error("Notification object doesn't have appropriate property")

            if (!(typeof element.title === 'string')
                || !(typeof element.content === 'string')
                || !(typeof element.since))
                throw new Error("Notification object data types mismatch.")

            history.push(element)
        }
    }
}

const NotificationHistory = _n()

function _reparse(name) {
    switch (name) {
        case "error":
        case "err":
            return "danger"
        case "primary":
        case "secondary":
        case "success":
        case "info":
        case "danger":
        case "light":
        case "dark":

        case "warning":
            return name
        case "warn":
            return 'warning'
        default:
            return "primary"
    }
}

function _fetchIcon(type) {
    switch (type) {
        case "danger":
            return '<i class="bi bi-x-circle-fill"></i>'
        case "warning":
            return '<i class="bi bi-exclamation-circle-fill"></i>'
        case "success":
            return '<i class="bi bi-check-circle-fill"></i>'
        default:
            return '<i class="bi bi-info-circle-fill"></i>'
    }
}

function showAlert(config) {
    let title = config.title === undefined ? "" : `${sanitize(config.title)}`
    let body = config.body === undefined ? "Content" : `${sanitize(config.body)}`
    let delay = config.delay === undefined ? 2000 : config.delay
    let aType = _reparse(config.type)
    let toastId = `liveToast-${randint(999999)}`
    NotificationHistory.push({
        title: title,
        content: body,
        since: now()
    })

    let html = `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" id="${toastId}"><div class="toast-header"><div class='text-${aType} me-1'>${_fetchIcon(aType)}</div><strong class="me-auto">${title}</strong><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div><div class="toast-body">${body}</div></div>`
    $(ALERT_CONFIG.target).prepend(html)
    
    const toastLiveExample = document.getElementById(toastId)
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample, {delay: delay})
    toastBootstrap.show()

    toastLiveExample.addEventListener("hidden.bs.toast", () => {
        $(`#${toastId}`).remove()
    })
}

const showError = (body) => {
    showAlert({title: 'Error!', body: body, delay: 5000, type: 'error'})
}
const showWarning = (body) => {
    showAlert({title: 'Warning!', body: body, delay: 5000, type: 'warning'})
}
const showInfo = (body) => {
    showAlert({title: 'Info!', body: body, delay: 5000, type: 'info'})
}

export { showAlert, showError, showWarning, showInfo, NotificationHistory }
