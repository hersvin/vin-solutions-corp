import { useEffect, useState } from "react";

export function useCompanyToast() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [message]);
  return { message, showToast: setMessage };
}
