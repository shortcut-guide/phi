import React from "react";
import { toAffiliateLink } from "@/f/utils/affiliateLink";

type Props = {
  product: any;
  count: number;
  isOwnShop: boolean;
};

const CartItemRow: React.FC<Props> = ({ product, count, isOwnShop }) => {
  const [affiliateUrl, setAffiliateUrl] = React.useState<string>("");

  React.useEffect(() => {
    let canceled = false;
    if (!isOwnShop && product.shopUrl) {
      toAffiliateLink(product.shopUrl).then((url) => {
        if (!canceled) setAffiliateUrl(url);
      });
    }
    return () => {
      canceled = true;
    };
  }, [isOwnShop, product.shopUrl]);

  return (
    <li className="py-2 flex items-center gap-3">
      <img
        src={product.ec_data.product.images?.[0]}
        alt={product.name}
        className="w-14 h-14 rounded"
      />
      <div>
        <div className="font-semibold">{product.name}</div>
        <div>数量: {count}</div>
        <div>価格: ¥{product.price.toLocaleString()}</div>
        {!isOwnShop && affiliateUrl && (
          <a
            href={affiliateUrl}
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener"
          >
            商品ページへ
          </a>
        )}
      </div>
    </li>
  );
};

export default CartItemRow;