import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import UseMutation from "../lib/user/useMutation";
import { useRouter } from "next/router";

interface IForm {
  email: string;
  password: string;
}

interface ILoginResponse {
  ok: boolean;
  error?: {
    kind: "email" | "password";
    message: string;
  };
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<IForm>();
  const [login, { loading, data }] = UseMutation<ILoginResponse>("/api/public/log-in");

  const onValid = (form: IForm) => {
    login(form);
  };

  const router = useRouter();
  useEffect(() => {
    if (data?.ok === false && data.error) {
      setError(data.error?.kind, {
        type: "manual",
        message: data.error?.message,
      });
    }
    if (data?.ok) {
      router.push("/");
    }
  }, [data]);

  return (
    <div className="mt-10 flex flex-col space-y-5 divide-y">
      <h1 className="text-center text-xl">Log-in</h1>
      <form onSubmit={handleSubmit(onValid)} className="flex flex-col space-y-5 ">
        <label htmlFor="email">Email</label>
        <input
          {...register("email", { required: true })}
          className="bg-slate-100"
          type="email"
          id="email"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          {...register("password", { required: true })}
          className="bg-slate-100"
          type="password"
          id="password"
          required
        />
        {errors.email?.type === "manual" && <span>{errors.email.message}</span>}
        {errors.password?.type === "manual" && <span>{errors.password.message}</span>}
        <button
          onClick={() => {
            clearErrors();
          }}
          className="bg-blue-300"
          type="submit"
        >
          {loading ? "Loading..." : "Log-in"}
        </button>
      </form>
    </div>
  );
}
