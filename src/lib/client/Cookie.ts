export function createCookie(name: string, value: string, hours: number, path: string) {
    // Creates cookies with a set expiration date. Only accessible to root, parent pages, and specific paths.
    let expiration = '';

    if (hours) {
        let date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        expiration = '; expires=' + date.toUTCString();
    }

    document.cookie = name + '=' + value + expiration + "; path=" + path;
}

export function readCookie(name: string) {
    // Reads available cookies to a page.
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
}

export function deleteCookie(name: string, path: string) {
    // Deletes cookies available to a page.
    createCookie(name, '', -1, path);
}