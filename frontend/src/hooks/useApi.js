import api from "../api/axios";
import { toast } from "react-toastify";

/**
 * useApi hook
 * - Auto retries failed calls (default 1 retry)
 * - Centralized toast for success & error
 */
export const useApi = () => {
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const handleError = (err) => {
    console.error(err);
    const message =
      err.response?.data?.message || "Something went wrong. Try again.";
    toast.error(message);
  };

  const handleSuccess = (msg) => {
    if (msg) toast.success(msg);
  };

  const requestWithRetry = async (fn, retries = 1) => {
    try {
      return await fn();
    } catch (err) {
      if (retries > 0) {
        console.warn("Retrying API call...");
        return requestWithRetry(fn, retries - 1);
      } else {
        handleError(err);
        throw err;
      }
    }
  };

  const get = (url) =>
    requestWithRetry(async () => {
      const res = await api.get(url, config);
      return res.data;
    });

  const post = (url, data, successMsg = "Success!") =>
    requestWithRetry(async () => {
      const res = await api.post(url, data, config);
      handleSuccess(successMsg);
      return res.data;
    });

  const put = (url, data, successMsg = "Updated successfully!") =>
    requestWithRetry(async () => {
      const res = await api.put(url, data, config);
      handleSuccess(successMsg);
      return res.data;
    });

  const del = (url, successMsg = "Deleted successfully!") =>
    requestWithRetry(async () => {
      const res = await api.delete(url, config);
      handleSuccess(successMsg);
      return res.data;
    });

  return { get, post, put, del };
};
