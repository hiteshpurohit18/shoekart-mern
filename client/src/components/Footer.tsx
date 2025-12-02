import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-10 bg-gray-200 text-gray-700">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Top section */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand info */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">ShoeKart</h2>
            <p className="mt-3 text-sm leading-6">
              Step into comfort and style with our premium footwear collection.
              Designed for everyday life, built for every journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-black">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-black">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-black">
                  Men's Collection
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black">
                  Women's Collection
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 text-lg font-semibold">Follow Us</h3>
            <div className="mt-2 flex items-center space-x-4">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 transition hover:bg-black hover:text-white"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 transition hover:bg-black hover:text-white"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 transition hover:bg-black hover:text-white"
              >
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/hiteshpurohit18"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 transition hover:bg-black hover:text-white"
              >
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 transition hover:bg-black hover:text-white"
              >
                <i className="fa-brands fa-github"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t pt-5 text-center text-sm">
          © {new Date().getFullYear()} ShoeKart — All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
