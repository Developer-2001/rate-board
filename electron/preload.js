"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("electron", {
    getDeviceId: () => electron_1.ipcRenderer.invoke("device:getDeviceId"),
});
electron_1.contextBridge.exposeInMainWorld("desktopApi", {
    auth: {
        fetchBearerToken: () => electron_1.ipcRenderer.invoke("auth:fetchBearerToken"),
        fetchCorporateClientData: (corporateId) => electron_1.ipcRenderer.invoke("auth:fetchCorporateClientData", corporateId),
        verifyDevice: (params) => electron_1.ipcRenderer.invoke("auth:verifyDevice", params),
        registerDevice: (payload) => electron_1.ipcRenderer.invoke("auth:registerDevice", payload),
        logout: () => electron_1.ipcRenderer.invoke("auth:logout"),
    },
    rateBoard: {
        fetch: (clientId) => electron_1.ipcRenderer.invoke("rate-board:fetch", clientId),
    },
});
