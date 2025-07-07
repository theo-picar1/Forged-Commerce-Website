// ********** File will have functions that manipulate the DOM. Like opening or closng modals **********

// Open a modal by its ID
export function openSlideInModal(modalToToggle: string): void {
    const modal = document.getElementById(modalToToggle)

    if (modal) {
        modal.classList.add("active")
    } 
    else {
        console.log("Modal with ID ", modalToToggle, "was not found!")
    }
}

// Close a modal by its id
export function closeSlideInModal(modalToToggle: string): void {
    const modal = document.getElementById(modalToToggle)

    if (modal) {
        modal.classList.remove("active")
    } else {
        alert(`Modal with ID '${modalToToggle}' was not found!`)
    }
}

// Helper function to conditionally set input border color
export const changeStyle = (invalid: boolean) => ({
    borderColor: invalid ? "#FE0404" : "#808080"
})

// Helper function to conditionally show error messages
export const showMessage = (invalid: boolean) => ({
    display: invalid ? "block" : "none"
})