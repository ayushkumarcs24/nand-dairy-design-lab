import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Circle, MapPin, MoreVertical, Truck } from "lucide-react";
import LogisticsSidebar from "@/components/layout/LogisticsSidebar";
import LogisticsMobile from "@/components/layout/LogisticsMobile";
import LogisticsDesktop from "@/components/layout/LogisticsDesktop";

const vehicles = [
  {
    id: "TRK-001",
    driver: "John Doe",
    status: "Loading",
  },
  {
    id: "VAN-004",
    driver: "Jane Smith",
    status: "En Route",
  },
];

const alerts = [
  {
    vehicleId: "TRK-001",
    urgency: "High Urgency",
    urgencyColor: "border-red-200 bg-red-50/80",
    pillClasses: "bg-red-100 text-red-700",
    title: "Brake System Check",
    subtitle: "Predicted maintenance by June 26, 2024",
    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
  },
  {
    vehicleId: "VAN-004",
    urgency: "Medium Urgency",
    urgencyColor: "border-amber-200 bg-amber-50/80",
    pillClasses: "bg-amber-100 text-amber-700",
    title: "Engine Oil Change",
    subtitle: "Predicted maintenance by July 05, 2024",
    icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  },
  {
    vehicleId: "TRK-003",
    urgency: "Low Urgency",
    urgencyColor: "border-emerald-200 bg-emerald-50/80",
    pillClasses: "bg-emerald-100 text-emerald-700",
    title: "Tire Pressure & Alignment",
    subtitle: "Predicted maintenance by July 15, 2024",
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  },
];

const routeStops = [
  {
    name: "Green Valley Grocers",
    address: "428 Main St, Springfield | 260L",
  },
  {
    name: "Sunrise Mart",
    address: "460 Oak Ave, Shelbyville | 400L",
  },
  {
    name: "Capital City Foods",
    address: "789 Pine Ln, Capital City | 200L",
  },
];

const checklist = [
  {
    label: "Quality Check Complete",
    completed: true,
  },
  {
    label: "Crates Loaded (850/1000 L)",
    completed: true,
  },
  {
    label: "Temperature Verified",
    completed: false,
  },
];

