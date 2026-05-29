export const getSandboxUrl = () => {
  return "";
};


export const syncNgrokUrl = async () => {
  localStorage.removeItem("SANDBOX_URL");
  return getSandboxUrl();
};
