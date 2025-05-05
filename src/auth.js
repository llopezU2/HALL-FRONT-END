export const auth = {
  isAuthenticated: () => !!localStorage.getItem("token"),
  login: (token) => localStorage.setItem("token", token),
  logout: () => localStorage.removeItem("token"),
};
