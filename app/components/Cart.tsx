"use client";

export default function Cart({
  cartItems = [],
  isOpen,
  onClose,
  removeFromCart,
  placeOrder,
}: any) {

  const totalPrice = cartItems.reduce(
    (sum: number, item: any) => sum + item.price,
    0
  );

  if (!isOpen) return null;

  return (

    <div className="fixed top-0 right-0 w-[400px] h-screen bg-black text-white p-6 z-50 overflow-y-auto">

      <button
        onClick={onClose}
        className="text-orange-500 text-2xl mb-8"
      >
        ✕
      </button>

      <h2 className="text-3xl font-bold text-orange-500 mb-8">
        Shopping Cart
      </h2>

      <div className="space-y-6">

        {cartItems.map((item: any, index: number) => (

          <div
            key={index}
            className="bg-gray-900 p-4 rounded-2xl"
          >

            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded-xl"
            />

            <h3 className="text-2xl font-bold mt-4">
              {item.name}
            </h3>

            <p className="text-orange-500 mt-2">
              ${item.price}
            </p>
            <button
  onClick={() => removeFromCart(index)}
  className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl"
>
  Remove
</button>

          </div>

        ))}

      </div>

      <div className="mt-10 border-t border-gray-800 pt-6">

        <h3 className="text-3xl font-bold text-orange-500">
          Total: ${totalPrice}
        </h3>
        <button
        onClick={placeOrder}
  className="w-full mt-6 bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-bold"
>
  Place Order
</button>

      </div>

    </div>

  );

}