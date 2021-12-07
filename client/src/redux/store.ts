import userReducer from "./userReducer";
import journalReducer from "./journalReducer";
import { combineReducers, createStore } from "redux";
const reducers=combineReducers({
  user:userReducer,
  journal:journalReducer
});
const store=createStore(reducers);
export default store;
export type RootState = ReturnType<typeof store.getState>;