export const API_BASE_URL = "http://localhost:8000";

export const uploadCertificate = async (file: File, forceReanalyze: boolean = false) => {
  const formData = new FormData();
  formData.append("file", file);
  if (forceReanalyze) {
      formData.append("force_reanalyze", "true");
  }

  const response = await fetch(`${API_BASE_URL}/api/verify`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to verify certificate");
  }

  return response.json();
};

export const getCertificate = async (certId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/certificate/${certId}`);
  if (!response.ok) {
    throw new Error("Certificate not found");
  }
  return response.json();
};

export const getStats = async () => {
  const response = await fetch(`${API_BASE_URL}/api/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch statistics");
  }
  return response.json();
};

export const quickVerifyFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE_URL}/api/quick-verify-file`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

export const getDownloadUrl = (filename: string) => {
  return `${API_BASE_URL}/api/download/${filename}`;
};
