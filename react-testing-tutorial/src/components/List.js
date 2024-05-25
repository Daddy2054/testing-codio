import React, {
  useState,
  useEffect
} from "react";
import axios from "axios";
const Comments = () => {
  const [commentList, setCommentList] = useState(null);
  useEffect(() => {
    (async () => {
      const comments = await axios.get("https://jsonplaceholder.typicode.com/comments");
      setCommentList(comments.data);
    })();
  }, []);
  return commentList ? (<ol> {
    commentList.map((comment, index) => (
      <li key={index} data-testid='comment'>
        <div data-testid='commentName'>{comment.name}</div>
        <div data-testid='commentEmail'>{comment.email}</div>
      </li>))
  }</ol>):(<p>Waiting....</p >);
}

export default Comments;