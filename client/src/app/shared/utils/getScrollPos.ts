
export const getScrollPos = () => {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    const halfway = document.body.scrollHeight / 2;

    const position =
        scrollPos > halfway ? 'toast-top-center' : 'toast-bottom-center';

    return position;
}