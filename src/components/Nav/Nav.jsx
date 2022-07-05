import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useOutsideClickHandler } from "../../custom-hooks";
import { searchFunc } from "../../utils/searchUtils";
import { darkTheme, lightTheme } from "./ThemeSlice";

export const Nav = () => {
  const navigate = useNavigate();
  const { theme } = useSelector((store) => store.theme);
  const dispatch = useDispatch();
  const searchInputRef = useRef();
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef();
  let timerId = useRef();
  const [searchInput, setSearchInput] = useState("");
  const [searchedData, setSearchData] = useState([]);
  const { resetMenu } = useOutsideClickHandler(searchRef);
  const { user } = useSelector((store) => store.authentication);
  const { allUsers } = useSelector((store) => store.users);

  useEffect(() => {
    clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      setSearchData(searchFunc(allUsers, searchInput));
    }, 500);
  }, [searchInput]);

  useEffect(() => {
    if (resetMenu) {
      setShowSearch(false);
      setSearchInput("");
      setSearchData([]);
    }
  }, [resetMenu]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  return (
    <nav className="w-full sticky top-0 min h-20 sm:h-18 left-0 right-0 leading-10 z-40 dark:bg-dark-bg-paper drop-shadow-xl bg-nav-background shadow">
      <div className="flex justify-between relative items-center p-4 sm:p-2  h-full">
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

        <ul className="text-primary flex items-center gap-4 text-2xl">
          <li
            title="search"
            onClick={() => {
              setShowSearch(true);
            }}
            className="cursor-pointer flex items-center"
          >
            <i className="ri-search-line"></i>
          </li>
          {theme === "dark" ? (
            <li
              title="theme"
              onClick={() => dispatch(lightTheme())}
              className="cursor-pointer flex items-center"
            >
              <i className="ri-sun-line"></i>
            </li>
          ) : (
            <li
              title="theme"
              onClick={() => dispatch(darkTheme())}
              className="cursor-pointer flex items-center"
            >
              <i className="far fa-moon"></i>
            </li>
          )}
          <li
            title="explore"
            onClick={() => navigate("/explore")}
            className="cursor-pointer flex items-center"
          >
            <i className="ri-compass-3-line"></i>
          </li>
          <li
            title="feed"
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center"
          >
            <i className="ri-home-8-line"></i>
          </li>

          <li className="cursor-pointer">
            <img
              onClick={() => navigate(`/profile/${user.userHandler}`)}
              className="w-10 h-10 object-cover rounded-full"
              src={user?.pic}
              alt="profile"
            />
          </li>
        </ul>
      </div>
      {showSearch ? (
        <div className="absolute top-0 w-full h-screen flex  justify-center bg-background-dim">
          <i
            onClick={() => {
              setShowSearch(false);
              setSearchData([]);
              setSearchInput("");
            }}
            className="absolute right-2 sm:mt-24 mt-6 text-dark-txt-primary fas fa-times-circle text-3xl"
          ></i>
          <div
            ref={searchRef}
            className="sm:w-9/12 w-2/5 mt-6 sm:mt-24 flex flex-col gap-5 items-center"
          >
            <input
              value={searchInput}
              className="w-full bg-background dark:bg-dark-bg text-dark-txt-secondary rounded-lg focus:outline-none px-4"
              type="text"
              ref={searchInputRef}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for users..."
            />

            <div className="flex w-full flex-col gap-4   max-h-96 z-50 overflow-y-auto rounded-lg   bg-background dark:bg-dark-bg">
              {searchInput !== "" && searchedData.length === 0 ? (
                <p className="text-center text-lg m-1 font-medium text-txt-secondary-color dark:text-dark-txt-primary">
                  No user to show
                </p>
              ) : (
                searchedData.map((user) => {
                  return (
                    <div
                      key={user._id}
                      onClick={() => {
                        navigate(`/profile/${user.userHandler}`);
                        setShowSearch(false);
                      }}
                      className="px-4 pt-3 last-of-type:pb-3 cursor-pointer  flex gap-4 items-center"
                    >
                      <img
                        className="w-14  h-14 object-cover rounded-full"
                        src={user.pic}
                        alt="user pic"
                      />
                      <p className="font-medium text-lg text-txt-secondary-color dark:text-dark-txt-secondary">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
};
