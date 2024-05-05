import { sanitize } from "./utils.mjs"

function makeModal(modalId, config) {
    const _config = {
        title: sanitize(config.title) || "Modal Title",
        body: config.body || "",
        submitText: config.submitText || "Submit",
        closeText: config.closeText || "Close",
        onSubmit: config.onSubmit || (() => null),
        onClosed: config.onClosed || (() => null)
    }
    const _ModalId = encodeURIComponent(modalId)
    const closeModalId = `${_ModalId}-close`
    const submitModalId = `${_ModalId}-submit`
    let data = `
<div class="modal fade" tabindex="-1" id="${_ModalId}">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">${_config.title}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="${closeModalId}"></button>
      </div>
      <div class="modal-body">
      ${_config.body}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="${closeModalId}">${_config.closeText}</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="${submitModalId}">${_config.submitText}</button>
      </div>
    </div>
  </div>
</div>
`
    $(".container-0").html(data)
    $(`#${submitModalId}`).on('click', _config.onSubmit)
    $(`#${closeModalId}`).on('click', _config.onClosed)
    return $(_ModalId)
}

export { makeModal }
