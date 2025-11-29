import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardCards from "../components/DashboardCards";

export default function AdminPanel() {
  return (
    <div className="flex bg-[#f3f2fc] min-h-screen font-[Poppins] relative">
      <Sidebar />
      <main className="flex-1 p-8 pt-20 lg:pt-8 transition-all">
        <DashboardCards />
      </main>
    </div>
  );
}
