"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
} from "firebase/firestore";

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) return;

        setUserEmail(user.email || "");

        const snapshot = await getDocs(
          collection(db, "orders")
        );

        const myOrders = snapshot.docs
  .map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  .filter(
    (order: any) =>
      order.email === user.email
  )
  .reverse();
        setOrders(myOrders);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold text-orange-500 mb-8">
        My Orders
      </h1>

      <p className="mb-8">
        Logged in as: {userEmail}
      </p>

      {orders.length === 0 ? (
        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-xl text-gray-300">
            You have no orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="bg-gray-900 p-6 rounded-xl flex justify-between items-center"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {order.name}
                </h2>

                <p className="text-lg">
                  ${order.price}
                </p>

                <p
                  className={`font-bold mt-2 ${
                    order.status === "Delivered"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  Status: {order.status}
                </p>
              </div>

              {order.image && (
                <img
                  src={order.image}
                  alt={order.name}
                  className="w-24 h-24 object-cover rounded-xl"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}