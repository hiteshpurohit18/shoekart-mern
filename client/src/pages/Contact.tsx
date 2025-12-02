
export default function Contact() {
  return (
    <div className="flex w-full justify-center px-4 pt-20 pb-16">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <section className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Contact <span className="text-black">Us</span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
            We'd love to hear from you! Whether it's a question, feedback, or
            support request — we’re here to help.
          </p>
        </section>

        {/* Contact Grid */}
        <section className="mb-16 grid grid-cols-1 gap-10 px-4 md:grid-cols-2">
          {/* Contact Info */}
          <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Get in Touch</h2>
            <p className="mb-4 text-sm leading-relaxed text-gray-700">
              Have any questions about our products or need support? Reach out
              through any of the methods below.
            </p>

            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium">📧 Email</p>
                <p className="text-gray-600">purohithitesh579@gmail.com</p>
              </div>

              <div>
                <p className="font-medium">📞 Phone</p>
                <p className="text-gray-600">+91 88664 77011</p>
              </div>

              <div>
                <p className="font-medium">📍 Address</p>
                <p className="text-gray-600">Ahmedabad, Gujarat, India</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
            <h2 className="mb-6 text-xl font-semibold">Send a Message</h2>

            <form className="space-y-4 text-sm">
              <div>
                <label className="mb-1 block font-medium">Your Name</label>
                <input
                  type="text"
                  className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">Email Address</label>
                <input
                  type="email"
                  className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">Message</label>
                <textarea
                  rows={4}
                  className="w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                  placeholder="Write your message..."
                ></textarea>
              </div>

              <button
                type="button"
                className="w-full cursor-pointer rounded-md bg-black py-3 text-sm text-white transition hover:bg-gray-800"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* Map or CTA */}
        <section className="px-4 text-center">
          <h2 className="mb-3 text-xl font-semibold sm:text-2xl">Visit Us</h2>
          <p className="mx-auto mb-6 max-w-xl text-sm text-gray-600 sm:text-base">
            Want to meet us in person? Visit our offline workspace.
          </p>

          <div className="h-64 w-full overflow-hidden rounded-xl shadow">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.123456789!2d72.571362!3d23.022505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f6c8d1!2s3i%20Web%20Experts!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
}
