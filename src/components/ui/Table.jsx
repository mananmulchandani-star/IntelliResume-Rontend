import React, { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Table components for structured tabular data presentation.
 */

export const Table = forwardRef(function Table(
  { className, containerClassName, children, ...props },
  ref
) {
  return (
    <div
      className={clsx(
        'relative w-full overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-xs',
        containerClassName
      )}
    >
      <table
        ref={ref}
        className={clsx('w-full caption-bottom text-sm text-left border-collapse', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
});
Table.displayName = 'Table';

export const TableHeader = forwardRef(function TableHeader(
  { className, children, ...props },
  ref
) {
  return (
    <thead
      ref={ref}
      className={clsx('bg-neutral-50/80 border-b border-neutral-200', className)}
      {...props}
    >
      {children}
    </thead>
  );
});
TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef(function TableBody(
  { className, children, ...props },
  ref
) {
  return (
    <tbody
      ref={ref}
      className={clsx('divide-y divide-neutral-200/80 bg-white', className)}
      {...props}
    >
      {children}
    </tbody>
  );
});
TableBody.displayName = 'TableBody';

export const TableFooter = forwardRef(function TableFooter(
  { className, children, ...props },
  ref
) {
  return (
    <tfoot
      ref={ref}
      className={clsx('border-t border-neutral-200 bg-neutral-50/50 font-medium text-neutral-900', className)}
      {...props}
    >
      {children}
    </tfoot>
  );
});
TableFooter.displayName = 'TableFooter';

export const TableRow = forwardRef(function TableRow(
  { className, isSelected, children, ...props },
  ref
) {
  return (
    <tr
      ref={ref}
      className={clsx(
        'transition-colors duration-100 hover:bg-neutral-50/75',
        isSelected && 'bg-primary-50/50 hover:bg-primary-50',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
});
TableRow.displayName = 'TableRow';

export const TableHead = forwardRef(function TableHead(
  { className, children, ...props },
  ref
) {
  return (
    <th
      ref={ref}
      scope="col"
      className={clsx(
        'h-10 px-4 py-3 text-left align-middle text-xs font-semibold text-neutral-500 uppercase tracking-wider select-none',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
});
TableHead.displayName = 'TableHead';

export const TableCell = forwardRef(function TableCell(
  { className, children, ...props },
  ref
) {
  return (
    <td
      ref={ref}
      className={clsx('px-4 py-3.5 align-middle text-neutral-700 font-normal', className)}
      {...props}
    >
      {children}
    </td>
  );
});
TableCell.displayName = 'TableCell';

export const TableCaption = forwardRef(function TableCaption(
  { className, children, ...props },
  ref
) {
  return (
    <caption
      ref={ref}
      className={clsx('mt-3 text-xs text-neutral-400 text-center pb-2', className)}
      {...props}
    >
      {children}
    </caption>
  );
});
TableCaption.displayName = 'TableCaption';

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Footer = TableFooter;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.Caption = TableCaption;

export default Table;
