export const getSandboxUrl = () => {
  return import.meta.env.VITE_SANDBOX_URL || 'http://localhost:8080';
};

export const syncNgrokUrl = async () => {
  localStorage.removeItem("SANDBOX_URL");
  return getSandboxUrl();
};
