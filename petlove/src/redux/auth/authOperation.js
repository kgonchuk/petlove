import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Notiflix from "notiflix";

axios.defaults.baseURL = "https://petlove.b.goit.study/api/";

const setAuthHeader = (token) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = "";
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post("users/signup", userData);
      setAuthHeader(res.data.token);
      Notiflix.Notify.success("Welcome to PetLove project!");
      return res.data;
    } catch (error) {
      Notiflix.Notify.failure(error.response.data.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logIn = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const res = await axios.post("/users/signin", userData);
      setAuthHeader(res.data.token);
      Notiflix.Notify.success("Welcome back to PetLove project!");
      return res.data;
    } catch (error) {
      Notiflix.Notify.failure(error.response.data.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logOut = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await axios.post("/users/signout");
    clearAuthHeader();
    Notiflix.Notify.success("We are waiting for you again!");
  } catch (error) {
    Notiflix.Notify.failure(error.response.data.message);
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const refreshUser = createAsyncThunk(
  "auth/refreshUser",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const persistedToken = state.auth.token;

    if (persistedToken === null) {
      return rejectWithValue("Unable to fetch user");
    }
    try {
      setAuthHeader(persistedToken);
      const refreshedUser = await axios.get("/users/current");
      return refreshedUser.data;
    } catch (error) {
      Notiflix.Notify.failure(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);
export const editUserInfo = createAsyncThunk(
  "user/editUserInfo",
  async (editData, thunkAPI) => {
    try {
      const resp = await axios.patch("/users/current/edit", editData);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const getAllUserInfo = createAsyncThunk(
  "user/getAllUserInfo",
  async (_, thunkAPI) => {
    try {
      const resp = await axios.get("/users/current/full");
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);
