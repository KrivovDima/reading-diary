"use client";

import { useActionState } from "react";
import { loginAction, LoginActionState } from "../actions";

export const LoginForm = () => {
  const [state, action] = useActionState<LoginActionState, FormData>(
    loginAction,
    undefined,
  );

  return (
    <form action={action} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          name="password"
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {state?.error && (
        <div className="text-red-600 text-sm text-center">{state.error}</div>
      )}

      <button
        type="submit"
        disabled={false}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        Login
      </button>
    </form>
  );
};
