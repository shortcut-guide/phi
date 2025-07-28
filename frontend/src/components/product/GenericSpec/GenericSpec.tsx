import React from "react";
import { labelize } from "@/f/utils/labelize";

type Props = {
  label: string;
  value: any;
  dict: Record<string, string>;
};

const GenericSpec: React.FC<Props> = ({ label, value, dict }) => (
  <div className="bg-blue-50 rounded px-2 py-1 font-semibold flex flex-col min-w-0 max-w-full">
    <div className="text-[0.6875em] smb-1 break-keep">{dict[label] ?? labelize(label)}</div>
    <div className="text-[0.6875em] break-all whitespace-pre-wrap bg-white rounded px-1 py-0.5">
      {typeof value === "object"
        ? JSON.stringify(value, null, 2)
        : (dict[value] ?? String(value))}
    </div>
  </div>
);

export default GenericSpec;
