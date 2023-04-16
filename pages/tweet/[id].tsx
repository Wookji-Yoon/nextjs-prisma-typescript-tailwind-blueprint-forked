import React, { useEffect } from "react";
import useSWR from "swr";
import useUser from "../../lib/user/useUser";
import { useRouter } from "next/router";
import { Tweet } from "@prisma/client";
import { cls } from "../../lib/user/util";
import useMutation from "../../lib/user/useMutation";

interface IUser {
  user: {
    id: number;
    name: string;
  };
  isLoading: boolean;
}

interface ExtendedTweet extends Tweet {
  author: {
    name: string;
  };
  _count: {
    Like: number;
  };
}

interface ITweetResponse {
  ok: boolean;
  tweet: ExtendedTweet;
  isLiked: boolean;
}

export default function Home() {
  const profile = useUser() as IUser;
  const { id: tweetId } = useRouter().query;
  const { data, mutate } = useSWR<ITweetResponse>(tweetId ? `/api/tweet/${tweetId}` : null);

  const [toggleLike, { loading }] = useMutation(`/api/tweet/${tweetId}`);
  const onClick = () => {
    if (loading) return;
    if (!data) return;
    mutate(
      {
        ...data,
        isLiked: !data?.isLiked,
        tweet: {
          ...data?.tweet,
          _count: {
            ...data?.tweet._count,
            Like: data?.isLiked ? data?.tweet._count.Like - 1 : data?.tweet._count.Like + 1,
          },
        },
      },
      false
    );
    toggleLike({});
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mt-10">
      <div className="flex items-center">
        <span>{data?.tweet.author.name}</span>
        <span className="mx-2">·</span>
        <span>{data?.tweet.createdAt + ""}</span>
      </div>
      <div className="mt-4 h-24">{data?.tweet.content}</div>
      <div className="flex items-center justify-end mt-4">
        <div className={cls("flex items-center", data?.isLiked ? "text-red-500" : "text-gray-500")}>
          <span onClick={onClick} className="text-sm mr-2 cursor-pointer">
            {data?.tweet._count.Like} 좋아요
          </span>
        </div>
      </div>
    </div>
  );
}
