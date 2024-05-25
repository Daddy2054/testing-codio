import axios from "axios";
import {render, waitFor, screen} from "@testing-library/react";
import Comments from "./components/List.js";

jest.mock("axios");

const dummyComments = [
  {
    "postId": 1,
    "id": 1,
    "name": "comment 1",
    "email": "email1@email.com",
    "body": "lol"
  },
  {
    "postId": 1,
    "id": 2,
    "name": "Comment 2",
    "email": "email2@email.com",
    "body": "lol"
  },
  {
    "postId": 1,
    "id": 3,
    "name": "Comment 3",
    "email": "email3@email.com",
    "body": "lol"
  },
  {
    "postId": 1,
    "id": 4,
    "name": "Comment 4",
    "email": "email4@email.com",
    "body": "lol"
  },
];

test("comments list", async () => {
  axios.get.mockResolvedValue({data: dummyComments});
  render(<Comments/>);

  const commentList = await waitFor(() => screen.findAllByTestId("comment"));

  expect(commentList).toHaveLength(dummyComments.length);
});
