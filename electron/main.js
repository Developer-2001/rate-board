"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const dotenv_1 = __importDefault(require("dotenv"));
const electron_store_1 = __importDefault(require("electron-store"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = require("node:url");
const uuid_1 = require("uuid");
// Next.js replaces NEXT_PUBLIC_* values at build time for the renderer,
// but the Electron main process runs separately and must load env files itself.
for (const envFileName of [".env.local", ".env"]) {
    dotenv_1.default.config({
        path: node_path_1.default.join(__dirname, "..", envFileName),
    });
}
const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "";
const RATE_BOARD_API_URL = "https://report-api-742717265610.asia-south1.run.app/api/Report/rate";
const APP_PROTOCOL = "app";
const APP_HOST = "-";
const OUT_DIR = node_path_1.default.join(__dirname, "..", "out");
const DEV_SERVER_URL = process.env.ELECTRON_DEV_SERVER_URL;
const deviceStore = new electron_store_1.default({
    name: "rate-board-device",
});
let fallbackDesktopDeviceId = null;
let bearerToken = null;
if (!BASE_API_URL) {
    throw new Error("NEXT_PUBLIC_BASE_API_URL is not available in the Electron main process.");
}
function debugLog(message, payload) {
    if (process.env.NODE_ENV !== "production") {
        console.debug("[electron]", message, payload ?? "");
    }
}
function getStoredDesktopDeviceId() {
    try {
        const storedDeviceId = deviceStore.get("deviceId");
        if (storedDeviceId) {
            return storedDeviceId;
        }
        const nextDeviceId = (0, uuid_1.v4)();
        deviceStore.set("deviceId", nextDeviceId);
        debugLog("Generated and stored Electron device ID.", nextDeviceId);
        return nextDeviceId;
    }
    catch (error) {
        fallbackDesktopDeviceId ??= (0, uuid_1.v4)();
        debugLog("Electron store unavailable, using in-memory fallback UUID.", error);
        return fallbackDesktopDeviceId;
    }
}
function getErrorMessage(payload, fallbackMessage) {
    if (payload && typeof payload === "object" && "message" in payload) {
        const { message } = payload;
        return message || fallbackMessage;
    }
    return fallbackMessage;
}
async function fetchJson(url, init, fallbackMessage) {
    const response = await fetch(url, init);
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
        const error = new Error(getErrorMessage(payload, fallbackMessage));
        error.status = response.status;
        throw error;
    }
    return payload;
}
function getExpiryWarningMessage(clientData) {
    const now = new Date();
    const licenseDate = new Date(clientData.LicenseSupportDate);
    const fifteenDaysFromNow = new Date(now);
    fifteenDaysFromNow.setDate(now.getDate() + 15);
    if (licenseDate > fifteenDaysFromNow || licenseDate <= now) {
        return null;
    }
    const daysUntilExpiry = Math.ceil((licenseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const actualExpiryDate = new Date(licenseDate);
    actualExpiryDate.setDate(licenseDate.getDate() + 1);
    return `Your subscription will expire on ${actualExpiryDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })} (${daysUntilExpiry} days remaining)`;
}
function validateClientLicense(clientData) {
    if (!clientData.ClientId) {
        const error = new Error("The id does not exists");
        error.status = 400;
        throw error;
    }
    if (!clientData.ServerIp) {
        const error = new Error("Service not updated. Contact Support");
        error.status = 503;
        throw error;
    }
    const now = new Date();
    const licenseDate = new Date(clientData.LicenseSupportDate);
    const expirationLimit = new Date(licenseDate);
    expirationLimit.setDate(expirationLimit.getDate() + 1);
    if (now >= expirationLimit) {
        const error = new Error("License Expired. Contact Support");
        error.status = 401;
        throw error;
    }
}
function ensureBearerToken() {
    if (!bearerToken) {
        const error = new Error("Bearer token not found.");
        error.status = 401;
        throw error;
    }
    return bearerToken;
}
async function fetchBearerToken() {
    const response = await fetch(`${BASE_API_URL}/sysfunction/gettokenmob`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userid: "abc", password: "xyz" }),
    });
    const token = (await response.text()).trim();
    if (!response.ok || !token) {
        const error = new Error("Failed to fetch bearer token.");
        error.status = response.status || 502;
        throw error;
    }
    bearerToken = token;
}
function getFilePathFromUrl(requestUrl) {
    const { pathname } = new URL(requestUrl);
    const normalizedPath = decodeURIComponent(pathname);
    const relativePath = normalizedPath.replace(/^\/+/, "");
    if (normalizedPath === "/" || normalizedPath === "") {
        return node_path_1.default.join(OUT_DIR, "index.html");
    }
    if (node_path_1.default.extname(normalizedPath)) {
        return node_path_1.default.join(OUT_DIR, relativePath);
    }
    return node_path_1.default.join(OUT_DIR, relativePath, "index.html");
}
function getSafeFilePath(requestUrl) {
    const requestedFile = node_path_1.default.normalize(getFilePathFromUrl(requestUrl));
    if (!requestedFile.startsWith(OUT_DIR)) {
        return node_path_1.default.join(OUT_DIR, "index.html");
    }
    if (node_fs_1.default.existsSync(requestedFile)) {
        return requestedFile;
    }
    return node_path_1.default.join(OUT_DIR, "index.html");
}
async function registerProtocol() {
    electron_1.protocol.handle(APP_PROTOCOL, (request) => {
        const filePath = getSafeFilePath(request.url);
        return electron_1.net.fetch((0, node_url_1.pathToFileURL)(filePath).toString());
    });
}
function createWindow() {
    const mainWindow = new electron_1.BrowserWindow({
        width: 1440,
        height: 960,
        minWidth: 1024,
        minHeight: 720,
        autoHideMenuBar: true,
        backgroundColor: "#0c0a09",
        webPreferences: {
            preload: node_path_1.default.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
        },
    });
    if (DEV_SERVER_URL) {
        mainWindow.loadURL(DEV_SERVER_URL);
        return;
    }
    mainWindow.loadURL(`${APP_PROTOCOL}://${APP_HOST}/`);
}
electron_1.ipcMain.handle("device:getDeviceId", async () => getStoredDesktopDeviceId());
electron_1.ipcMain.handle("auth:fetchBearerToken", async () => {
    await fetchBearerToken();
});
electron_1.ipcMain.handle("auth:fetchCorporateClientData", async (_event, corporateId) => {
    const payload = await fetchJson(`${BASE_API_URL}/login/corporateid/${encodeURIComponent(String(corporateId).trim())}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${ensureBearerToken()}`,
            "Content-Type": "application/json",
        },
    }, "Failed to retrieve data from the server.");
    validateClientLicense(payload);
    return {
        data: payload,
        message: "Data retrieved successfully.",
        warningMessage: getExpiryWarningMessage(payload),
    };
});
electron_1.ipcMain.handle("auth:verifyDevice", async (_event, params) => {
    const payload = await fetchJson(`${BASE_API_URL}/login/device/${encodeURIComponent(params.clientId)}/${encodeURIComponent(params.SysName)}/${encodeURIComponent(params.fingerPrintId)}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${ensureBearerToken()}`,
            "Content-Type": "application/json",
        },
    }, "Failed to fetch device data.");
    return {
        data: payload,
        message: "Device data retrieved successfully.",
    };
});
electron_1.ipcMain.handle("auth:registerDevice", async (_event, payload) => {
    const response = await fetch(`${BASE_API_URL}/login/register_device`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${ensureBearerToken()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload, device_type: "R" }),
    });
    if (!response.ok) {
        const message = (await response.text()) || "Failed to register device.";
        const error = new Error(message);
        error.status = response.status;
        throw error;
    }
    return {
        success: true,
        message: "Registered successfully.",
    };
});
electron_1.ipcMain.handle("auth:logout", async () => {
    bearerToken = null;
});
electron_1.ipcMain.handle("rate-board:fetch", async (_event, clientId) => {
    const payload = await fetchJson(`${RATE_BOARD_API_URL}/Rate-${encodeURIComponent(String(clientId).trim())}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
        cache: "no-store",
    }, "Failed to fetch rate board data.");
    return {
        data: payload,
    };
});
electron_1.app.whenReady().then(async () => {
    if (!DEV_SERVER_URL) {
        await registerProtocol();
    }
    createWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
