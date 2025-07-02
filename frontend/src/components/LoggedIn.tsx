import { useEffect } from "react";

const RedirectIfNotLoggedIn = () => {
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === null) {
      window.location.href = "/login";
    }
  }, []);
  return null;
};

export default RedirectIfNotLoggedIn;