import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-center">Task Management App</h1>
      <p className="text-xl md:text-2xl mb-10 text-indigo-100 text-center max-w-2xl">
        A production-ready solution for managing your tasks with robust security, encryption, and a premium user experience.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/login">
          <div className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-50 transition duration-300 text-lg cursor-pointer">
            Get Started
          </div>
        </Link>
        <Link href="/register">
          <div className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition duration-300 text-lg cursor-pointer">
            Register Now
          </div>
        </Link>
      </div>
    </div>
  );
}
