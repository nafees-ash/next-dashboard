'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  DeleteIcon,
  LucideDelete,
  MoreHorizontal,
  RemoveFormattingIcon,
  Trash,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Appointment } from '@/lib/types/supabase';
import { COLOR_PALETTE2 } from '../variables';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '../ui/use-toast';

const supabase = createClient();

const deleteMedicine = async (id: number) => {
  const { data, error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);
  return error;
};

export function AppointmentTable({
  data,
  editAppointment,
}: {
  data: Appointment[];
  editAppointment: (id: number) => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRowCount, setSelectedRowCount] = React.useState<{
    length: number;
    array: number[];
  }>({
    length: 0,
    array: [],
  });
  const { toast } = useToast();

  React.useEffect(() => {
    const length = Object.keys(rowSelection).length;
    const getArrays = Object.entries(rowSelection)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => parseInt(key, 10));

    setSelectedRowCount({
      length: length,
      array: getArrays,
    });
  }, [rowSelection]);

  const columns: ColumnDef<Appointment>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: 'Serial No.',
      cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'doctor_name',
      header: () => <div className="text-left">Doctor Name</div>,
      cell: ({ row }) => {
        return <div className="text-left">{row.getValue('doctor_name')}</div>;
      },
    },
    {
      accessorKey: 'done',
      header: () => <div className="text-left">Status</div>,
      cell: ({ row }) => {
        return (
          <div className="text-left">
            {row.getValue('done') ? 'Done' : 'Pending'}
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const appointment = row.original;

        const deleteOptionMedicine = async (id: number) => {
          const error = await deleteMedicine(id);

          if (error) {
            console.log('deleteOptionMedicine: ', error);
          }
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => editAppointment(appointment.id)}>
                Edit Appointment
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const deleteSelectedMedicine = async () => {
    selectedRowCount.array.forEach(async (item, index) => {
      const error = await deleteMedicine(data[item].id);
      if (error) {
        toast({
          description: error?.message,
        });
      } else {
        toast({
          description: 'Medecine Deleted',
        });
      }
    });
    setRowSelection({});
  };
  console.log(data);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 py-4">
        <Input
          placeholder="Find Appointment"
          value={(table.getColumn('id')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('id')?.setFilterValue(event.target.value)
          }
          className="rounded-lg border-[1px] border-gray-300 bg-gray-50 p-3"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="col-span-2 rounded-lg border-[1px] p-3 text-black hover:bg-blue-200"
              style={{
                backgroundColor: COLOR_PALETTE2.lightblue,
                borderColor: COLOR_PALETTE2.darkblue,
              }}
            >
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}{' '}
          page(s).
        </div>
        <Button
          disabled={selectedRowCount.length < 1}
          style={{
            backgroundColor: COLOR_PALETTE2.lightred,
            padding: 7,
            height: '100%',
          }}
          onClick={() => deleteSelectedMedicine()}
        >
          <Trash size={18} color={'#242424'} />
        </Button>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
