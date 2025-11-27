// src/api/headerApi.js
import api from "./axiosInstance";

export async function getOfficerProfile() {
  console.log("[headerApi] getOfficerProfile → start");

  try {
    const res = await api.get("/api/staffs/me");
    console.log("[headerApi] getOfficerProfile → success", res.data);
    return res.data;
  } catch (err) {
    console.error("[headerApi] getOfficerProfile → error", err);
    throw new Error("Failed to load officer profile");
  }
}

export async function getFieldWorkers() {
  console.log("[headerApi] getFieldWorkers → start");

  try {
    const res = await api.get("/api/staffs/field-workers");
    console.log("[headerApi] getFieldWorkers → success", res.data);
    return res.data;
  } catch (err) {
    console.error("[headerApi] getFieldWorkers → error", err);
    throw new Error("Failed to load workers list");
  }
}
