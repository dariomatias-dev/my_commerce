import { CheckCircle, RefreshCcw } from "lucide-react";

import { TransactionResponse } from "@/@types/transaction/transaction-response";

interface DashboardTransactionTableProps {
  transactions: TransactionResponse[];
  isLoading: boolean;
  onRefresh: () => void;
  getPaymentMethodLabel: (method: string) => string;
}

export const DashboardTransactionTable = ({
  transactions,
  isLoading,
  onRefresh,
  getPaymentMethodLabel,
}: DashboardTransactionTableProps) => (
  <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:col-span-8">
    <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
      <div className="flex items-center gap-3">
        <CheckCircle size={18} className="text-emerald-500" />
        <h2 className="text-xs font-black tracking-widest text-slate-950 uppercase italic">
          ÚLTIMAS TRANSAÇÕES
        </h2>
      </div>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="rounded-lg bg-slate-50 p-2 text-slate-400 transition-colors hover:text-indigo-600 disabled:opacity-50"
      >
        <RefreshCcw size={14} className={isLoading ? "animate-spin" : ""} />
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-50 bg-slate-50/50 text-[9px] font-black tracking-widest text-slate-400 uppercase">
            <th className="py-4 pl-8">ID DA TRANSAÇÃO</th>
            <th className="py-4">MÉTODO</th>
            <th className="py-4">STATUS</th>
            <th className="py-4 pr-8 text-right">VALOR</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <tr
                key={tx.id}
                className="group transition-colors hover:bg-slate-50/80"
              >
                <td className="py-5 pl-8 text-sm font-black text-slate-950 italic">
                  #TXN-{tx.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {getPaymentMethodLabel(tx.paymentMethod)}
                </td>
                <td className="py-5">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-black tracking-widest text-emerald-600 uppercase">
                    {tx.status}
                  </span>
                </td>
                <td className="py-5 pr-8 text-right text-sm font-black text-slate-950">
                  R$ {tx.amount.toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="py-20 text-center text-[10px] font-black tracking-widest text-slate-300 uppercase italic"
              >
                {isLoading
                  ? "Sincronizando logs..."
                  : "Nenhuma transação registrada"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
