declare const process: { env?: { TAURI_PLATFORM?: string } } | undefined;

const IS_TAURI = typeof process !== "undefined" && !!process.env?.TAURI_PLATFORM;

const LOCAL_BACKEND_IP = "http://89.208.210.115:8006";
const LOCAL_MINIO_IP = "http://89.208.210.115:8001";

export const PUBLIC_BACKEND_URL = "https://reagent-mass-calculation.duckdns.org";
export const PUBLIC_MINIO_URL = "https://storage-reagent-mass.duckdns.org";

export const FRONT_HOST = "localhost";
export const FRONT_PORT = 3000;

export const BACKEND_PATH = IS_TAURI ? LOCAL_BACKEND_IP : PUBLIC_BACKEND_URL;
export const MINIO_PATH = IS_TAURI ? LOCAL_MINIO_IP : PUBLIC_MINIO_URL;

export const ROUTER_BASENAME = IS_TAURI ? "/" : "/rip_frontend";

export const API_BASE = `${BACKEND_PATH}/api/v1`;
export const USE_MOCK = false;
