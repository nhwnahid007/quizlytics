import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center h-screen bg-slate-200">
      <section className="flex items-center min-h-screen p-8 ">
        <div className="container flex flex-col items-center">
          <div className="flex flex-col gap-6 max-w-md text-center items-center">
            <svg
              id="10015.io"
              viewBox="0 0 480 480"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3/4 h-auto"
            >
              <path
                fill="#7A1CAC"
                d="M435,288.5Q457,337,412,359Q367,381,337.5,415Q308,449,264.5,432.5Q221,416,172.5,428.5Q124,441,88,409Q52,377,47,329.5Q42,282,34.5,238.5Q27,195,57.5,162.5Q88,130,105.5,83.5Q123,37,171.5,42Q220,47,261.5,47Q303,47,338,70Q373,93,413,119Q453,145,433,192.5Q413,240,435,288.5Z"
              />
              <foreignObject x="0" y="0" width="100%" height="100%">
                <div
                  className="flex items-center justify-center h-full"
                >
                  <h2 className="font-extrabold text-6xl md:text-9xl text-secondary-color dark:text-gray-100">
                    <span className="sr-only">Error</span>404
                  </h2>
                </div>
              </foreignObject>
            </svg>

            <p className="text-xl md:text-2xl lg:text-3xl dark:text-gray-300">
              Sorry, we couldn&apos;t find this page.
            </p>
            <Link
              href="/"
              className="px-6 py-3 md:px-8 md:py-4 text-lg md:text-xl font-semibold rounded bg-purple-600 text-gray-50 hover:text-gray-200"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
