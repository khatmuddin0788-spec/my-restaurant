"use client";

import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase";

export default function AuthModal({
  isOpen,
  onClose,
}: any) {

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleAuth = async () => {

    try {

      if (isLogin) {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        alert("Login Successful 🔥");

      } else {

        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        alert("Account Created 🚀");

      }

      onClose();

    } catch (error: any) {

      alert(error.message);

    }

  };

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

      <div className="bg-gray-900 p-10 rounded-3xl w-[400px]">

        <h2 className="text-3xl font-bold text-orange-500 mb-8">

          {isLogin ? "Login" : "Create Account"}

        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 rounded-xl bg-black text-white mb-4 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 rounded-xl bg-black text-white mb-6 outline-none"
        />

        <button
          onClick={handleAuth}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold"
        >
          {isLogin ? "Login" : "Create Account"}
        </button>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-orange-400 w-full"
        >
          {isLogin
            ? "Create New Account"
            : "Already have an account?"}
        </button>

        <button
          onClick={onClose}
          className="mt-4 text-gray-400 w-full"
        >
          Close
        </button>

      </div>

    </div>

  );
}