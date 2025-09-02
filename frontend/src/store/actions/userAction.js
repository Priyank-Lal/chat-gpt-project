import api from "../../api/api";
import { loadUser } from "../features/userSlice";

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
    return { success: false };
  }
};

export const getUser = () => async (dispatch) => {
  try {
    const { data } = await api.get("/api/user");
    dispatch(loadUser(data.user));
  } catch (error) {
    console.log(error);
    // TODO: Replace with toast notification system
    alert("Failed to load user data. Please try again.");
  }
};
