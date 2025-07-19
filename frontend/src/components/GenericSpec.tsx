import React from "react";
import { labelize } from "@/f/utils/labelize";

const GenericSpec: React.FC<{ label: string; value: any; dict: any }> = ({ label, value, dict }) => (
  <div className="bg-blue-50 rounded px-2 py-1 text-xs text-blue-700 font-semibold flex flex-col min-w-0 max-w-full">
    <div className="text-blue-500 mb-1 break-keep">{dict[label] ?? labelize(label)}</div>
    <div className="break-all whitespace-pre-wrap bg-white rounded px-1 py-0.5 text-blue-900">
      {typeof value === "object" ? JSON.stringify(value, null, 2) : (dict[value] ?? String(value))}
    </div>
  </div>
);

export default GenericSpec;
