// export const BASE_URL: string
//     = (process.env.REACT_APP_BASE_URL && process.env.REACT_APP_BASE_URL.charAt(0) == ':') ? window.location.protocol + "//" + window.location.hostname + process.env.REACT_APP_BASE_URL : window.location.origin;
// if (!BASE_URL) {
//     throw new Error('Missing BASE_URL');
// }
// export const SOCKET_BASE_URL: string
//     = (process.env.REACT_APP_SOCKET_BASE_URL && process.env.REACT_APP_SOCKET_BASE_URL.charAt(0) == ':') ?
//     (window.location.protocol == "https:" ? "wss:" : "ws:") + "//" + window.location.hostname + process.env.REACT_APP_SOCKET_BASE_URL : '';
export const CERTIFICATE_EXP = 1000 * 60 * 60;
export const PROJECT_NAME = 'medical-chain';
// export const APP_TITLE: string = process.env.REACT_APP_TITLE ?? '';\
export const API_BASE_URL1 = process.env.REACT_APP_API_BASE_URL;

console.log({ API_BASE_URL1 });

export const API_BASE_URL = (() => {
    if (typeof window === 'undefined') return '';
    const hostUrl = window.location.protocol + '//' + window.location.hostname;
    if (process.env.REACT_APP_API_BASE_URL) {
        if (process.env.REACT_APP_API_BASE_URL.charAt(0) === ':') {
            return (
                hostUrl + process.env.REACT_APP_API_BASE_URL
            );
        }
        if (process.env.REACT_APP_API_BASE_URL.startsWith("//")) {
            return (
                window.location.protocol +
                '//' +
                process.env.REACT_APP_API_BASE_URL.substr(2)
            );
        }
        if (process.env.REACT_APP_API_BASE_URL.startsWith("/")) {
            return (
                hostUrl +
                process.env.REACT_APP_API_BASE_URL
            );
        }
        return process.env.REACT_APP_API_BASE_URL;
    }
    return "https://mcsrv.nftal.xyz/v1";
    return (hostUrl + '/v1');
})();

export const BASE_URL =
    API_BASE_URL.indexOf('http') === 0
        ? API_BASE_URL.split('/').slice(0, 3).join('/')
        : '';

//TODO: Pincode....
export const USE_PIN_CODE = false;
