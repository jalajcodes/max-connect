import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Nav } from "../../components";
import "./PostFeedPage.css";
import { useOutsideClickHandler } from "../../custom-hooks";

import { FollowChip } from "./components/FollowChip/FollowChip";
import PostFeedCard from "./components/PostFeedCard/PostFeedCard";
import { addPost, getAllPosts, getAllPostsByObserver } from "./PostsSlice";
import { getAllUsers } from "./UserSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { emojiArray } from "../../utils/emoji";

const LIMIT = 2;

export const PostFeedPage = () => {
  const location = useLocation();
  const [pageNo, setPageNo] = useState(0);

  const loader = useRef(null);
  const { user, token } = useSelector((store) => store.authentication);
  const emojiContainerRef = useRef();
  const { resetMenu } = useOutsideClickHandler(emojiContainerRef);
  const [showEmojis, setShowEmojis] = useState(false);
  const { allPosts, isLoading, isLoadingMorePosts } = useSelector(
    (store) => store.posts
  );

  const [customLoader, setCustomLoader] = useState(false);
  const { allUsers } = useSelector((store) => store.users);
  const [postInputForm, setPostInputForm] = useState({
    content: "",
    pic: "",
  });
  const dispatch = useDispatch();
  const [subNav, setSubNav] = useState("latest");
  const [filteredPosts, setFilteredPost] = useState([]);
  const navigate = useNavigate();
  const imageUploadRef = useRef();

  useEffect(() => {
    dispatch(getAllUsers());

    const elementRef = loader.current;
    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setPageNo((prev) => ++prev);
      }
    };
    const observer = new IntersectionObserver(handleObserver);
    if (elementRef) observer.observe(elementRef);

    return () => {
      observer.unobserve(elementRef);
    };
  }, [dispatch]);

  useEffect(() => {
    setCustomLoader(true);
    setPageNo(0);

    if (location.pathname !== "/explore") dispatch(getAllPosts());

    const id = setTimeout(() => {
      setCustomLoader(false);
    }, 1000);

    return () => clearTimeout(id);
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (location.pathname === "/explore") {
      dispatch(getAllPostsByObserver({ limit: LIMIT, page: pageNo }));
    }
  }, [pageNo, location, dispatch]);

  useEffect(() => {
    if (location.pathname.includes("explore")) {
      setFilteredPost(allPosts);
    } else {
      setFilteredPost(
        allPosts.filter(
          (post) =>
            user?.followers?.some((p) => p?._id === post?.userId) ||
            user?.following?.some((p) => p?._id === post?.userId) ||
            user?._id === post.userId
        )
      );
    }
  }, [allPosts, user, location]);

  useEffect(() => {
    if (resetMenu) setShowEmojis(false);
  }, [resetMenu]);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    let base64File = await toBase64(file);
    setPostInputForm({ ...postInputForm, pic: base64File });
  };

  return (
    <>
      <Nav />
      {isLoading || customLoader ? (
        <div className="fixed z-50 top-0 bg-background-dim left-0 w-full h-full flex justify-center items-center">
          <img src="/assets/loader.png" alt="loader" />
        </div>
      ) : null}
      <main className="p-4">
        <div className="flex justify-center mx-auto max-w-7xl">
          <div
            className={`grid ${
              location.pathname.includes("explore")
                ? "grid-cols-3"
                : "grid-cols-4"
            } gap-4 md:w-full md:grid-cols-1`}
          >
            {!location.pathname.includes("/explore") ? (
              <div>
                <div
                  className="flex flex-col bg-nav-background  dark:bg-dark-secondary-background 
                text-txt-color
                dark:text-dark-txt-primary rounded-lg drop-shadow-2xl"
                >
                  <div className="px-4 pt-4">
                    <h1 className="text-xl">Create Post</h1>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-col gap-4 grow">
                      <div className="flex items-center gap-4 grow dark:bg-dark-bg-paper bg-secondary-background p-3 rounded-md">
                        <img
                          className="h-14 w-14 rounded-full object-cover"
                          src={user?.pic}
                          alt="profile-img"
                        />
                        <input
                          className="grow p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-normal text-txt-secondary-color text-sm dark:bg-dark-secondary-background dark:text-dark-txt-secondary"
                          placeholder={`What's on your mind?`}
                          value={postInputForm.content}
                          onChange={(e) =>
                            setPostInputForm({
                              ...postInputForm,
                              content: e.target.value,
                            })
                          }
                          type="text"
                        />
                      </div>
                      {postInputForm.pic ? (
                        <div className="relative">
                          <img src={postInputForm.pic} alt="post pic" />
                          <i
                            onClick={() =>
                              setPostInputForm({ ...postInputForm, pic: "" })
                            }
                            className="absolute top-1 right-1 text-4xl text-txt-hover-color cursor-pointer fas fa-times-circle"
                          ></i>
                        </div>
                      ) : null}

                      <ul className="flex gap-4 font-light items-center justify-center">
                        <li
                          onClick={() => imageUploadRef.current.click()}
                          className="relative grow flex items-center gap-3 bg-secondary-background dark:bg-dark-bg-paper py-2 px-3 rounded-md cursor-pointer"
                        >
                          <span className="text-2xl">🖼️</span>
                          <p className="text-primary text-sm font-semibold cursor-pointer">
                            Image
                          </p>
                          <input
                            className="cursor-pointer absolute left-20 w-28 opacity-0 hidden"
                            accept="image/apng, image/avif, image/gif, image/jpeg, image/png, image/svg+xml, image/jpg,image/webp"
                            type="file"
                            onChange={onFileChange}
                            ref={imageUploadRef}
                          />
                        </li>
                        <li
                          onClick={(e) => {
                            setShowEmojis(true);
                            if (
                              e.target.childNodes.length === 1 &&
                              e.target.innerText !== "Emojis"
                            ) {
                              setPostInputForm({
                                ...postInputForm,
                                content:
                                  postInputForm.content + e.target.innerText,
                              });
                            }
                          }}
                          className="relative grow flex items-center gap-3 bg-secondary-background dark:bg-dark-bg-paper py-2 px-3 rounded-md cursor-pointer"
                        >
                          <span className="text-2xl">😇</span>
                          <p className="text-primary text-sm font-semibold">
                            Emojis
                          </p>
                          {showEmojis ? (
                            <div
                              ref={emojiContainerRef}
                              className="absolute w-48 right-20 top-5 p-4 flex flex-wrap justify-center items-center gap-2 rounded-lg dark:bg-dark-bg-paper bg-secondary-background"
                            >
                              {emojiArray.map((el) => {
                                return (
                                  <span
                                    key={el}
                                    className="cursor-pointer text-2xl"
                                  >
                                    {el}
                                  </span>
                                );
                              })}
                            </div>
                          ) : null}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      dispatch(
                        addPost({
                          postData: { ...postInputForm, userId: user._id },
                          authToken: token,
                        })
                      );
                      setPostInputForm({ content: "", pic: "" });
                    }}
                    disabled={postInputForm.content ? false : true}
                    className={`mb-4 mx-4 p-2 bg-primary active:bg-blue-500 text-white disabled:dark:bg-primary disabled:opacity-50 rounded-lg ${
                      postInputForm.content
                        ? ""
                        : "cursor-not-allowed bg-txt-hover-color active:bg-txt-hover-color"
                    }`}
                  >
                    Post
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-4 col-span-2">
              {location.pathname !== "/explore" ? (
                <div className="flex justify-evenly items-center   bg-nav-background dark:bg-dark-secondary-background dark:text-dark-txt-primary gap-10 rounded-lg drop-shadow-2xl  p-4 sm:p-3 ">
                  <div
                    onClick={() => setSubNav("trending")}
                    className={`cursor-pointer flex gap-1  ${
                      subNav === "trending" ? "text-primary" : ""
                    }`}
                  >
                    <p>🔥Trending</p>
                  </div>

                  <div
                    onClick={() => setSubNav("latest")}
                    className={`cursor-pointer items-center flex gap-1  ${
                      subNav === "latest" ? "text-primary" : ""
                    }`}
                  >
                    <i className="far fa-clock"></i>
                    <p>Latest</p>
                  </div>
                </div>
              ) : null}
              {filteredPosts.length === 0 ? (
                <div className="flex justify-center bg-nav-background dark:bg-dark-secondary-background rounded-lg drop-shadow-2xl p-5">
                  <p className="text-xl text-txt-secondary-color dark:text-dark-txt-secondary font-medium">
                    No posts yet. You can go{" "}
                    <span
                      onClick={() => navigate("/explore")}
                      className="cursor-pointer text-secondary"
                    >
                      Explore
                    </span>{" "}
                    Feed
                  </p>
                </div>
              ) : null}

              {location.pathname !== "/explore" && subNav === "latest"
                ? [...filteredPosts]
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((el) => {
                      return <PostFeedCard key={el._id} postData={el} />;
                    })
                : location.pathname !== "/explore"
                ? [
                    ...filteredPosts.filter(
                      (post) =>
                        post?.likes?.likeCount > 0 || post?.comments?.length > 0
                    ),
                  ]
                    .sort((a, b) => {
                      return (
                        b?.likes?.likeCount +
                        b?.comments?.length -
                        (a?.likes?.likeCount + a?.comments?.length)
                      );
                    })
                    .map((el) => {
                      return <PostFeedCard key={el._id} postData={el} />;
                    })
                : null}

              {location.pathname === "/explore" &&
                filteredPosts.map((el, index) => {
                  return <PostFeedCard key={el._id} postData={el} />;
                })}
              {isLoadingMorePosts && (
                <div className="flex justify-center">
                  <img
                    className="w-24 h-24"
                    src="./assets/loader.png"
                    alt="loader"
                  />
                </div>
              )}
              <div ref={loader}></div>
            </div>

            <div className="flex flex-col gap-2  rounded-lg drop-shadow-2xl ">
              <div className="">
                <div className="follow-chip-scroll w-full flex gap-2 flex-wrap">
                  {allUsers
                    .filter(
                      (us) =>
                        user._id !== us._id &&
                        !user.following.some((eachUs) => eachUs._id === us._id)
                    )
                    .map((el) => {
                      return <FollowChip key={el._id} user={el} />;
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
