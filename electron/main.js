const { app, BrowserWindow, ipcMain, protocol, net } = require("electron");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "https://mobileapp.parasinfotech.co.in/api";
const RATE_BOARD_API_URL =
  "https://report-api-742717265610.asia-south1.run.app/api/Report/rate";
const APP_PROTOCOL = "app";
const APP_HOST = "-";
const OUT_DIR = path.join(__dirname, "..", "out");
const DEV_SERVER_URL = process.env.ELECTRON_DEV_SERVER_URL;

let bearerToken = null;

function getErrorMessage(payload, fallbackMessage) {
  if (payload && typeof payload === "object" && "message" in payload) {
    return payload.message || fallbackMessage;
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

  const daysUntilExpiry = Math.ceil(
    (licenseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const actualExpiryDate = new Date(licenseDate);
  actualExpiryDate.setDate(licenseDate.getDate() + 1);

  return `Your subscription will expire on ${actualExpiryDate.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  )} (${daysUntilExpiry} days remaining)`;
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
    return path.join(OUT_DIR, "index.html");
  }

  if (path.extname(normalizedPath)) {
    return path.join(OUT_DIR, relativePath);
  }

  return path.join(OUT_DIR, relativePath, "index.html");
}

function getSafeFilePath(requestUrl) {
  const requestedFile = path.normalize(getFilePathFromUrl(requestUrl));

  if (!requestedFile.startsWith(OUT_DIR)) {
    return path.join(OUT_DIR, "index.html");
  }

  if (fs.existsSync(requestedFile)) {
    return requestedFile;
  }

  return path.join(OUT_DIR, "index.html");
}

async function registerProtocol() {
  protocol.handle(APP_PROTOCOL, (request) => {
    const filePath = getSafeFilePath(request.url);
    return net.fetch(pathToFileURL(filePath).toString());
  });
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1024,
    minHeight: 720,
    autoHideMenuBar: true,
    backgroundColor: "#0c0a09",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
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

ipcMain.handle("auth:fetchBearerToken", async () => {
  await fetchBearerToken();
});

ipcMain.handle("auth:fetchCorporateClientData", async (_event, corporateId) => {
  const payload = await fetchJson(
    `${BASE_API_URL}/login/corporateid/${encodeURIComponent(String(corporateId).trim())}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ensureBearerToken()}`,
        "Content-Type": "application/json",
      },
    },
    "Failed to retrieve data from the server."
  );

  validateClientLicense(payload);

  return {
    data: payload,
    message: "Data retrieved successfully.",
    warningMessage: getExpiryWarningMessage(payload),
  };
});

ipcMain.handle("auth:verifyDevice", async (_event, params) => {
  const payload = await fetchJson(
    `${BASE_API_URL}/login/device/${encodeURIComponent(params.clientId)}/${encodeURIComponent(
      params.SysName
    )}/${encodeURIComponent(params.fingerPrintId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${ensureBearerToken()}`,
        "Content-Type": "application/json",
      },
    },
    "Failed to fetch device data."
  );

  return {
    data: payload,
    message: "Device data retrieved successfully.",
  };
});

ipcMain.handle("auth:registerDevice", async (_event, payload) => {
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

ipcMain.handle("auth:logout", async () => {
  bearerToken = null;
});

ipcMain.handle("rate-board:fetch", async (_event, clientId) => {
  const payload = await fetchJson(
    `${RATE_BOARD_API_URL}/Rate-${encodeURIComponent(String(clientId).trim())}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
    "Failed to fetch rate board data."
  );

  return {
    data: payload,
  };
});

app.whenReady().then(async () => {
  if (!DEV_SERVER_URL) {
    await registerProtocol();
  }

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
