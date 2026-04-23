const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desktopApi", {
  auth: {
    fetchBearerToken: () => ipcRenderer.invoke("auth:fetchBearerToken"),
    fetchCorporateClientData: (corporateId) =>
      ipcRenderer.invoke("auth:fetchCorporateClientData", corporateId),
    verifyDevice: (params) => ipcRenderer.invoke("auth:verifyDevice", params),
    registerDevice: (payload) => ipcRenderer.invoke("auth:registerDevice", payload),
    logout: () => ipcRenderer.invoke("auth:logout"),
  },
  rateBoard: {
    fetch: (clientId) => ipcRenderer.invoke("rate-board:fetch", clientId),
  },
});
