import api from "../../api/api";
import { loadUser, logoutUser, setUserLoading } from "../features/userSlice";
import { toast } from "sonner";

export const registerUser = (userDetails) => async (dispatch, getState) => {
  const email = userDetails.email.trim();
  const password = userDetails.password.trim();
  const firstName = userDetails.firstName.trim();
  const lastName = userDetails.lastName.trim();
  if (email === "" || password === "" || firstName === "" || lastName === "")
    return;

  try {
    const { data } = await api.post("/api/auth/register", {
      fullName: { firstName, lastName },
      email,
      password,
    });
    dispatch(loadUser(data.user));
    return { success: true };
  } catch (error) {
    console.log(error);
    toast("An error occured. Please try again.");

    return { success: false };
  }
};

export const loginUser = (userDetails) => async (dispatch, getState) => {
  const email = userDetails.email.trim();
  const password = userDetails.password.trim();
  if (email === "" || password === "") return;

  try {
    const { data } = await api.post("/api/auth/login", {
      email,
      password,
    });

    dispatch(loadUser(data.user));
    return { success: true };
  } catch (error) {
    console.log(error);
    toast("An error occured. Please try again.");

    return { success: false };
  }
};

export const getUser = () => async (dispatch) => {
  dispatch(setUserLoading(true));

  try {
    const { data } = await api.get("/api/user");
    dispatch(loadUser(data.user));
  } catch (error) {
    console.log(error);
  } finally {
    dispatch(setUserLoading(false));
  }
};

export const logOutUser = () => async (dispatch) => {
  try {
    await api.post("/api/user/logout");
    dispatch(logoutUser());
  } catch (error) {
    toast("An error occured. Please try again.");
    console.log("Logout request failed:", error);
  }
};
