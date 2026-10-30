import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";
import type { Item } from "@webstack/shared";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, Item>();
const columns = columnHelper.columns([
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("stock", { header: "Stock" }),
]);

export function ItemsTable({ items }: { items: Item[] }) {
  const table = useTable({ features, columns, data: items });

  if (items.length === 0) return <p className="text-muted-foreground">No items yet.</p>;

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => (
                <TableHead key={header.id}>
                  <table.FlexRender header={header} />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
