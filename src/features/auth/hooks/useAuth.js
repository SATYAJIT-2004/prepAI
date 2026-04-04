import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;
  const navigate = useNavigate()
  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      if (!data || !data.user) {
        toast.error(data?.message || "User does not exist");
        return false;
      }
      setUser(data.user);
      toast.success("Login successful");

      return true;
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Login failed",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ username, email, password });
      if (!data || !data.user) {
        toast.error(data?.message || "User does not exist");
        return false;
      }
      setUser(data.user);
      toast.success("Register successfully successful");
      return true
    } catch (error) {
       toast.error(
        error?.response?.data?.message || error.message || "Login failed",
      );
      return false
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
       await logout();
      setUser(null);  
      navigate("/login", { replace: true });
    } catch (err) {
       toast.error(
        err?.response?.data?.message || err.message || "Login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAndSetUser = async () => {
      try {
        const data = await getMe();
        setUser(data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getAndSetUser();
  }, []);

  return { user, loading, handleRegister, handleLogin, handleLogout };
};
