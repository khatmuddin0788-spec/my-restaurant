"use client";

import Image from "next/image";

type Food = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
};

type FoodCardProps = {
  food: Food;
  addToCart: (food: string) => void;
};

export default function FoodCard({
  food,
  addToCart,
}: FoodCardProps) {
  if (!food) return null;

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-all duration-300">
      
      <div className="relative w-full h-56">
        <Image
          src={food.image}
          alt={food.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-5">
        <h2 className="text-white text-2xl font-bold">
          {food.name}
        </h2>

        <p className="text-orange-500 text-xl mt-2 font-semibold">
          ${food.price}
        </p>

        <button
          onClick={() => addToCart(food)}
          className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl transition-all"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}