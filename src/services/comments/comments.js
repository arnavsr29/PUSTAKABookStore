import axios from "axios";
import { ACTION_TYPE } from "../../utils";

export async function addComment(id, dataDispatch, commentData, token, toast, setWishlistBtnDisabled) {
    try {
      const {
        data: { comment },
      } = await axios.post(
        `/api/product/comment/${id}`,
        commentData,
        {
          headers: {
            authorization: token,
          },
        }
      );
      dataDispatch({
        type: ACTION_TYPE.CREATE_COMMENT,
        payload: comment,
      });
      toast.success("Comment posted successfully!");
    } catch (error) {
      toast.error("Something went wrong while posting the comment!");
      console.log("Error in Add To comment", error);
    }
}
