import { queryToDatabase } from "../configs/mysql2.config.ts";
import * as dotenv from "dotenv";
dotenv.config();
import {
  AuthFailureError,
  BadRequestError,
} from "../responses/error.response.ts";
import { pickData } from "../utils/pick.ts";
import generateRandomNumber from "../utils/generateRandomNumber.ts";
import { isExist } from "./access.helper.service.ts";

type addCommentParams = {
  username: string;
  BookID: string;
  Content: string;
};

type getCommentsByBookIDParams = {
  title_for_search: string;
  numberComment?: number;
};

class CommentService {
  static createComment = async ({
    username,
    BookID,
    Content,
  }: addCommentParams): Promise<any> => {
    //! 1. Kiem tra user co ton tai khong
    const query1 = `SELECT * FROM users WHERE Username = ? AND isDeleted = 0`;
    const [existUser] = await queryToDatabase(query1, [username]);

    if (existUser.length === 0 || existUser[0].Username !== username)
      throw new AuthFailureError("Không tìm thấy tài khoản!");

    //! 2. Kiem tra sách co ton tai khong

    if (!(await isExist("books", "BookID", BookID)))
      throw new AuthFailureError(
        "Sách này không còn tồn tại! Không thể bình luận!"
      );

    //! 3. Thêm comment mới vào bảng comments
    const CommentCode = generateRandomNumber();

    const query4 = `INSERT INTO comments 
    (UserID, BookID, Content, CommentCode) 
    VALUES (?, ?, ?, ?)`;

    await queryToDatabase(query4, [
      existUser[0].UserID,
      BookID,
      Content,
      CommentCode,
    ]);

    const query5 = `SELECT * FROM comments 
    WHERE CommentCode = ?`;
    const [newComment] = await queryToDatabase(query5, [CommentCode]);

    return {
      newComment: newComment[0],
    };
  };

  //! Get the number of the latest comments by title_for_search
  static getComments = async ({
    title_for_search,
    numberComment = 10,
  }: getCommentsByBookIDParams) => {
    //! 1. Kiem tra sách co ton tai khong

    if (!(await isExist("books", "title_for_search", title_for_search)))
      throw new AuthFailureError(
        "Sách này không còn tồn tại! Không thể lấy bình luận!"
      );

    //! 2. Get comments from database
    const MAX_RECORD_CAN_GET = 30;

    if (Number(numberComment) <= 0)
      throw new BadRequestError("Yêu cầu không hợp lệ!");

    if (Number(numberComment) > MAX_RECORD_CAN_GET)
      throw new BadRequestError(
        `Số comment tối đa có thể lấy là ${MAX_RECORD_CAN_GET}!`
      );

    // Retrieve comments from the database
    let query2 = `SELECT * 
    FROM comments 
    INNER JOIN books ON comments.BookID = books.BookID
    WHERE books.title_for_search = ? 
    ORDER BY comments.ID DESC
    LIMIT ${numberComment}`;
    const [comments] = await queryToDatabase(query2, [title_for_search]);
    console.log("comments :>> ", comments);
    return {
      comments,
    };
  };
}

export default CommentService;
