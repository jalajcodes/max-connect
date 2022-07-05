import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupHandler } from "./authenticationSlice";
import { validateEmail, validatePassword } from "./auth-utils";

export const Signup = () => {
  const { token, isLoading } = useSelector((store) => store.authentication);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [signupFormError, setSignupFormError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let flagErr = false;
    let newFormError = {};
    Object.keys(signupFormError).forEach((key) => {
      newFormError[key] = "";
      if (signupForm[key] === "" && key !== "confirm-password") {
        newFormError[key] = `${key} shouldn't be empty`;
        flagErr = true;
      }
    });
    if (signupFormError.password) return;
    if (flagErr) {
      setSignupFormError(newFormError);
      return;
    }
    dispatch(
      signupHandler({
        username: signupForm.email,
        password: signupForm.password,
        firstName: signupForm.firstName,
        lastName: signupForm.lastName,
      })
    );
  };

  return (
    <div className="z-10 bg-background dark:bg-dark-bg-paper shadow-lg rounded-md w-1/3 mt-10 md:mx-10 px-12 sm:px-6 animate-slideLeft">
      {isLoading ? (
        <div className="fixed top-0 bg-background-dim left-0 w-full h-full flex justify-center items-center">
          <img src="/assets/loader.png" alt="" />
        </div>
      ) : null}

      <h2 className="text-center text-4xl mt-3 text-indigo-900 dark:text-dark-txt-secondary font-display font-semibold">
        Sign up
      </h2>
      <div className="mt-4">
        <form className="flex flex-col" onSubmit={onSubmitHandler}>
          <div className="justify-self-stretch flex-grow">
            <div className="text-sm text-gray-700 dark:text-white tracking-wide mb-1">
              First Name
            </div>
            <input
              value={signupForm.firstName}
              onChange={(e) => {
                setSignupForm({ ...signupForm, firstName: e.target.value });
                setSignupFormError({ ...signupFormError, firstName: "" });
              }}
              className="w-full text-sm p-2 outline-none focus:outline-offset-0 focus:outline-primary rounded-md border-gray-300 border dark:border-dark-border-input dark:bg-dark-bg-input dark:text-dark-txt-input"
              type="text"
              placeholder="Harvey"
            />
          </div>
          <div className="justify-self-stretch flex-grow mt-4">
            <div className="text-sm text-gray-700 dark:text-white tracking-wide mb-1">
              Last Name
            </div>
            <input
              className="w-full text-sm p-2 outline-none focus:outline-offset-0 focus:outline-primary rounded-md border-gray-300 border dark:border-dark-border-input dark:bg-dark-bg-input dark:text-dark-txt-input"
              type="text"
              placeholder="Specter"
              value={signupForm.lastName}
              onChange={(e) => {
                setSignupForm({ ...signupForm, lastName: e.target.value });
                setSignupFormError({ ...signupFormError, lastName: "" });
              }}
            />
          </div>
          {signupFormError.firstName || signupFormError.lastName ? (
            <div className="text-red-500 font-semibold self-center text-sm">
              {"Firstname or lastname can't be empty"}
            </div>
          ) : null}
          <div className="mt-4">
            <div className="text-sm text-gray-700 dark:text-white tracking-wide mb-1">
              Email Address
            </div>
            <input
              className="w-full text-sm p-2 outline-none focus:outline-offset-0 focus:outline-primary rounded-md border-gray-300 border dark:border-dark-border-input dark:bg-dark-bg-input dark:text-dark-txt-input"
              type="email"
              placeholder="specter@gmail.com"
              value={signupForm.email}
              onChange={(e) => {
                setSignupForm({ ...signupForm, email: e.target.value });
                if (!validateEmail(e.target.value)) {
                  setSignupFormError({
                    ...signupFormError,
                    email: "Email should be in correct format",
                  });
                } else {
                  setSignupFormError({ ...signupFormError, email: "" });
                }
              }}
            />
            {signupFormError.email ? (
              <div className="text-red-500 font-semibold self-center text-sm">
                {signupFormError.email}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col mt-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700 dark:text-white tracking-wide mb-1">
                Password
              </div>
            </div>
            <div className="flex items-center border-gray-300 focus:border-indigo-500 relative">
              <input
                className="w-full text-sm p-2 outline-none focus:outline-offset-0 focus:outline-primary rounded-md border-gray-300 border dark:border-dark-border-input dark:bg-dark-bg-input dark:text-dark-txt-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={signupForm.password}
                onChange={(e) => {
                  setSignupForm({ ...signupForm, password: e.target.value });
                  if (!validatePassword(e.target.value)) {
                    setSignupFormError({
                      ...signupFormError,
                      password:
                        "Password should be in 8 to 20 chars and should have one digit",
                    });
                  } else {
                    setSignupFormError({ ...signupFormError, password: "" });
                  }
                }}
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
            {signupFormError.password ? (
              <div className="text-red-500 font-semibold self-center text-sm break-words">
                {signupFormError.password}
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
              Sign up
            </button>
          </div>
        </form>
        <div className="mt-8 sm:mt-8 mb-6 text-sm font-display font-semibold text-gray-700 dark:text-dark-txt-secondary text-center">
          Already have an account?{" "}
          <Link
            to={"/login"}
            replace={true}
            className="cursor-pointer text-indigo-600 dark:text-primary dark:hover:opacity-80 hover:text-indigo-800"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
