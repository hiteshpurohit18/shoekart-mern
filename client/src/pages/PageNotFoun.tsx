import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center bg-gray-100 px-6 py-20">
      <div className="max-w-lg text-center">
        {/* Floating Circle Background */}
        <div className="relative mb-10">
          <div className="absolute inset-0 rounded-full bg-black opacity-10 blur-3xl"></div>
          <div className="absolute inset-0 rounded-full bg-gray-600 opacity-10 blur-2xl"></div>

          {/* 404 Text */}
          <h1 className="relative text-7xl font-extrabold tracking-widest text-gray-900 select-none sm:text-9xl">
            404
          </h1>
        </div>

        {/* Message Text */}
        <h2 className="mb-3 text-2xl font-semibold text-gray-800 sm:text-3xl">
          Page Not Found
        </h2>

        <p className="mb-8 text-sm leading-relaxed text-gray-600 sm:text-base">
          Oops! The page you're looking for doesn’t exist or has been moved.
          Let’s get you back on track.
        </p>

        {/* Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-block cursor-pointer rounded-lg bg-black px-6 py-3 font-semibold text-white shadow-md transition hover:bg-gray-800"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
