

// 获取cookie
export function getCookie(key) {
    const name = key + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        const c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// 设置cookie,默认是30天
export function setCookie(key, value) {
    const d = new Date();
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toGMTString();
    document.cookie = key + "=" + value + "; " + expires;
}
