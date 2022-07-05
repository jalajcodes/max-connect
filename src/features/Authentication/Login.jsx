import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginHandler } from "./authenticationSlice";
import { validateEmail } from "./auth-utils";

export const Login = () => {
  const { token, isLoading } = useSelector((store) => store.authentication);
  const dipatch = useDispatch();

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });
  const [loginInputError, setLoginInputError] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let flagErr = false;
    let newFormError = {};
    Object.keys(loginInputError).forEach((key) => {
      newFormError[key] = "";
      if (loginInput[key] === "") {
        newFormError[key] = `${key} shouldn't be empty`;
        flagErr = true;
      }
    });

    if (flagErr) {
      setLoginInputError(newFormError);
      return;
    }
    dipatch(
      loginHandler({
        username: loginInput.email,
        password: loginInput.password,
      })
    );
  };

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  return (
    <div className="z-10 animate-slideRight bg-background dark:bg-dark-bg-paper shadow-lg rounded-md w-1/3 mt-10 md:mx-10 px-12 sm:px-6 p-3">
      {isLoading ? (
        <div className="fixed top-0 bg-background-dim left-0 w-full h-full flex justify-center items-center z-20">
          <img src="/assets/loader.png" alt="" />
        </div>
      ) : null}
      <h2 className="text-center text-4xl mt-3 text-indigo-900 dark:text-dark-txt-secondary font-display font-semibold">
        Sign in
      </h2>
      <div className="mt-4">
        <form onSubmit={onSubmitHandler}>
          <div className="flex flex-col">
            <div className="text-sm text-gray-700 dark:text-white tracking-wide mb-1">
              Email Address
            </div>
            <div className="border-gray-300">
              <input
                className="w-full text-sm p-2 outline-none focus:outline-offset-0 focus:outline-primary rounded-md border-gray-300 border dark:border-dark-border-input dark:bg-dark-bg-input dark:text-dark-txt-input"
                type="email"
                value={loginInput.email}
                onChange={(e) => {
                  setLoginInput({ ...loginInput, email: e.target.value });
                  if (!validateEmail(e.target.value)) {
                    setLoginInputError({
                      ...loginInputError,
                      email: "Email should be in correct format",
                    });
                  } else {
                    setLoginInputError({ ...loginInputError, email: "" });
                  }
                }}
                placeholder="mike@gmail.com"
              />
            </div>
            {loginInputError.email ? (
              <div className="text-red-500 font-semibold self-center text-sm">
                {loginInputError.email}
              </div>
            ) : null}
          </div>
          <div className="mt-4 flex flex-col">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700 dark:text-white tracking-wide mb-1">
                Password
              </div>
            </div>
            <div className="flex items-center border-gray-300 relative">
              <input
                value={loginInput.password}
                className="w-full text-sm p-2 outline-none focus:outline-offset-0 focus:outline-primary rounded-md border-gray-300 border dark:border-dark-border-input dark:bg-dark-bg-input dark:text-dark-txt-input"
                type={showPassword ? "text" : "password"}
                onChange={(e) => {
                  setLoginInput({ ...loginInput, password: e.target.value });
                  if (e.target.value !== "") {
                    setLoginInputError({
                      ...loginInputError,
                      password: "",
                    });
                  }
                }}
                placeholder="Enter your password"
              />
              {!showPassword ? (
                <i
                  onClick={() => setShowPassword(true)}
                  className="text-lg cursor-pointer text-txt-secondary-color far fa-eye-slash absolute right-4"
                ></i>
              ) : (
                <i
                  onClick={() => setShowPassword(false)}
                  className="text-lg cursor-pointer text-txt-secondary-color far fa-eye absolute right-4"
                ></i>
              )}
            </div>
            {loginInputError.password ? (
              <div className="text-red-500 font-semibold self-center text-sm">
                {loginInputError.password}
              </div>
            ) : null}
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <button
              className="bg-primary text-white p-2 sm:p-2 w-full rounded-md tracking-wide
                font-semibold font-display hover:opacity-90 active:bg-blue-500
                shadow-lg"
              type="submit"
            >
              Sign In
            </button>
            <button
              type="submit"
              onClick={() => {
                setLoginInput({
                  email: "jalaj@gmail.com",
                  password: "test1234",
                });

                setLoginInputError({ email: "", password: "" });
              }}
              className="bg-primary text-white p-2 sm:p-2 w-full rounded-md tracking-wide
                font-semibold font-display hover:opacity-90 active:bg-blue-500
                shadow-lg"
            >
              Sign In as Guest
            </button>
          </div>
        </form>
        <div className="mt-8 sm:mt-8 mb-6 text-sm font-display font-semibold text-gray-700 dark:text-dark-txt-secondary text-center">
          Don't have an account?{" "}
          <Link
            to={"/signup"}
            replace={true}
            state={location.state}
            className="cursor-pointer text-indigo-600 dark:text-primary dark:hover:opacity-80 hover:text-indigo-800"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};
