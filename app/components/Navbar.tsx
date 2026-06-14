"use client";

export default function Navbar({
  cartCount,
  onCartClick,
  onLoginClick,
  user,
  onLogout,
}: any) {

  return (

    <nav className="flex justify-between items-center p-4 md:p-6">

      <h1 className="text-xl md:text-3xl font-bold text-orange-500">
        Restaurant
      </h1>

      <div className="flex items-center gap-3 md:gap-6">

        <button
          onClick={onCartClick}
          className="text-white"
        >
          Cart ({cartCount})
        </button>

        {user ? (

          <button
            onClick={onLogout}
            className="bg-red-500 px-5 py-2 rounded-xl text-white"
          >
            Logout
          </button>

        ) : (

          <button
            onClick={onLoginClick}
            className="bg-orange-500 px-5 py-2 rounded-xl text-white"
          >
            Login
          </button>

        )}

      </div>

    </nav>
  );
}