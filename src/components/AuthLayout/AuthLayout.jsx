import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { initOciliator } from "../../utils/oscillator";
import { darkTheme, lightTheme, toggleAnim } from "../Nav/ThemeSlice";

export const AuthLayout = ({ children }) => {
  const { theme, anim } = useSelector((store) => store.theme);
  const [hideCanvas, setHideCanvas] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (anim) {
      setHideCanvas(false);
      initOciliator(false, theme);
    } else {
      setHideCanvas(true);
    }

    return () => {
      initOciliator(true);
    };
  }, [anim, theme]);

  return (
    <>
      <div className="w-full min-h-screen flex items-center justify-center flex-col bg-blob bg-no-repeat bg-center -z-10">
        <ul className="absolute justify-between w-full px-4 top-4 dark:text-white z-10 flex">
          <li
            title="play"
            onClick={() => dispatch(toggleAnim())}
            className="cursor-pointer flex items-center transition-all duration-300 hover:rotate-45"
          >
            <i
              className={`${
                anim ? "ri-stop-circle-line" : "ri-play-circle-line"
              } text-4xl`}
            ></i>
          </li>
          <div
            onClick={() => navigate("/")}
            className="flex gap-2 items-center cursor-pointer"
          >
            <img
              className="h-12 sm:h-10 max-w-full align-middle"
              src="/assets/logo.png"
              alt="hero"
            />
          </div>
          {theme === "dark" ? (
            <li
              title="theme"
              onClick={() => dispatch(lightTheme())}
              className="cursor-pointer flex items-center transition-all duration-300 hover:rotate-45"
            >
              <i className="ri-sun-line text-4xl"></i>
            </li>
          ) : (
            <li
              title="theme"
              onClick={() => dispatch(darkTheme())}
              className="cursor-pointer flex items-center transition-all duration-500 -rotate-45 hover:rotate-0"
            >
              <i className="far fa-moon text-3xl"></i>
            </li>
          )}
        </ul>
        {children}
      </div>
      <canvas
        id="oscillator"
        className={`absolute top-0 bottom-0 left-0 right-0 ${
          hideCanvas && "hidden"
        }`}
      ></canvas>
    </>
  );
};
