"use client";
import { collection, addDoc } from "firebase/firestore";
import foods from "./foods";
import AuthModal from "./components/AuthModal";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import FoodCard from "./components/FoodCard";
import { useEffect, useState } from "react";
import { auth, db} from "./firebase";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
export default function Home() {
  const [cartItems, setCartItems] = useState<string[]>([]);
  useEffect(() => {
  const savedCart =
    localStorage.getItem("restaurantCart");

  if (savedCart) {
    setCartItems(JSON.parse(savedCart));
  }
}, []);
  const [user, setUser] =
  useState<any>(null);

const [isAuthOpen, setIsAuthOpen] =
  useState(false);
  const [search, setSearch] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  

const [selectedCategory, setSelectedCategory] =
  useState("All");

useEffect(() => {

  const unsubscribe = onAuthStateChanged(
    auth,
    (currentUser) => {

      setUser(currentUser);

    }
  );

  return () => unsubscribe();

}, []);

const addToCart = async (food: any) => {

  setCartItems([...cartItems, food]);
  localStorage.setItem(
  "restaurantCart",
  JSON.stringify([...cartItems, food])
);

  

};

const handleLogout = async () => {

  await signOut(auth);

};

const removeFromCart = (indexToRemove: number) => {

  const updatedCart = cartItems.filter(
    (_: any, index: number) =>
      index !== indexToRemove
  );

  setCartItems(updatedCart);

  localStorage.setItem(
    "restaurantCart",
    JSON.stringify(updatedCart)
  );

};
const placeOrder = async () => {

  if (cartItems.length === 0) {

    alert("Your cart is empty");

    return;

  }

  try {

    for (const item of cartItems) {

      await addDoc(
        collection(db, "orders"),
        {
          name: item.name,
          price: item.price,
          image: item.image,
          email: user?.email || "guest",
          status: "Pending",
          createdAt: new Date(),
        }
      );

    }
    setCartItems([]);

localStorage.removeItem(
  "restaurantCart"
);

    alert("Order placed successfully");

  } catch (error) {

    console.log(error);

  }

};

const filteredFoods = foods.filter((food: any) => {
  return (
    food.name &&
    food.name.toLowerCase().includes(search.toLowerCase())
  );
});

  return (
    
    <div className="bg-gradient-to-br from-black via-gray-950 to-black text-white min-h-screen overflow-x-hidden">
      {/* Floating Glow Effects */}
<div className="fixed top-0 left-0 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px] -z-10"></div>

<div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-red-500/20 rounded-full blur-[120px] -z-10"></div>

      <Navbar
  cartCount={cartItems.length}
  onCartClick={() => setIsCartOpen(true)}
  onLoginClick={() => setIsAuthOpen(true)}
  user={user}
  onLogout={handleLogout}
/>
     {/* Hero Section */}
<section
  id="home"
  className="relative h-screen flex items-center justify-center text-center overflow-hidden"
>

  {/* Background Image */}
  <img
    src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
    alt="Restaurant"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/70"></div>

  {/* Content */}
  <div className="relative z-10 px-6">

    <h1 className="text-5xl md:text-9xl font-extrabold text-orange-500 drop-shadow-[0_0_30px_orange]">
      Welcome To
      <br />
      My Restaurant
    </h1>

    <p className="text-gray-300 text-xl mt-8 max-w-2xl mx-auto leading-8">
      Experience luxury food, modern atmosphere and unforgettable taste 🍕🔥
    </p>

    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">

      <button className="bg-orange-500 hover:bg-orange-400 px-8 py-4 rounded-2xl text-black font-bold text-lg hover:scale-110 transition duration-300 shadow-[0_0_35px_orange]">
        Order Now
      </button>

      <button className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black px-8 py-4 rounded-2xl text-lg font-bold transition duration-300">
        View Menu
      </button>

    </div>

  </div>

</section>

      {/* Menu Section */}
      {/* Menu Section */}
<section
  id="menu"
  className="py-24 px-8 bg-black"
>
  <h2 className="text-5xl font-bold text-center text-orange-500 mb-12">
    Our Menu
  </h2>

  <div className="flex justify-center mb-8">
    <input
      type="text"
      placeholder="Search food..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="bg-gray-900 border border-orange-500 rounded-xl px-5 py-3 text-white w-full max-w-xl"
    />
  </div>

  <div className="flex justify-center gap-4 mb-12 flex-wrap">
    {["All", "Burger", "Pizza", "Drink"].map((category) => (
      <button
        key={category}
        onClick={() => setSelectedCategory(category)}
        className={`px-6 py-2 rounded-xl transition-all ${
          selectedCategory === category
            ? "bg-orange-500 text-white"
            : "bg-gray-800 text-white"
        }`}
      >
        {category}
      </button>
    ))}
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
    {foods
      .filter((food) => {
        const matchesCategory =
          selectedCategory === "All" ||
          food.category === selectedCategory;

        const matchesSearch = food.name
          .toLowerCase()
          .includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .map((food) => (
        <FoodCard
          key={food.id}
          food={food}
          addToCart={addToCart}
        />
      ))}
  </div>
</section>

{/* About Section */}
<section
  id="about"
  className="py-24 px-8 bg-gray-950"
>

  <div className="grid md:grid-cols-2 gap-14 items-center">

    {/* Left Side Image */}
    <img
      src="https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg"
      alt="Restaurant"
      className="rounded-3xl h-[500px] w-full object-cover"
    />

    {/* Right Side Content */}
    <div>

      <h2 className="text-3xl md:text-5xl font-bold text-orange-500">
        About Our Restaurant
      </h2>

      <p className="text-gray-400 mt-8 leading-8 text-lg">

        Welcome to our modern restaurant where delicious food meets
        luxury experience. We serve fresh meals with high quality
        ingredients and modern cooking styles.

      </p>

      <p className="text-gray-400 mt-6 leading-8 text-lg">

        Our chefs prepare every meal carefully to give customers
        unforgettable taste and beautiful dining experience.

      </p>

      <button className="mt-10 bg-gradient-to-r from-orange-400 to-red-500 shadow-lg shadow-orange-500/30 px-7 py-3 rounded-xl text-black font-bold hover:bg-orange-400 transition">
        Read More
      </button>

    </div>

  </div>

</section>
{/* Contact Section */}
<section id="contact" className="py-24 px-8 bg-black">

  <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 bg-clip-text text-transparent">
    Contact Us
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-14 mt-16">

    {/* Left */}
    <div>

      <h3 className="text-3xl font-bold text-white">
        Get In Touch
      </h3>

      <p className="text-gray-400 mt-6 text-lg">
        We are always ready to serve delicious food and amazing experience 🍽️
      </p>

      <div className="mt-10 space-y-6">

        <p className="text-gray-300 text-lg">
          📞 +33 123 456 789
        </p>

        <p className="text-gray-300 text-lg">
          📧 restaurant@email.com
        </p>

        <p className="text-gray-300 text-lg">
          📍 Paris, France
        </p>

      </div>

    </div>

    {/* Right */}
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl">

      <input
        type="text"
        placeholder="Your Name"
        className="w-full p-4 rounded-xl bg-black text-white border border-gray-700 outline-none"
      />

      <input
        type="email"
        placeholder="Your Email"
        className="w-full p-4 rounded-xl bg-black text-white border border-gray-700 outline-none mt-5"
      />

      <textarea
        placeholder="Your Message"
        className="w-full p-4 rounded-xl bg-black text-white border border-gray-700 outline-none mt-5 h-40"
      />

      <button className="mt-6 bg-gradient-to-r from-orange-400 to-red-500 shadow-lg shadow-orange-500/30 px-8 py-3 rounded-xl text-black font-bold hover:bg-orange-400 transition">
        Send Message
      </button>

    </div>

  </div>

</section>

{/* Statistics Section */}
<section className="py-24 px-8 bg-gray-950">

  <div className="grid md:grid-cols-3 gap-10 text-center">

    {/* Stat 1 */}
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-10">

      <h2 className="text-5xl font-extrabold text-orange-500">
        10K+
      </h2>

      <p className="text-gray-400 mt-4 text-xl">
        Happy Customers
      </p>

    </div>

    {/* Stat 2 */}
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-10">

      <h2 className="text-5xl font-extrabold text-orange-500">
        500+
      </h2>

      <p className="text-gray-400 mt-4 text-xl">
        Delicious Foods
      </p>

    </div>

    {/* Stat 3 */}
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-10">

      <h2 className="text-5xl font-extrabold text-orange-500">
        24/7
      </h2>

      <p className="text-gray-400 mt-4 text-xl">
        Fast Service
      </p>

    </div>

  </div>

</section>  
{/* Testimonials Section */}
<section className="py-24 px-8 bg-black">

  <h2 className="text-5xl font-bold text-center text-orange-500">
    What Our Customers Say
  </h2>

  <div className="grid md:grid-cols-3 gap-10 mt-16">

    {/* Review 1 */}
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:scale-105 transition">

      <p className="text-gray-300 text-lg leading-8">
        “Amazing food and beautiful atmosphere. One of the best restaurants I have visited.”
      </p>

      <h3 className="text-orange-500 text-xl font-bold mt-8">
        — John Smith
      </h3>

    </div>

    {/* Review 2 */}
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:scale-105 transition">

      <p className="text-gray-300 text-lg leading-8">
        “The burgers are incredibly delicious and the service is super fast.”
      </p>

      <h3 className="text-orange-500 text-xl font-bold mt-8">
        — Sarah Wilson
      </h3>

    </div>

    {/* Review 3 */}
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:scale-105 transition">

      <p className="text-gray-300 text-lg leading-8">
        “Modern design, tasty meals, and friendly staff. Highly recommended!”
      </p>

      <h3 className="text-orange-500 text-xl font-bold mt-8">
        — Michael Lee
      </h3>

    </div>

  </div>

</section>
{/* Gallery Section */}
<section className="py-24 px-8 bg-gray-950">

  <h2 className="text-5xl font-bold text-center text-orange-500">
    Food Gallery
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">

    <img
      src="https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg"
      alt="Food"
      className="rounded-3xl h-80 w-full object-cover hover:scale-105 transition duration-500"
    />

    <img
      src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
      alt="Food"
      className="rounded-3xl h-80 w-full object-cover hover:scale-105 transition duration-500"
    />

    <img
      src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg"
      alt="Food"
      className="rounded-3xl h-80 w-full object-cover hover:scale-105 transition duration-500"
    />

    <img
      src="https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg"
      alt="Food"
      className="rounded-3xl h-80 w-full object-cover hover:scale-105 transition duration-500"
    />

    <img
      src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
      alt="Food"
      className="rounded-3xl h-80 w-full object-cover hover:scale-105 transition duration-500"
    />

    <img
      src="https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg"
      alt="Food"
      className="rounded-3xl h-80 w-full object-cover hover:scale-105 transition duration-500"
    />

  </div>

</section> 
{/* Reservation Section */}
<section className="py-24 px-8 bg-black">

  <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 md:p-16">

    <h2 className="text-5xl font-extrabold text-center text-orange-500">
      Reserve A Table
    </h2>

    <p className="text-gray-400 text-center mt-6 text-lg">
      Book your table now and enjoy luxury dining experience 🍽️
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">

      <input
        type="text"
        placeholder="Your Name"
        className="bg-black/50 border border-gray-700 rounded-2xl p-5 text-white outline-none focus:border-orange-500 transition"
      />

      <input
        type="email"
        placeholder="Your Email"
        className="bg-black/50 border border-gray-700 rounded-2xl p-5 text-white outline-none focus:border-orange-500 transition"
      />

      <input
        type="date"
        className="bg-black/50 border border-gray-700 rounded-2xl p-5 text-white outline-none focus:border-orange-500 transition"
      />

      <input
        type="time"
        className="bg-black/50 border border-gray-700 rounded-2xl p-5 text-white outline-none focus:border-orange-500 transition"
      />

    </div>

    <textarea
      placeholder="Special Request"
      className="w-full mt-8 bg-black/50 border border-gray-700 rounded-2xl p-5 text-white outline-none h-40 focus:border-orange-500 transition"
    />

    <button className="mt-10 w-full bg-gradient-to-r from-orange-500 to-red-500 py-5 rounded-2xl text-black text-xl font-bold hover:scale-105 transition duration-300 shadow-[0_0_40px_orange]">
      Reserve Now
    </button>

  </div>

</section> 
{/* Testimonials Section */}
<section className="py-24 px-8 bg-black">

  <h2 className="text-5xl font-extrabold text-center text-orange-500">
    Customer Reviews
  </h2>

  <p className="text-center text-gray-400 mt-6 text-lg">
    What our customers say about us ⭐
  </p>

  <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-7xl mx-auto">

    {/* Review 1 */}
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl hover:-translate-y-3 hover:shadow-[0_0_35px_rgba(255,115,0,0.4)] transition duration-500">

      <div className="text-orange-500 text-2xl">
        ⭐⭐⭐⭐⭐
      </div>

      <p className="text-gray-300 mt-6 leading-8">
        Amazing food and luxury atmosphere. Best restaurant experience ever!
      </p>

      <h3 className="text-white font-bold text-xl mt-8">
        John Smith
      </h3>

    </div>

    {/* Review 2 */}
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl hover:-translate-y-3 hover:shadow-[0_0_35px_rgba(255,115,0,0.4)] transition duration-500">

      <div className="text-orange-500 text-2xl">
        ⭐⭐⭐⭐⭐
      </div>

      <p className="text-gray-300 mt-6 leading-8">
        Delicious pizza and premium service. I really loved this place 🔥
      </p>

      <h3 className="text-white font-bold text-xl mt-8">
        Emma Wilson
      </h3>

    </div>

    {/* Review 3 */}
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl hover:-translate-y-3 hover:shadow-[0_0_35px_rgba(255,115,0,0.4)] transition duration-500">

      <div className="text-orange-500 text-2xl">
        ⭐⭐⭐⭐⭐
      </div>

      <p className="text-gray-300 mt-6 leading-8">
        Modern design, beautiful food and fantastic experience 🍔
      </p>

      <h3 className="text-white font-bold text-xl mt-8">
        Michael Brown
      </h3>

    </div>

  </div>

</section> 

<AuthModal
  isOpen={isAuthOpen}
  onClose={() => setIsAuthOpen(false)}
/>
{/* Footer */}
<footer className="bg-gray-950 border-t border-gray-800 py-8 mt-20">

  <div className="text-center">

    <h2 className="text-2xl font-bold text-orange-500">
      My Restaurant
    </h2>

    <p className="text-gray-400 mt-3">
      Best food experience in town 🍔
    </p>

    <div className="flex justify-center gap-6 mt-6 text-gray-300">
      <span className="hover:text-orange-500 cursor-pointer">
        Facebook
      </span>

      <span className="hover:text-orange-500 cursor-pointer">
        Instagram
      </span>

      <span className="hover:text-orange-500 cursor-pointer">
        Twitter
      </span>
    </div>

    <p className="text-gray-500 text-sm mt-6">
      © 2026 My Restaurant. All rights reserved.
    </p>

  </div>

</footer>
<Cart
  cartItems={cartItems}
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
  removeFromCart={removeFromCart}
  placeOrder={placeOrder}
/>
    </div>
  );
}
