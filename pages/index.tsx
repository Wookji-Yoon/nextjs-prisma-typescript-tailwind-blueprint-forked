import React, { useEffect } from "react";
import useUser from "../lib/user/useUser";
import { useForm } from "react-hook-form";
import UseMutation from "../lib/user/useMutation";
import { Tweet } from "@prisma/client";
import useSWR from "swr";
import { useRouter } from "next/router";
import Layout from "../components/layout";
import Link from "next/link";

interface IUser {
  user: {
    id: number;
    name: string;
  };
  isLoading: boolean;
}

interface IForm {
  content: string;
}

interface ICreateTweetResponse {
  ok: boolean;
  tweet: Tweet;
}

interface IExtendedTweet extends Tweet {
  author: {
    name: string;
  };
}

interface ITweetsResponse {
  ok: boolean;
  tweets: IExtendedTweet[];
}

export default function Home() {
  const profile = useUser() as IUser;
  const { register, handleSubmit } = useForm<IForm>();
  const [createTweet, { loading, data }] = UseMutation<ICreateTweetResponse>("/api/tweet");
  const { data: tweets } = useSWR<ITweetsResponse>("/api/tweet");

  const onValid = (form: IForm) => {
    if (loading) return;
    console.log(form);
    createTweet(form);
  };

  useEffect(() => {
    if (data?.ok) {
      console.log(data.tweet);
    }
  }, [data]);

  const router = useRouter();
  useEffect(() => {
    if (data?.ok) {
      router.push(`/tweet/${data.tweet.id}`);
    }
  }, [data]);

  return (
    <div className="mt-10 flex flex-col space-y-5 divide-y">
      <h1 className="text-center text-xl">Hello {profile?.user?.name}!</h1>
      <form onSubmit={handleSubmit(onValid)} className="flex flex-col">
        <textarea
          {...register("content", { required: true, minLength: 10, maxLength: 150 })}
          placeholder="10자 이상, 150자 미만 Tweet을 작성하세요"
          className="bg-slate-100"
          name="content"
          id="content"
          cols={30}
          rows={10}
          minLength={10}
          maxLength={150}
        ></textarea>
        <button className="bg-blue-300" type="submit">
          New Tweet
        </button>
      </form>
      <div>
        {tweets?.tweets.map((tweet) => (
          <Link href={`/tweet/${tweet.id}`} key={tweet.id}>
            <div className="border border-gray-200 rounded-lg p-4 mb-4 cursor-pointer">
              <div className="flex items-center">
                <span>{tweet.author.name}</span>
                <span className="mx-2">·</span>
                <span>{tweet.createdAt + ""}</span>
              </div>
              <div className="mt-4">{tweet.content}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
