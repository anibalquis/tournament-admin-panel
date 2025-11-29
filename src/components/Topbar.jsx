// src/components/Topbar.jsx
export default function Topbar() {
  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800">Menu Principal</h1>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
          <span>📅 41111111111111111 Nov 2025</span>
          <span>🕐 12:23PM</span>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow">
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
          <div>
            <h2 className="text-sm font-semibold">Natalia Nicol</h2>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
