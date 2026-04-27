import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  getDeviceId: () => ipcRenderer.invoke("device:getDeviceId"),
});

contextBridge.exposeInMainWorld("desktopApi", {
  auth: {
    fetchBearerToken: () => ipcRenderer.invoke("auth:fetchBearerToken"),
    fetchCorporateClientData: (corporateId: string) =>
      ipcRenderer.invoke("auth:fetchCorporateClientData", corporateId),
    verifyDevice: (params: {
      clientId: string;
      SysName: string;
      fingerPrintId: string;
    }) => ipcRenderer.invoke("auth:verifyDevice", params),
    registerDevice: (payload: Record<string, unknown>) =>
      ipcRenderer.invoke("auth:registerDevice", payload),
    logout: () => ipcRenderer.invoke("auth:logout"),
  },
  rateBoard: {
    fetch: (clientId: string) => ipcRenderer.invoke("rate-board:fetch", clientId),
  },
});
