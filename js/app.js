import { getItem, setItem, removeItem } from "./localstorage.mjs";
import { now, randint, getModeScheme, sanitize } from "./utils.mjs";
import { showAlert } from "./alerts.mjs";

const _generate_id = () => `note-id_${randint(100000)}-${btoa(now())}`
const __version__ = '0.0.1'

const _notes = (notes_tag, notes_inputtag) => {
    const notes_ = {}
    let notes_id = notes_tag
    let notes_input = notes_inputtag
    let init = false
    let note_html = ''

    function refresh(onrefresh) {
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i)
            if (key.startsWith('note-id')) {
                notes_[key] = JSON.parse(localStorage.getItem(key))
                onrefresh ? onrefresh(key, notes_[key]) : null
            }
        }
    }

    return {
        init() {
            const that = this
            $.ajax({
                cache: false,
                url: "/template/note.html",
                success(resp) {
                    note_html = resp
                    that.initiate_refresh()
                    $(`${notes_inputtag} > button[type='submit']`).on('click', that.noteInputSubmit(that))
                }
            })

        },

        /**
        * get an individual note
        * @param {String} note note key
        */
        getNote(note) {
            if (!note.startsWith('note-id'))
                return null
            return getItem(note)
        },

        /**
        * set an individual note
        */
        setNote(data) {
            const dataset = {
                title: data.title || "No Title",
                content: data.content || "No Content",
                since: data.since || now(),
                checked_since: data.checked_since || null
            }
            const key = _generate_id()
            setItem(key, dataset)
            notes_[key] = dataset
            return key
        },

        /**
         * remove a note
         */
        removeNote(note) {
            if (note in notes_)
                delete notes_[note]
            return removeItem(note)
        },

        get notes() {
            return [...notes_]
        },

        initiate_refresh() {
            if (init)
                showAlert({ title: "Note refreshing...", body: "Refresh trigger is activated. Refresing notes...", type: 'warn', delay: 5000 })
            refresh(this.renderNote)
            init = true
        },

        /**
        * Set notes ID to manipulate DOM
        * @param {nid} nid Note ID
        */
        setNotesId(nid) {
            notes_id = nid
        },

        /**
        * Set notes input ID to manipulate DOM
        * @param {nid} nid Note input ID
        */
        setNotesInputId(nid) {
            notes_id = nid
        },

        renderNote(nid, note) {
            const date = new Date(note.since)
            const timed = strftime("%T %D", date)
            const pre_rendered = note_html.replaceAll("$[note_id]", sanitize(nid))
                .replaceAll("$[title]", sanitize(note.title))
                .replaceAll("$[content]", sanitize(note.content))
                .replaceAll("$[time]", sanitize(timed))
                .replaceAll("$[check_trigger]", (() => note.checked_since ? 'border-success-subtle' : 'border-primary-subtle'))
                .replaceAll("$[check_trigger2]", (() => note.checked_since ? 'disabled' : ''))

            $(notes_id).prepend(pre_rendered)
            const check = $(`[data-target="${nid}-check"]`)
            const edit = $(`[data-target="${nid}-edit"]`)
            const del = $(`[data-target="${nid}-delete"]`)

            check.on('click', NoteApp.onNoteChecked(nid, note))

            del.on('click', (_) => {
                console.log('deleted')
                // due to some weird error...
                localStorage.removeItem(nid)
                $(`[data-nid="${nid}"]`).remove()
            })

            edit.on('click', () => {
                showAlert({title: "Not Implemented", body: "[Edit] is not yet implemented. Please wait until update~", type: 'err'})
            })
        },

        onNoteChecked(nid, note) {
            return (_) => {
                console.log('checked', nid)
                note.checked_since = now()
                const noteElement = $(`[data-nid="${nid}"`)
                noteElement.removeClass('border-primary-subtle')
                noteElement.addClass('border-success-subtle')
                $(`[data-target="${nid}-check"]`).attr('disabled', true)
                setItem(nid, note)
            }
        },

        noteInputSubmit(this_) {
            return (_) => {
                const titleElement = $(`${notes_input} > div > input`)
                const contentElement = $(`${notes_input} > div > textarea`)

                const title = titleElement.val()
                const content = contentElement.val()

                if (!title || !content)
                    return

                titleElement.val("")
                contentElement.val("")
                const data = {
                    title: title,
                    content: content,
                    checked_since: null,
                    since: now()
                }
                if (this['noteInputSubmit'])
                    this.renderNote(this.setNote(data), data)
                else
                    this_.renderNote(this_.setNote(data), data)
            }
        }
    }
}

$('.header > h3').append(` v${sanitize(__version__)}`)
const NoteApp = _notes("#notes", "#note-input")
NoteApp.init()

showAlert({ 'title': "Hello, World!", body: "Notification", type: "info" })
document.documentElement.setAttribute("data-bs-theme", getModeScheme())

matchMedia("(prefers-color-scheme: dark)").onchange = (e) => {
    const mode = e.matches ? 'dark' : 'light'
    const data = {
        title: `Mode set to ${mode}`,
        body: `Color scheme mode is set to ${mode}.`,
        type: 'info'
    }
    showAlert(data)
    document.documentElement.setAttribute("data-bs-theme", mode)
}


