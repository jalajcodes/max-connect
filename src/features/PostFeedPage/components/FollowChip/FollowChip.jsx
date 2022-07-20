import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userUpdateHandler } from "../../../Authentication/authenticationSlice";
import { followUser } from "../../UserSlice";
import "./FollowChip.css";

export const FollowChip = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((store) => store.authentication);
  return (
    <div className="h-48 p-4 grow bg-nav-background dark:bg-dark-secondary-background rounded-lg flex flex-col gap-4 items-center justify-center">
      <div
        onClick={() => navigate(`/profile/${user?.userHandler}`)}
        className="flex-col items-center justify-center gap-1"
      >
        <img
          title={`${user.firstName} ${user.lastName}`}
          className="cursor-pointer h-20 w-20 object-cover rounded-full"
          src={user.pic}
          alt={user.userHandler}
        />
        <p className="text-xs mt-2 cursor-pointer font-medium dark:text-dark-txt-primary text-txt-color text-center">
          {user.firstName} {user.lastName}
        </p>
      </div>
      <button
        onClick={() =>
          dispatch(
            followUser({
              followUserId: user._id,
              token,
              dispatch,
              userUpdateHandler,
            })
          )
        }
        className="dark:text-white border-2 border-primary hover:text-white hover:bg-primary transition-all focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-1 text-center"
      >
        Follow
      </button>
    </div>
  );
};
