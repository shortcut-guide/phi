import React from "react";
import { labelize } from "./utils";

const TabbedSpec: React.FC<{
  label: string;
  data: Record<string, any>;
  active: string;
  setActive: (tab: string) => void;
  dict: any;
}> = ({ label, data, active, setActive, dict }) => (
  <div className="col-span-2 bg-blue-50 rounded px-2 py-2 text-xs text-blue-700 font-semibold flex flex-col min-w-0 max-w-full">
    <div className="text-blue-500 mb-1 break-keep">{dict[label] ?? labelize(label)}</div>
    <div className="flex gap-1 mb-2">
      {Object.keys(data).map((tab) => (
        <button
          key={tab}
          className={`px-2 py-1 rounded ${active === tab ? "bg-blue-500 text-white" : "bg-gray-100 text-blue-700"}`}
          onClick={e => {
            e.stopPropagation();
            setActive(tab);
          }}
          type="button"
        >
          {dict[tab] ?? tab}
        </button>
      ))}
    </div>
    <div className="bg-white rounded px-2 py-1 text-blue-900">
      {Object.entries(data[active])
        .filter(([k]) => k !== "base_price" && k !== "price")
        .map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-gray-500">{dict[k] ?? labelize(k)}:</span>
            <span>{dict[String(v)] ?? String(v)}</span>
          </div>
        ))}
    </div>
  </div>
);

export default TabbedSpec;
