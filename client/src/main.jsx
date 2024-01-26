import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { io } from "socket.io-client";
import { HashRouter } from "react-router-dom";
import axios from "axios";

// export const BASE_URL = "http://localhost:3000";
export const BASE_URL = "https://xo-connect.onrender.com";
const socket = io(BASE_URL);
axios.defaults.withCredentials = true;
ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  </HashRouter>
);
