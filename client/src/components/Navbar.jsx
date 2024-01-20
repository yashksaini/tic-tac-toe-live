import axios from "axios";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { BASE_URL } from "../main";
import logo from "@assets/logo.png";

const Navbar = () => {
  const { fullName, userId } = useSelector((state) => state.userAuth);
  const navLinks = [
    { text: "Home", link: "/", icon: "fa-solid fa-house" },
    { text: "Profile", link: `/profile/${userId}`, icon: "fa-solid fa-user" },
    { text: "Players", link: "/players", icon: "fa-solid fa-users" },
    {
      text: "Visits",
      link: "/visits",
      icon: "fa-solid fa-users-between-lines",
    },
  ];

  const logout = async () => {
    await axios.post(`${BASE_URL}/logout`);
    window.location.href = "/";
  };

  return (
    <nav>
      {/* Desktop Navbar */}
      <div className="hidden md:flex flex-col w-80 bg-background h-full fixed left-0 top-0 p-8 overflow-y-auto border-r">
        <div className="w-full flex  gap-1 justify-start items-center">
          <img src={logo} alt="Logo" className="w-10 h-10 " />
          <span className="text-gray-700 text-xl font-bold tracking-tighter mt-[4px]">
            CONNECT
          </span>
        </div>
        <div className="mt-6">
          {navLinks.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              className={({ isActive }) =>
                isActive
                  ? "text-white text-md flex justify-start items-center gap-2 text-xl bg-dark2 h-12 mb-4 rounded-md border"
                  : "text-gray-700 text-md flex justify-start items-center gap-2 text-xl  h-12 bg-white  mb-4 rounded-md border"
              }
            >
              <i
                className={`w-12 h-12 flex justify-center items-center text-sm ${item.icon}`}
              ></i>
              <span className="font-semibold">{item.text}</span>
            </NavLink>
          ))}
          <button className="w-full text-gray-700 text-md flex justify-start items-center gap-2  h-12 bg-white  mb-4 rounded-md border">
            <i className="w-12 h-12 flex justify-center items-center fa-solid fa-circle-user"></i>
            <span className="font-semibold text-primary">{fullName}</span>
          </button>
        </div>

        <button
          className="text-gray-700 text-md flex justify-start items-center gap-2 text-xl  h-12 bg-white mb-4 rounded-md mt-auto border"
          onClick={logout}
        >
          <i className="w-12 h-12 flex justify-center items-center text-sm fa-solid fa-right-from-bracket rotate-180"></i>
          <span className="font-semibold">Log Out</span>
        </button>
      </div>
      {/* Mobile Navbar */}
      <div className="w-full grid grid-cols-4 overflow-hidden gap-2 fixed bottom-0 left-0 h-16 bg-background rounded-tl-3xl rounded-tr-3xl md:hidden border">
        {navLinks.map((item, index) => {
          return (
            <NavLink
              key={index}
              to={item.link}
              className={({ isActive }) =>
                isActive
                  ? "text-white text-md flex justify-end items-center flex-col bg-dark2  rounded-tl-3xl rounded-tr-3xl"
                  : "text-dark2 text-md flex justify-end items-center flex-col"
              }
            >
              <i className={item.icon}></i>
              <small className="text-[10px] mt-[2px] leading-5 mb-2">
                {item.text}
              </small>
            </NavLink>
          );
        })}
        <button
          className="text-dark2 text-xl flex justify-center items-center "
          onClick={logout}
        >
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