const LogisticsDashboard = () => {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[260px_1fr] bg-gradient-to-br from-[#FFF5E9] via-[#FFF9F2] to-[#F4F5FF]">
      <LogisticsSidebar />
      <div className="flex flex-col max-h-screen overflow-hidden">
        <LogisticsMobile />
        <LogisticsDesktop />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-6xl flex-col gap-8"
          >
            {/* Page title */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">
                Vehicle Assignment & Dispatch
              </h1>
              <p className="text-slate-500 text-sm md:text-base max-w-xl">
                Monitor vehicle readiness, predictive maintenance, and delivery routes before dispatching.
              </p>
            </div>

            {/* Two-column layout */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)] items-start">
              {/* Left: vehicles & maintenance */}
              <div className="space-y-6">
                {/* Available Vehicles */}
                <section className="rounded-3xl bg-white/90 shadow-sm border border-slate-100 p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-slate-900">Available Vehicles</h2>
                      <p className="text-xs md:text-sm text-slate-500 mt-1">Assign the best fit vehicle for todays route.</p>
                    </div>
                    <span className="text-xs font-medium text-slate-400">2 of 5 Available</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {vehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-12 w-16 rounded-xl bg-slate-200 flex items-center justify-center">
                            <Truck className="h-6 w-6 text-slate-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-400">Vehicle ID</span>
                            <p className="text-sm font-semibold text-slate-900">{vehicle.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex flex-col">
                            <span className="text-slate-400">Driver</span>
                            <span className="font-medium text-slate-800">{vehicle.driver}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-slate-400">Status</span>
                            <span className="text-xs font-semibold text-emerald-600">{vehicle.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Predictive Maintenance Alerts */}
                <section className="rounded-3xl bg-white/90 shadow-sm border border-slate-100 p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-xl font-semibold text-slate-900">Predictive Maintenance Alerts</h2>
                    <span className="text-xs text-slate-400">Powered by telematics</span>
                  </div>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div
                        key={alert.vehicleId}
                        className={`rounded-2xl border ${alert.urgencyColor} px-4 py-4 flex flex-col gap-3`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold tracking-wide text-slate-500">
                              {alert.vehicleId}
                            </span>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${alert.pillClasses}`}>
                              {alert.urgency}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {alert.icon}
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{alert.title}</p>
                            <p className="text-xs text-slate-500 mt-1">{alert.subtitle}</p>
                          </div>
                          <Button
                            variant="outline"
                            className="rounded-xl border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50"
                          >
                            Schedule Service
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right: live route plan & checklist */}
              <div className="space-y-6">
                {/* Live Route Plan */}
                <section className="rounded-3xl bg-white/90 shadow-sm border border-slate-100 p-5 md:p-6 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg md:text-xl font-semibold text-slate-900">Live Route Plan</h2>
                    <span className="text-xs font-medium text-indigo-600">TRK-001  b7 Morning Route</span>
                  </div>

                  <div className="relative h-40 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100 overflow-hidden flex items-center justify-center">
                    <svg
                      viewBox="0 0 320 120"
                      className="absolute inset-0 h-full w-full text-indigo-500/70"
                    >
                      <path
                        d="M10 90 C 80 20, 160 120, 310 40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="relative flex w-full justify-between px-10">
                      {[1, 2, 3].map((step, index) => (
                        <div key={step} className="flex flex-col items-center gap-2">
                          <div className="flex items-center justify-center h-7 w-7 rounded-full bg-white shadow-sm border border-indigo-100">
                            <span className="text-xs font-semibold text-indigo-600">{step}</span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {index === 0 ? "Hub" : index === 1 ? "Mid Stop" : "Final Stop"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 flex items-center justify-between text-xs md:text-sm">
                    <div className="flex flex-wrap gap-4">
                      <span className="font-medium text-slate-700">Route Summary</span>
                      <span className="text-slate-500">Total Distance: 42 km</span>
                      <span className="text-slate-500">Est. Duration: 4 hr 45 min</span>
                      <span className="text-slate-500">Stops: 3</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700">
                      View Details
                    </Button>
                  </div>
                </section>

                {/* Assigned Delivery Route */}
                <section className="rounded-3xl bg-white/90 shadow-sm border border-slate-100 p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-xl font-semibold text-slate-900">Assigned Delivery Route</h2>
                    <span className="text-xs text-slate-400">3 stops scheduled</span>
                  </div>
                  <div className="space-y-3">
                    {routeStops.map((stop, index) => (
                      <div
                        key={stop.name}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3 text-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-indigo-500" />
                              {stop.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{stop.address}</p>
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Pre-Dispatch Checklist */}
                <section className="rounded-3xl bg-white/90 shadow-sm border border-slate-100 p-5 md:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg md:text-xl font-semibold text-slate-900">Pre-Dispatch Checklist</h2>
                    <span className="text-xs text-slate-400">Loading Progress</span>
                  </div>

                  <div className="space-y-3">
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-emerald-400 to-amber-400" />
                    </div>
                    <p className="text-xs text-slate-500">68% complete</p>
                  </div>

                  <div className="space-y-3">
                    {checklist.map((item) => (
                      <div key={item.label} className="flex items-center gap-3 text-sm">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                            item.completed
                              ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                              : "border-slate-300 bg-white text-slate-400"
                          }`}
                        >
                          {item.completed ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                        </div>
                        <span className={item.completed ? "text-slate-700" : "text-slate-500"}>{item.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-3">
                    <Button
                      variant="outline"
                      className="rounded-xl border-slate-200 text-xs md:text-sm text-slate-700 bg-white hover:bg-slate-50"
                    >
                      Optimize Route
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl border-slate-200 text-xs md:text-sm text-slate-700 bg-white hover:bg-slate-50"
                    >
                      Print Manifest
                    </Button>
                    <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs md:text-sm text-white shadow-md">
                      Dispatch Vehicle
                    </Button>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default LogisticsDashboard;
