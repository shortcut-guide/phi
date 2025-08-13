// frontend/src/pages/[lang]/paypay/success.tsx
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCartCount } from "@/f/hooks/useCartCount";
import CartStatusNotice from "@/f/components/notice/CartStatusNotice";
import { localePath } from "@/f/utils/localePath";

type Props = {
  lang: string;
};
const SuccessPage: NextPage = ({ lang }: Props) => {
  const router = useRouter();
  const { loading, count } = useCartCount();

  const goCart = () => {
    router.push(localePath(lang, "/cart")).catch(() => {
      router.replace(localePath(lang, "/cart")).catch(() => {});
    });
  };

  const continueShopping = () => {
    router.push(localePath(lang, "/")).catch(() => {
      router.replace(localePath(lang, "/")).catch(() => {});
    });
  };

  const handleClose = () => {
    try {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.replace(localePath(lang, "/")).catch(() => {});
      }
    } catch {
      router.replace(localePath(lang, "/")).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CartStatusNotice
        lang={lang}
        loading={loading}
        remainingCount={count}
        onGoCart={goCart}
        onContinue={continueShopping}
        onClose={handleClose}
      />
    </div>
  );
};

export default SuccessPage;