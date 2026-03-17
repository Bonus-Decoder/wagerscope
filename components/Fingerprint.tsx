"use client";

import { useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import Cookies from "js-cookie";

export default function Fingerprint() {
  useEffect(() => {
    const existing = Cookies.get("dfp");
    if (existing) return;

    FingerprintJS.load()
      .then((fp) => fp.get())
      .then((result) => {
        Cookies.set("dfp", result.visitorId, { expires: 30 });
      })
      .catch(() => {
        // Silently fail — fingerprinting is best-effort
      });
  }, []);

  return null;
}
