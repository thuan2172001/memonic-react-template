import { randomBytes } from "crypto";

const axios = require('axios');
const qs = require('qs');
const hash256 = require('hash.js');
const FormData = require('form-data');
const secp256k1 = require('secp256k1');

const _convertMessage = (obj: any) => {
    const jsonString = JSON.stringify(obj);
    const hashBytes = hash256.sha256().update(jsonString).digest();
    return Uint8Array.from(hashBytes);
};

const _convertStringToByteArray = (base64_string: any) => {
    return Uint8Array.from(atob(base64_string), (c) => c.charCodeAt(0));
};

const _convertArrayBufferToString = (arrayBuffer: any) => {
    return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
};

const _generateKeyPair = (privateKey: any) => {
    let pK;
    if (privateKey && typeof privateKey == 'string') {
        pK = _convertStringToByteArray(privateKey);
    } else {
        do {
            pK = randomBytes(32);
        } while (!secp256k1.privateKeyVerify(pK));
    }
    const publicKey = secp256k1.publicKeyCreate(pK);
    return {
        privateKey: _convertArrayBufferToString(pK),
        publicKey: _convertArrayBufferToString(publicKey),
    };
};

const _signMessage = (privateKey: any, message: any) => {
    const signature = secp256k1.ecdsaSign(
        _convertMessage(message),
        _convertStringToByteArray(privateKey)
    );
    return _convertArrayBufferToString(signature.signature);
};

export const _generateCertificate = (certificateInfo: any, privateKey: any) => {
    const keyPair = _generateKeyPair(privateKey);
    const signature = _signMessage(privateKey, certificateInfo);
    return { signature, certificateInfo, publicKey: keyPair.publicKey };
};

const _getActionModule = (_url: any) => {
    const pathname =
        _url[0] === '/' ? String(_url) : String(new URL(_url).pathname);
    return pathname.replace(new RegExp('/', 'g'), '-').substring(1);
};

const _setupAxios = (originAxios: any, auth: any) => {
    originAxios.interceptors.request.use(
        (config: any) => {
            console.log(123);
            console.log(config.headers);

            config.paramsSerializer = (params: any) => {
                console.log({ params });
                return qs.stringify(params, {
                    allowDots: true,
                    arrayFormat: 'comma',
                    encode: false,
                });
            };
            console.log({ auth });
            if (!auth?.id) return config;
            console.log(JSON.stringify(auth._certificate));
            config.headers["Authorization"] = `${JSON.stringify(auth._certificate)}`;
            if (config.method.toUpperCase() !== 'GET') {
                const _getActionType = () =>
                    (
                        config.method +
                        '_' +
                        _getActionModule(config.url ?? '/')
                    ).toUpperCase();
                if (!config.data || !auth._privateKey) return config;
                // goi lai vao data, signature giu nguyen
                if (config.data instanceof FormData) {
                    config.data.append('_timestamp', new Date().toISOString());
                    config.data.append('_actionType', _getActionType());
                    const sig = { ...Object.fromEntries(config.data), file: undefined };
                    const signature = _signMessage(auth._privateKey, sig);
                    config.headers['Content-Type'] = 'multipart/form-data';
                    config.data.append('_signature', signature);
                    return config;
                }
                config.data = {
                    ...config.data,
                    _actionType: _getActionType(),
                    _timestamp: new Date().toISOString(),
                };
                const bodySignature = _signMessage(auth._privateKey, config.data);
                config.data = {
                    ...config.data,
                    _signature: bodySignature,
                };
                return config;
            }
            return config;
        },
        (err: any) => Promise.reject(err)
    );

    originAxios.interceptors.response.use(
        (next: any) => {
            if (!next.data.success) return Promise.reject(next.data.reason);
            return Promise.resolve(next.data.data);
        },
        (error: any) => {
            if (!error.response) return Promise.reject(error);
            const errorCode = error.response.data;
            if (errorCode === 'AUTH.ERROR.NEED_TO_CHANGE_PASSWORD' || errorCode.indexOf('AUTH.ERROR.') > -1) {
                console.log(errorCode);
            }
            return Promise.reject(error);
        }
    );
};

export const createCustomAxios = (userInfo: { username: string, _privateKey: string, id: string, _certificate: any }) => {
    const _axios = axios.create();
    _setupAxios(_axios, userInfo);
    return _axios;
};

