import { ShoppingBag } from "lucide-react";

import { OrderItemResponse } from "@/@types/order/order-item/order-item-response";
import { ProductResponse } from "@/@types/product/product-response";
import { ProductImage } from "@/components/product-image";

interface OrderDetailsProductsProps {
  items: OrderItemResponse[];
  products: Record<string, ProductResponse>;
}

export const OrderDetailsProducts = ({
  items,
  products,
}: OrderDetailsProductsProps) => {
  return (
    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-sm">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <ShoppingBag size={24} />
        </div>

        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-950">
          Produtos <span className="text-indigo-600">Adquiridos</span>
        </h2>
      </div>

      <div className="divide-y divide-slate-50">
        {items.map((item) => {
          const product = products[item.productId];

          return (
            <div
              key={item.id}
              className="group flex flex-col gap-6 py-8 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-6">
                <ProductImage
                  imagePath={product?.images?.[0]?.url}
                  alt={product?.name || "Produto"}
                  size={90}
                  className="shrink-0 rounded-2xl border-2 border-slate-50 bg-white shadow-sm transition-transform group-hover:scale-105"
                />

                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">
                    SKU: {item.productId.split("-")[0]}
                  </span>

                  <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-950">
                    {product?.name || "Carregando..."}
                  </h3>

                  <p className="mt-1 text-xs font-bold text-slate-400">
                    Qtd: {item.quantity} x{" "}
                    {item.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                  Subtotal
                </p>

                <p className="text-2xl font-black text-slate-950">
                  {(item.quantity * item.price).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
