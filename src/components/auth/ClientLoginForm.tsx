import React from "react";

type Props = {
  corporateId: string;
  setCorporateId: (value: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  loading: boolean;
  setShowTerms: (show: boolean) => void;
};

export default function ClientLoginForm({
  corporateId,
  setCorporateId,
  error,
  onSubmit,
  isLoading,
  loading,
  setShowTerms,
}: Props) {
  const inputClass = `w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-300 shadow-sm ${
    isLoading ? "bg-gray-100 cursor-not-allowed" : "hover:border-gray-400"
  }`;

  const buttonClass = `w-full bg-gradient-to-r from-amber-500 to-amber-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-100 flex justify-center items-center min-h-[48px] ${
    isLoading ? "opacity-70 cursor-wait" : ""
  }`;

  return (
    <>
      <div className="p-3 text-white bg-gray-800 md:w-96 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-center rounded-l-xl relative overflow-hidden">
        {/* Decorative Gem Shapes (Desktop Only) */}
        <div className="hidden md:block absolute inset-0 z-0">
          <div className="absolute top-10 left-1/4 h-12 w-12 bg-white rounded-full blur-sm opacity-10 animate-pulse-slow"></div>
          <div className="absolute top-12 right-10 h-7 w-8 bg-white rounded-full blur-sm opacity-10 animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-1/4 h-16 w-16 bg-white rounded-full blur-sm opacity-15 animate-pulse-slow-delay"></div>
          <div className="absolute bottom-18 right-1/7 h-16 w-16 bg-white rounded-full blur-sm opacity-15 animate-pulse-slow-delay"></div>
          <div className="absolute top-1/2 left-10 h-8 w-8 bg-white rounded-full blur-sm opacity-5 animate-pulse-slow"></div>
          <div className="absolute bottom-10 left-10 h-20 w-20 bg-white rounded-full blur-sm opacity-20 animate-pulse-slow-delay"></div>
        </div>

        {/* Main Content - placed on top of the shapes */}
        <div className="relative z-10">
          <div className="mb-4 lg:mb-6 text-2xl font-extrabold tracking-wide text-center bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Jewellplus - Admin
          </div>
          <p className="md:block text-center text-gray-300 leading-relaxed max-w-sm font-sans">
            Welcome to your administration portal. Securely manage your account
            and access essential tools.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center p-4 lg:p-8 bg-white md:flex-1 rounded-r-xl relative">
        <h3 className=" mb-4 lg:my-4 text-xl lg:text-3xl font-bold text-gray-800 text-center">
          Corporate Authentication
        </h3>

        <form className="flex flex-col space-y-6" onSubmit={onSubmit}>
          {loading && (
            <div className="absolute inset-0 z-10 bg-white bg-opacity-75 backdrop-blur-sm flex justify-center items-center rounded-r-xl">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-500"></div>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="corporateId"
              className="text-sm font-semibold text-gray-600"
            >
              Enter Corporate-ID
            </label>
            <input
              type="text"
              id="corporateId"
              name="corporateId"
              autoComplete="off"
              placeholder="e.g., JWP-12345"
              value={corporateId}
              onChange={(e) => {
                const val = e.target.value.replace(/^\s+|\s+$/g, ""); // remove prefix & postfix spaces
                setCorporateId(val);
              }}
              required
              className={inputClass}
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-red-500 mt-2 font-medium">{error}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className={buttonClass}
              disabled={isLoading || loading}
            >
              {isLoading ? "Processing..." : "Proceed to next"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-xs text-center text-gray-500">
          By proceeding, you agree to our{" "}
          <a
            href="#"
            className="underline italic hover:text-gray-700 transition-colors"
            onClick={() => setShowTerms(true)} // onClick handler to open the modal
          >
            terms
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline italic hover:text-gray-700 transition-colors"
            onClick={() => setShowTerms(true)} // onClick handler to open the modal
          >
            conditions
          </a>
        </p>
      </div>
    </>
  );
}
