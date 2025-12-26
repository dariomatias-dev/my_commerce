import { Activity, BarChart3, Cpu, ShieldCheck } from "lucide-react";

import { DashboardStatCard } from "./dashboard-stat-card";

interface DashboardStatsProps {
  isActive: boolean;
}

export const DashboardStats = ({ isActive }: DashboardStatsProps) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardStatCard
        label="Fluxo de Vendas"
        value="R$ 0,00"
        sub="Volume acumulado 24h"
        icon={Activity}
        isActive={isActive}
      />

      <DashboardStatCard
        label="Disponibilidade"
        value="99.99%"
        sub="SLA de serviço estável"
        icon={ShieldCheck}
        isActive={isActive}
      />

      <DashboardStatCard
        label="Taxa de Requisições"
        value="1.240 req/s"
        sub="Pico de processamento"
        icon={Cpu}
        isActive={isActive}
      />

      <DashboardStatCard
        label="Conversão Global"
        value="0.00%"
        sub="Métrica em sincronização"
        icon={BarChart3}
        isActive={isActive}
      />
    </div>
  );
};
