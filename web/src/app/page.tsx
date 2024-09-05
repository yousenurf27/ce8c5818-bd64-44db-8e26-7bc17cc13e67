'use client';

import { api } from '@/utils/axiosInstance';
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
  SortingState,
  getSortedRowModel,
  Column,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Save, SquareMinus, SquarePlus } from 'lucide-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type Employee = {
  id?: number;
  firstName: string;
  lastName: string;
  position: string;
  phone: string;
  email: string;
};

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'none';
  }
}

const defaultColumn: Partial<ColumnDef<Employee>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(initialValue);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const changeRef = useRef('');

    const onChange = (v: any) => {
      setValue(v);
      const res = table.options.meta?.updateData(index, id, v) as any;

      if (res === 'error') changeRef.current = 'error';
      if (res === 'edit') changeRef.current = 'edit';
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        className={`p-2 text-black border shadow rounded ${
          changeRef.current === 'error'
            ? 'bg-red-600'
            : changeRef.current === 'edit'
            ? 'bg-yellow-600'
            : ''
        }`}
        value={value as string}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    );
  },
};

function useSkipper() {
  const shouldSkipRef = useRef(true);
  const shouldSkip = shouldSkipRef.current;

  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

const initialValueNewData = {
  firstName: '',
  lastName: '',
  position: '',
  phone: '',
  email: '',
};

export default function Home() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [toggleRowForm, setToggleRowForm] = useState<boolean>(false);
  const [toggleSave, setToggleSave] = useState<boolean>(true);

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        header: () => <span>First Name</span>,
        accessorKey: 'firstName',
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'lastName',
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'position',
        header: () => <span>Position</span>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: 'phone',
        header: () => <span>Phone</span>,
        footer: (props) => props.column.id,
        meta: {
          filterVariant: 'none',
        },
      },
      {
        accessorKey: 'email',
        header: () => <span>Email</span>,
        footer: (props) => props.column.id,
        meta: {
          filterVariant: 'none',
        },
      },
    ],
    []
  );

  const [data, setData] = useState<Employee[]>([]);
  const [updateData, setUpdateData] = useState<Employee[]>([]);
  const [newData, setNewData] = useState<Employee>(initialValueNewData);
  const [error, setError] = useState<Employee>(initialValueNewData);
  const [refetch, setRefetch] = useState<boolean>(true);

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnFilters,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex();

        //validation
        if (!value) {
          setToggleSave(true);
          return 'error';
        }

        if (
          columnId === 'email' &&
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value as string)
        ) {
          setToggleSave(true);
          return 'error';
        }

        const existData = updateData.filter(
          (d) => d.id === data[rowIndex].id
        ) as any;

        //check email
        if (columnId === 'email') {
          const alreadyEmail = data.filter((d, index) => {
            if (index !== rowIndex) {
              if (d.email === value) {
                return d;
              }
            }
          });

          if (alreadyEmail.length > 0) {
            setToggleSave(true);
            return 'error';
          } else {
            const alreadyEmail2 = updateData.filter((d) => {
              if (d.email === value) {
                return d;
              }
            });

            if (alreadyEmail2.length > 0) {
              setToggleSave(true);
              return 'error';
            }

            setUpdateData((prev) => {
              if (prev.length === 0) {
                return [{ ...data[rowIndex], [columnId]: value as string }];
              }

              if (existData.length === 0) {
                return [
                  ...prev,
                  { ...data[rowIndex], [columnId]: value as string },
                ];
              }

              return prev.map((d) => {
                if (d.id === data[rowIndex].id) {
                  return { ...d, [columnId]: value as string };
                }

                return d;
              });
            });

            setToggleSave(false);
            return 'edit';
          }
        }

        setUpdateData((prev) => {
          if (prev.length === 0) {
            return [{ ...data[rowIndex], [columnId]: value as string }];
          }

          if (existData.length === 0) {
            return [
              ...prev,
              { ...data[rowIndex], [columnId]: value as string },
            ];
          }

          return prev.map((d) => {
            if (d.id === data[rowIndex].id) {
              return { ...d, [columnId]: value as string };
            }

            return d;
          });
        });

        setToggleSave(false);
        return 'edit';
      },
    },
    debugTable: true,
  });

  const onSetNewDataHandler = (target: string, value: string) => {
    setNewData((prev) => ({
      ...prev,
      [target]: value,
    }));
  };

  const onValidationHandler = (target: string) => {
    const setErrorFn = (target: string) => {
      setError((prev) => {
        return { ...prev, [target]: 'Wajib di isi!' };
      });
    };

    if (target == 'firstName')
      newData.firstName.length >= 2
        ? setError((prev) => {
            return { ...prev, [target]: '' };
          })
        : setErrorFn(target);

    if (target == 'lastName')
      newData.lastName.length >= 2 && target == 'lastName'
        ? setError((prev) => {
            return { ...prev, [target]: '' };
          })
        : setErrorFn(target);

    if (target == 'position')
      newData.position.length >= 1
        ? setError((prev) => {
            return { ...prev, [target]: '' };
          })
        : setErrorFn(target);

    if (target == 'phone')
      newData.phone.length >= 2
        ? setError((prev) => {
            return { ...prev, [target]: '' };
          })
        : setErrorFn(target);

    if (target == 'email')
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newData.email)
        ? setError((prev) => {
            return { ...prev, [target]: 'Email tidak valid' };
          })
        : setError((prev) => {
            return { ...prev, [target]: '' };
          });

    if (
      newData.firstName &&
      newData.lastName &&
      newData.position &&
      newData.phone &&
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newData.email)
    ) {
      setToggleSave(false);
    } else {
      setToggleSave(true);
    }
  };

  const onSaveHandler = async () => {
    if (
      newData.firstName &&
      newData.lastName &&
      newData.position &&
      newData.phone &&
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newData.email)
    ) {
      await api
        .post('employee/', newData)
        .then((data) => {
          alert(
            `Hay! ${data.data.data.firstName + ' ' + data.data.data.lastName}`
          );
          setToggleRowForm(false);
          setNewData(initialValueNewData);
        })
        .catch((e) => {
          alert(`Opps! ${e.response.data.error}`);
        });
    }

    await api
      .patch('employee/', updateData)
      .then((data) => {
        alert('Success update data users!');
      })
      .catch((e) => {
        alert(`Opps! ${e.response.data.error}`);
      });

    setToggleSave(true);
    setRefetch(true);
  };

  useEffect(() => {
    if (refetch) {
      const fetch = async () => {
        const res = await api.get('employee/');

        setData(res.data.data);
      };

      fetch();
      setRefetch(false);
    }
  }, [refetch]);

  return (
    <div className='container mx-auto p-2'>
      <div className='relative overflow-x-auto'>
        <div className='py-3 w-full flex justify-end gap-2'>
          <button
            onClick={() => {
              setToggleRowForm(!toggleRowForm);
              setNewData(initialValueNewData);
              setError(initialValueNewData);
              setToggleSave(true);
            }}
          >
            {toggleRowForm ? <SquareMinus /> : <SquarePlus />}
          </button>
          <button disabled={toggleSave} onClick={onSaveHandler}>
            <Save
              className={`${toggleSave && 'text-gray-500 cursor-not-allowed'}`}
            />
          </button>
        </div>
        <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      scope='col'
                      className='px-6 py-3'
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={
                              header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : ''
                            }
                            onClick={header.column.getToggleSortingHandler()}
                            title={
                              header.column.getCanSort()
                                ? header.column.getNextSortingOrder() === 'asc'
                                  ? 'Sort ascending'
                                  : header.column.getNextSortingOrder() ===
                                    'desc'
                                  ? 'Sort descending'
                                  : 'Clear sort'
                                : undefined
                            }
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} />
                            </div>
                          ) : null}
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {toggleRowForm && (
              <tr className='bg-white border-b dark:bg-gray-400 dark:border-gray-700'>
                <td className='px-6 py-4'>
                  <input
                    type='text'
                    className='p-2 text-black border shadow rounded'
                    name='firstName'
                    value={newData.firstName}
                    onChange={(e) => {
                      onSetNewDataHandler(e.target.name, e.target.value);
                      onValidationHandler(e.target.name);
                    }}
                  />
                  <p className='mt-1 text-xs text-red-600'>
                    {error.firstName && error.firstName}
                  </p>
                </td>
                <td className='px-6 py-4'>
                  <input
                    type='text'
                    className='p-2 text-black border shadow rounded'
                    name='lastName'
                    value={newData.lastName}
                    onChange={(e) => {
                      onSetNewDataHandler(e.target.name, e.target.value);
                      onValidationHandler(e.target.name);
                    }}
                  />
                  <p className='mt-1 text-xs text-red-600'>
                    {error.lastName && error.lastName}
                  </p>
                </td>
                <td className='px-6 py-4'>
                  <input
                    type='text'
                    className='p-2 text-black border shadow rounded'
                    name='position'
                    value={newData.position}
                    onChange={(e) => {
                      onSetNewDataHandler(e.target.name, e.target.value);
                      onValidationHandler(e.target.name);
                    }}
                    onBlur={(e) => {
                      onValidationHandler(e.target.name);
                    }}
                  />
                  <p className='mt-1 text-xs text-red-600'>
                    {error.position && error.position}
                  </p>
                </td>
                <td className='px-6 py-4'>
                  <input
                    type='text'
                    className='p-2 text-black border shadow rounded'
                    name='phone'
                    value={newData.phone}
                    onChange={(e) => {
                      onSetNewDataHandler(e.target.name, e.target.value);
                      onValidationHandler(e.target.name);
                    }}
                  />
                  <p className='mt-1 text-xs text-red-600'>
                    {error.phone && error.phone}
                  </p>
                </td>
                <td className='px-6 py-4'>
                  <input
                    className='p-2 text-black border shadow rounded'
                    type='email'
                    name='email'
                    value={newData.email}
                    onChange={(e) => {
                      onSetNewDataHandler(e.target.name, e.target.value);
                      onValidationHandler(e.target.name);
                    }}
                    onBlur={(e) => {
                      onValidationHandler(e.target.name);
                    }}
                  />
                  <p className='mt-1 text-xs text-red-600'>
                    {error.email && error.email}
                  </p>
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td className='px-6 py-4' key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className='my-3 flex justify-between items-center'>
          <p>{table.getRowModel().rows.length} Rows</p>
          <div className='flex items-center gap-2'>
            <button
              className='border rounded p-1'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button
              className='border rounded p-1'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <span className='flex items-center gap-1'>
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === 'none' ? (
    <></>
  ) : (
    <DebouncedInput
      className='mt-2 p-2 border shadow rounded text-black'
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type='text'
      value={(columnFilterValue ?? '') as string}
    />
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
