import { Edit3, Package, Trash2 } from "lucide-react";
import Link from "next/link";

import { ProductResponse } from "@/@types/product/product-response";

interface ProductManagerTableProps {
  products: ProductResponse[];
}

export const ProductManagerTable = ({ products }: ProductManagerTableProps) => (
  <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
            <th className="py-5 pl-10">Ativo / SKU</th>
            <th className="py-5 text-center">Status</th>
            <th className="py-5 text-center">Volume</th>
            <th className="py-5">Precificação</th>
            <th className="py-5 pr-10 text-right">Controle</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {products.map((product) => (
            <tr
              key={product.id}
              className="group hover:bg-indigo-50/20 transition-colors"
            >
              <td className="py-6 pl-10">
                <div className="flex items-center gap-5">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50">
                    <Package className="h-full w-full p-3 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950 uppercase italic tracking-tight">
                      {product.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest">
                      {product.slug}
                    </p>
                  </div>
                </div>
              </td>

              <td className="py-6 text-center">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[9px] font-black tracking-widest uppercase ${
                    product.active
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {product.active ? "Operacional" : "Offline"}
                </span>
              </td>

              <td className="py-6 text-center">
                <p
                  className={`text-sm font-black italic ${
                    product.stock === 0 ? "text-red-500" : "text-slate-950"
                  }`}
                >
                  {product.stock} UN
                </p>
              </td>

              <td className="py-6 font-black text-slate-950 italic">
                R$ {product.price.toFixed(2)}
              </td>

              <td className="py-6 pr-10 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`products/edit/${product.id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-100 bg-white text-slate-400 hover:text-indigo-600"
                  >
                    <Edit3 size={18} />
                  </Link>
                  <button className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-100 bg-white text-slate-400 hover:text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="py-24 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic"
              >
                Nenhum registro localizado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
