import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutsideClickHandler } from "../../../../custom-hooks";
import { userUpdateHandler } from "../../../Authentication/authenticationSlice";

export const ProfileModal = ({ setShowProfileModal }) => {
  const { user, token } = useSelector((store) => store.authentication);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    bio: user.bio,
    pic: user.pic,
    link: user.link,
    file: user?.file,
  });
  const ref = useRef();
  const imgUploadInputRef = useRef();
  const { resetMenu } = useOutsideClickHandler(ref);

  useEffect(() => {
    if (resetMenu) {
      setShowProfileModal(false);
    }
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
    setUserData({ ...userData, pic: base64File });
  };

  return (
    <div className="h-screen w-screen fixed flex justify-center items-center z-50 bg-background-dim">
      <div
        ref={ref}
        className="flex flex-col gap-4 p-5 rounded-xl  sm:w-10/12 md:9/12 lg:w-9/12 w-1/3 bg-background dark:bg-dark-secondary-background"
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <p className="w-16 text-xl font-semibold text-txt-secondary-color">
              Avatar
            </p>
            <div className="w-12 flex items-center gap-2 relative">
              <img
                src={
                  userData?.pic ||
                  "https://res.cloudinary.com/donqbxlnc/image/upload/v1651664931/avatar-1577909_960_720_cl1ooh.png"
                }
                className="rounded-full object-cover w-12 h-12"
                alt="user pic"
              />
              <div className="cursor-pointer">
                <button
                  onClick={() => {
                    imgUploadInputRef.current.click();
                  }}
                  className="py-1 px-2 border-2 dark:text-white border-primary rounded-md hover:bg-primary hover:text-white dark:hover:bg-primary text-sm sm:text-xs"
                >
                  Change
                </button>
                <input
                  className="absolute pointer-events-none top-0 w-16 h-8 opacity-0"
                  accept="image/apng, image/avif, image/gif, image/jpeg, image/png, image/svg+xml, image/jpg,image/webp"
                  type="file"
                  ref={imgUploadInputRef}
                  onChange={onFileChange}
                ></input>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <p className="w-16 text-lg text-txt-secondary-color font-semibold">
              Bio
            </p>
            <textarea
              className="px-2 focus:outline-none ring-2 ring-primary resize-none dark:bg-dark-bg-input dark:text-dark-txt-primary"
              value={userData.bio}
              onChange={(e) =>
                setUserData({ ...userData, bio: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2">
            <p className="w-16 text-lg text-txt-secondary-color font-semibold">
              Link
            </p>
            <input
              className="flex-1 ring-2 ring-primary border-txt-secondary-color dark:bg-dark-secondary-background dark:text-dark-txt-primary rounded-md px-2 focus:outline-none"
              value={userData.link}
              onChange={(e) =>
                setUserData({ ...userData, link: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="rounded-lg px-2 py-1 bg-primary text-white"
            onClick={() => {
              dispatch(
                userUpdateHandler({ userData: { ...user, ...userData }, token })
              );
              setShowProfileModal(false);
            }}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};
