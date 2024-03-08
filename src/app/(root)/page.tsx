import { getServerSession } from "next-auth";
import { unstable_noStore as noStore } from "next/cache";
import { authOptions } from "~/server/auth";
import TryForFreeButton from "../_components/try-for-free";

export default async function Home() {
  noStore();
  const session = await getServerSession(authOptions)
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b to-[#2e026d] from-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-14">
        <h1 className="font-bold text-center text-7xl leading-[1.1] max-w-[20ch] mx-auto animate-fade-down">
          Discover the power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-live via-[#9444fb] to-live animate-hero-title">organization on Twitch</span>
        </h1>
        <h2 className="text-lg text-gray-300 text-center max-w-[60ch] mx-auto animate-fade-down">
          We optimize your markers and turn them into chapters, allowing you to
          explore your most exciting moments with ease and speed.
        </h2>
        
        {
          !session && (
            <TryForFreeButton />
          )
        }
        
        <div className="flex items-center place-content-center animate-fade-down my-4">
            <video
              width={1080}
              className="rounded-lg"
              loop
              src="https://res.cloudinary.com/dlcx4lubg/video/upload/f_auto:video,q_auto/s8uqnjezzoudl3b3euss"
            ></video>
        </div>

        <div className="flex flex-col items-center gap-4 container">
          <h3 className="text-4xl font-bold text-center">
            Features to help you grow
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2 px-2 py-4 rounded-lg backdrop-blur-lg">
            <div className="p-6 rounded-lg col-span-1 sm:col-span-2 shadow-lg transition-all bg-white/10 backdrop-filter backdrop-blur-3xl border border-opacity-10 border-white animate-fade-right hover:bg-white/20">
              <h3 className="text-xl font-medium text-white">Link to go to the marker on VOD highlighter.</h3>
              <p className="mt-2 text-sm text-white">T-Record revolutionizes the viewing experience with its standout VOD Highlighter feature. This innovative system allows users to access key moments in their videos through personalized links, streamlining navigation and providing an efficient way to review meaningful content in seconds.</p>
            </div>

            <div className="p-6 rounded-lg shadow-lg transition-all bg-white/10 backdrop-filter backdrop-blur-3xl border border-opacity-10 border-white animate-fade-left hover:bg-white/20">
              <h3 className="text-xl font-medium text-white">Manage your markers.</h3>
              <p className="mt-2 text-sm text-white">Effortlessly manage your markers with T-Record&apos;s dashboard. Streamline your experience and organize key points efficiently.</p>
            </div>

            <div className="p-6 rounded-lg shadow-lg transition-all bg-white/10 backdrop-filter backdrop-blur-3xl border border-opacity-10 border-white animate-fade-right hover:bg-white/20">
              <h3 className="text-xl font-medium text-white">Notification of marker closing in the chat (coming soon).</h3>
              <p className="mt-2 text-sm text-white">Reminder notification to close the marker in the chat: Receive instant alerts to ensure you don&apos;t forget to close your markers.</p>
            </div>

            <div className="p-6 col-span-1 sm:col-span-2 rounded-lg shadow-lg transition-all bg-white/10 backdrop-filter backdrop-blur-3xl border border-opacity-10 border-white animate-fade-left hover:bg-white/20">
              <h3 className="text-xl font-medium text-white">Team manage your markers (coming soon).</h3>
              <p className="mt-2 text-sm text-white">Your team effortlessly manages your markers with T-Record. Simplify collaboration and streamline your workflow with this intuitive feature.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
          </div>
        </div>
      </div>
    </main>
  );
}
