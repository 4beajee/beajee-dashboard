import type { ReactNode } from "react";
import { EmptyState } from "./cards";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
}

export function DataTable<T>({
  rows,
  columns,
  getKey,
}: {
  rows: T[];
  columns: Array<Column<T>>;
  getKey: (row: T, index: number) => string;
}) {
  if (rows.length === 0) return <EmptyState />;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.align === "right" ? "align-right" : undefined}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={getKey(row, index)}>
              {columns.map((column) => (
                <td key={column.key} className={column.align === "right" ? "align-right" : undefined}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
