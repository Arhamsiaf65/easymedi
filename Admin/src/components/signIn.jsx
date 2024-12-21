import React, { useState } from "react";

export const SignIn = ({ handleLogin, email, setEmail, password, setPassword, setUser }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [animateButton, setAnimateButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emoji, setEmoji] = useState("");

  const handleMouseEnter = () => {
    if (!email || !password) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 2000); // Hides the warning after 2 seconds
    }
  };

  const handleMouseLeave = () => {
    setShowWarning(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Oops! Did you forget something?");
      setEmoji("🤔");
      setAnimateButton(true);
      setTimeout(() => setAnimateButton(false), 2000);
      return;
    }

    const isValid = await handleLogin(email, password, setUser);
    if (isValid) {
      setErrorMessage("");
      setEmoji("🎉");
    } else {
      setErrorMessage("Oops! Wrong credentials. Try again!");
      setEmoji("😬");
      setAnimateButton(true);
      setTimeout(() => setAnimateButton(false), 2000);
    }
  };

  return (
    <div className="flex px-6 justify-center items-center min-h-screen bg-gradient-to-r from-teal-400 to-teal-600">
      <div className="p-6 sm:p-16 bg-white shadow-lg rounded-lg transform transition-transform hover:scale-105">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-teal-900">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <div
            className="relative w-full flex flex-col items-center mt-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {showWarning ? (
              <p className="mt-2 text-center text-red-600 transition-opacity duration-500">
                Please provide your credentials!
              </p>
            ) : (
              <button
                type="submit"
                className={`py-3 px-6 text-white font-semibold rounded-lg shadow-md bg-teal-600 hover:bg-teal-700 focus:outline-none transition-transform transform ${
                  animateButton ? "animate-shake" : "hover:scale-105"
                }`}
              >
                {animateButton ? "Oops! 🤪" : "Login"}
              </button>
            )}
          </div>
        </form>
        {errorMessage && (
          <p className="mt-4 text-center text-red-600 transition-opacity duration-500">
            {emoji} {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};
