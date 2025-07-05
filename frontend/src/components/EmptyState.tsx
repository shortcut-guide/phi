import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const EmptyState: React.FC<Props> = ({ children }) => (
  <div className="empty-state">
    <div className="icon">&#128712;</div>
    <div className="message">{children}</div>
    <style jsx>{`
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 2px dashed var(--color-border, #ccc);
        padding: 2rem;
        border-radius: 0.75rem;
        background-color: var(--color-bg-light, #f9f9f9);
        color: var(--color-text, #333);
        text-align: center;
      }
      .empty-state .icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }
      .empty-state .message {
        font-size: 1rem;
      }
    `}</style>
  </div>
);

export default EmptyState;
