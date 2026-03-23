import { User, Mail, Bell, Sliders, Building2 } from "lucide-react";

const SECTION_CLS = "bg-[hsl(0,80%,99%)] rounded-[14px] border border-border p-5 space-y-4 shadow-sm";
const LABEL_CLS   = "text-xs font-medium text-muted-foreground uppercase tracking-wide";
const INPUT_CLS   = "w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Account, notifications, and lab preferences</p>
      </div>

      {/* Profile */}
      <section className={SECTION_CLS}>
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <User size={15} />
          Profile
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={LABEL_CLS}>Display Name</label>
            <input className={INPUT_CLS} defaultValue="Lab Manager" />
          </div>
          <div className="space-y-1.5">
            <label className={LABEL_CLS}>Email</label>
            <input className={INPUT_CLS} defaultValue="manager@dsu.edu" type="email" />
          </div>
        </div>
        <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          Save Changes
        </button>
      </section>

      {/* Auth methods */}
      <section className={SECTION_CLS}>
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Mail size={15} />
          Sign-In Methods
        </div>
        <div className="space-y-2">
          {[
            { label: "Email / Password", status: "Connected" },
            { label: "Google OAuth",     status: "Not linked" },
          ].map(({ label, status }) => (
            <div key={label} className="flex items-center justify-between py-2.5 px-3 bg-surface-2 rounded-lg">
              <span className="text-sm text-foreground">{label}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{status}</span>
                <button className="text-xs text-primary hover:underline">
                  {status === "Connected" ? "Update" : "Link"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className={SECTION_CLS}>
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Bell size={15} />
          Notifications
        </div>
        <div className="space-y-3">
          {[
            { label: "Email alerts on confirmed failure", enabled: true },
            { label: "Email alerts on warning (50–85%)", enabled: false },
            { label: "SMS notifications",                enabled: false },
            { label: "Browser push notifications",       enabled: true },
          ].map(({ label, enabled }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{label}</span>
              <button
                role="switch"
                aria-checked={enabled}
                className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-border"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Confidence sensitivity — placeholder */}
      <section className={SECTION_CLS}>
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sliders size={15} />
          Detection Sensitivity
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Confidence threshold for warnings</span>
            <span className="font-medium text-foreground">50%</span>
          </div>
          <input
            type="range"
            min={30}
            max={90}
            defaultValue={50}
            className="w-full accent-primary"
            disabled
          />
          <p className="text-[11px] text-muted-foreground">
            Confidence slider is coming in V2.0. Currently fixed at 50% (warning) and 85% (confirmed failure).
          </p>
        </div>
      </section>

      {/* Org / Lab */}
      <section className={SECTION_CLS}>
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Building2 size={15} />
          Organization
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={LABEL_CLS}>Lab / Org Name</label>
            <input className={INPUT_CLS} defaultValue="DSU Makerspace" />
          </div>
          <div className="space-y-1.5">
            <label className={LABEL_CLS}>Institution</label>
            <input className={INPUT_CLS} defaultValue="Delaware State University" />
          </div>
        </div>
      </section>
    </div>
  );
}
