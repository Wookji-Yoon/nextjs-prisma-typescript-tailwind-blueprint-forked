import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import UseMutation from "../lib/user/useMutation";
import { useRouter } from "next/router";

interface IForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  formError?: string;
}

interface ICreateAccountResponse {
  ok: boolean;
}

export default function Account() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<IForm>();

  const [createAccount, { loading, data }] = UseMutation<ICreateAccountResponse>(
    "/api/public/create-account"
  );

  const onValid = (form: IForm) => {
    if (form.password !== form.confirmPassword) {
      setError("formError", {
        type: "manual",
        message: "Confirm Password가 다릅니다",
      });
      return;
    }
    createAccount({
      email: form.email,
      password: form.password,
      name: form.name,
    });
  };

  const router = useRouter();
  useEffect(() => {
    if (data?.ok) {
      router.push("/log-in");
    }
  }, [data]);

  return (
    <div className="mt-10 flex flex-col space-y-5 divide-y">
      <h1 className="text-center text-xl">Create Account</h1>
      <form onSubmit={handleSubmit(onValid)} className="flex flex-col space-y-5 ">
        <label htmlFor="email">Email</label>
        <input
          {...register("email", { required: true })}
          type="email"
          name="email"
          id="email"
          required
          className="bg-slate-100"
        />
        <label htmlFor="password">Password</label>
        <input
          {...register("password", { required: true })}
          type="password"
          name="password"
          id="password"
          required
          className="bg-slate-100"
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          {...register("confirmPassword", { required: true })}
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          required
          className="bg-slate-100"
        />
        <label htmlFor="name">Name</label>
        <input
          {...register("name", { required: true })}
          type="text"
          name="name"
          id="name"
          required
          className="bg-slate-100"
        />
        {errors.formError && <span>{errors.formError.message}</span>}
        <button onClick={() => clearErrors()} type="submit" className="bg-blue-300">
          {loading ? "Loading..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
