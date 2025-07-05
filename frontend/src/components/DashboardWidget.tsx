import React from "react";

type Props = {
  number?: string;
  title?: string;
  type?: "success" | "error" | string;
};

const DashboardWidget: React.FC<Props> = ({
  number = "+54",
  title = "New messages",
  type = "success",
}) => (
  <div
    className={`dashboard-widget radius-large space-24 elevation-400 space-content type-${type}`}
  >
    <p className="size-48">
      <strong>{number}</strong>
    </p>
    <p className="size-20">
      <em>{title}</em>
    </p>
    <style jsx>{`
      .dashboard-widget.type-success > p:first-child {
        color: var(--success-700);
      }
      .dashboard-widget.type-error > p:first-child {
        color: var(--error-700);
      }
      .dashboard-widget {
        background-color: var(--neutral-100);
      }
      :global(.darkmode .dashboard-widget) {
        background-color: var(--neutral-900);
      }
      :global(.darkmode .dashboard-widget.type-success > p:first-child) {
        color: var(--success-400);
      }
      :global(.darkmode .dashboard-widget.type-error > p:first-child) {
        color: var(--error-400);
      }
    `}</style>
  </div>
);

export default DashboardWidget;
