"use client";


import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";

export default function AdminPage() {

  const [orders, setOrders] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(
    auth,
    (user) => {

      if (
        user?.email ===
        "khatmuddintaheri@gmail.com"
      ) {

        setIsAdmin(true);

      } else {

        setIsAdmin(false);

      }

      setLoading(false);

    }
  );

  return () => unsubscribe();

}, []);

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const querySnapshot = await getDocs(
          collection(db, "orders")
        );

        const ordersData: any[] = [];

        querySnapshot.forEach((doc) => {

          ordersData.push({
            id: doc.id,
            ...doc.data(),
          });

        });

        setOrders(ordersData);

      } catch (error) {

        console.log(error);

      }

    };

    fetchOrders();

  }, []);
  const markAsDelivered = async (
  orderId: string
) => {

  try {

    await updateDoc(
      doc(db, "orders", orderId),
      {
        status: "Delivered",
      }
    );

    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "Delivered",
            }
          : order
      )
    );

  } catch (error) {

    console.log(error);

  }

};

const deleteOrder = async (
  orderId: string
) => {

  try {

    await deleteDoc(
      doc(db, "orders", orderId)
    );

    setOrders(
      orders.filter(
        (order) => order.id !== orderId
      )
    );

  } catch (error) {

    console.log(error);

  }

};

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.price,
    0
  );
  if (loading) {

  return (
    <div className="p-10 text-white">
      Loading...
    </div>
  );

}

if (!isAdmin) {

  return (
    <div className="p-10 text-red-500 text-3xl">
      Access Denied
    </div>
  );

}

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold text-orange-500">
        Admin Dashboard
      </h1>

      <p className="text-gray-400 mt-4">
        Live Restaurant Orders 🚀
      </p>

      <div className="grid md:grid-cols-3 gap-8 mt-14">

        <div className="bg-gray-900 p-8 rounded-3xl">

          <h2 className="text-4xl font-bold text-orange-500">
            {orders.length}
          </h2>

          <p className="text-gray-400 mt-3">
            Total Orders
          </p>

        </div>

        <div className="bg-gray-900 p-8 rounded-3xl">

          <h2 className="text-4xl font-bold text-orange-500">
            ${totalRevenue}
          </h2>

          <p className="text-gray-400 mt-3">
            Revenue
          </p>

        </div>

        <div className="bg-gray-900 p-8 rounded-3xl">

          <h2 className="text-4xl font-bold text-orange-500">
            {orders.length}
          </h2>

          <p className="text-gray-400 mt-3">
            Customers
          </p>

        </div>

      </div>

      <div className="mt-16">

        <h2 className="text-3xl font-bold text-orange-500 mb-8">
          Latest Orders
        </h2>

        <div className="space-y-6">

          {orders.map((order) => (

            <div
              key={order.id}
              className="bg-gray-900 p-6 rounded-2xl flex justify-between items-center"
            >

              <div>

                <h3 className="text-2xl font-bold">
                  {order.name}
                </h3>

                <p className="text-gray-400 mt-2">
                  ${order.price}
                </p>
                <p className="text-yellow-400 mt-2 font-semibold">
                 Status: {order.status}
              </p>
              {order.status !== "Delivered" && (

  <button
    onClick={() => markAsDelivered(order.id)}
    className="mt-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
  >
    Mark Delivered
  </button>

)}
<button
  onClick={() => deleteOrder(order.id)}
  className="mt-3 ml-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl"
>
  Delete Order
</button>

              </div>

              <img
                src={order.image}
                alt={order.name}
                className="w-24 h-24 object-cover rounded-2xl"
              />

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}