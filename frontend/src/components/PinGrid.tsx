"use client";

import { links } from "@/f/config/links";
import { getLangObj } from "@/f/utils/getLangObj";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function ProductModal({ product, onClose }: { product: any; onClose: () => void }) {
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
          padding: 32,
          minWidth: 340,
          maxWidth: 500,
          width: "90vw",
          cursor: "default",
        }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={product.image}
          alt={product.title}
          style={{
            width: "100%",
            aspectRatio: "1/1",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: 20,
          }}
        />
        <div style={{ fontWeight: 700, fontSize: 24 }}>{product.title}</div>
        <div style={{ color: "#c33", fontWeight: 600, margin: "12px 0 20px" }}>{product.price}</div>
        <div style={{ fontSize: 16, color: "#444" }}>{product.description}</div>
        <button
          style={{
            marginTop: 24,
            padding: "10px 18px",
            background: "#eee",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
            float: "right",
          }}
          onClick={onClose}
        >×</button>
      </div>
    </div>
  );
}

type Item = {
  id: string;
  title: string;
  imageUrl: string;
  price: string;
  description: string;
};

interface Props {
  items?: Item[];
  loadMore: () => void;
  onSelect: (item: Item) => void;
  enableInfiniteScroll?: boolean;
}

export function PinGrid({
  items = [],
  loadMore,
  onSelect,
  enableInfiniteScroll = false,
}: Readonly<Props>) {
  const url = getLangObj<typeof links.url>(links.url);
  const router = useRouter();
  const pathname = usePathname();
  const [modalId, setModalId] = useState<string | null>(null);
  const loadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = pathname.split("/").pop();
    if (pathname.startsWith(url.api.products) && id && items.find(p => p.id === id)) {
      setModalId(id);
    } else {
      setModalId(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (!enableInfiniteScroll) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );
    if (loadRef.current) {
      observer.observe(loadRef.current);
    }
    return () => {
      if (loadRef.current) {
        observer.unobserve(loadRef.current);
      }
    };
  }, [loadMore, enableInfiniteScroll]);

  const openModal = (id: string) => {
    router.push(`${url.api.products}${id}`, { scroll: false });
  };

  const closeModal = () => {
    router.push(url.api.products, { scroll: false });
  };

  const modalProduct = items.find((p) => p.id === modalId);

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
          padding: "32px",
        }}
      >
        {items.map((p) => (
          <div
            key={p.id}
            style={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              overflow: "hidden",
              background: "#fff",
              cursor: "pointer",
              transition: "transform .18s",
            }}
            onClick={() => openModal(p.id)}
          >
            <img
              src={p.imageUrl}
              alt={p.title}
              style={{
                width: "100%",
                aspectRatio: "1/1",
                objectFit: "cover",
                display: "block",
              }}
            />
            <div style={{ padding: "16px" }}>
              <div style={{ fontWeight: 600, fontSize: "1.1em" }}>{p.title}</div>
              <div style={{ color: "#c33", marginTop: 4 }}>{p.price}</div>
            </div>
          </div>
        ))}
      </div>
      {modalProduct && (
        <ProductModal
          product={modalProduct}
          onClose={closeModal}
        />
      )}
    </>
  );
}