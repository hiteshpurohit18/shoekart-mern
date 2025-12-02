import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="flex w-full justify-center px-4 pt-20 pb-16">
      <div className="w-full max-w-6xl">
        {/* Hero Section */}
        <section className="mb-14 px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            About <span className="text-black">ShoeKart</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg">
            At ShoeKart, we believe great footwear can transform your day. Our
            mission is to bring stylish, comfortable, and premium-quality shoes
            directly to your doorstep.
          </p>
        </section>

        {/* Grid Section */}
        <section className="mb-16 grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
            <h3 className="mb-3 text-xl font-semibold">Our Vision</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              To redefine footwear shopping by offering a curated selection of
              trending, premium, and everyday shoes with unmatched comfort and
              style.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
            <h3 className="mb-3 text-xl font-semibold">Quality First</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Every shoe in our catalog is selected with strict quality checks
              to ensure durability, comfort, and long-lasting performance.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
            <h3 className="mb-3 text-xl font-semibold">Customer Love</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Our customers are at the heart of everything we do — we focus on
              fast delivery, effortless returns, and amazing support.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-20 px-4 text-center">
          <div className="mx-auto max-w-4xl rounded-2xl bg-gray-100 p-8">
            <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">
              Our Story
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
              ShoeKart started with a simple idea — to make high-quality shoes
              accessible to everyone, without compromising design or comfort.
              What began as a small collection quickly grew into a stylish,
              modern brand trusted by thousands. Today, we continue to explore
              new trends, innovate new designs, and bring you the latest in
              footwear fashion.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20 px-4">
          <h2 className="mb-10 text-center text-2xl font-semibold sm:text-3xl">
            Meet Our Developer
          </h2>

          <div className="flex justify-center">
            <div className="flex flex-col items-center rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
              <img
                src="/src/assets/hitesh_purohit.jpg"
                alt="Hitesh Purohit"
                className="mb-4 h-28 w-28 rounded-full border border-black object-cover shadow-xl"
              />

              <h3 className="text-lg font-semibold">Hitesh Purohit</h3>
              <p className="mt-1 text-center text-sm text-gray-600">
                Dedicated to delivering the best footwear website experience.
              </p>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-12 text-center">
          <h2 className="mb-3 text-2xl font-semibold">
            Join the ShoeKart Community
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-sm text-gray-600 sm:text-base">
            Stay updated on new collections, exclusive drops, offers, and more.
          </p>
          <Link to="/">
            <button className="cursor-pointer rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800">
              Explore Products
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
}
