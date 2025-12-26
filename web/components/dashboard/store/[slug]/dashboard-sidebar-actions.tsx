import {
  AlertTriangle,
  ArrowRight,
  Box,
  ChevronRight,
  Clock,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export const DashboardSidebarActions = () => (
  <div className="space-y-6 lg:col-span-4">
    <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl shadow-slate-200">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-xl font-black tracking-tighter uppercase italic text-indigo-400">
          Alerta de Inventário
        </h3>
        <AlertTriangle className="text-orange-500" size={20} />
      </div>
      <div className="py-4 text-center">
        <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase italic">
          Estoque em conformidade técnica
        </p>
      </div>
      <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-[10px] font-black tracking-widest text-slate-950 uppercase transition-all hover:bg-indigo-500 hover:text-white">
        REABASTECER AGORA <ArrowRight size={14} />
      </button>
    </div>

    <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-sm font-black tracking-widest text-slate-950 uppercase italic">
          Ações Rápidas
        </h3>
        <Clock size={16} className="text-slate-300" />
      </div>
      <div className="space-y-3">
        {[
          { label: "Configurações do Checkout", icon: ShieldCheck },
          { label: "Personalizar Vitrine", icon: Box },
          { label: "Logs de Integração", icon: ExternalLink },
        ].map((action, i) => (
          <button
            key={i}
            className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-indigo-600 hover:bg-indigo-50"
          >
            <div className="flex items-center gap-3">
              <action.icon
                size={16}
                className="text-slate-400 group-hover:text-indigo-600"
              />
              <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase group-hover:text-indigo-600">
                {action.label}
              </span>
            </div>
            <ChevronRight
              size={14}
              className="text-slate-300 group-hover:text-indigo-600"
            />
          </button>
        ))}
      </div>
    </div>
  </div>
);
