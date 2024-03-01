import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { DenseTable } from '../DenseTable';
import React from 'react';
import { TableColumn } from '@backstage/core-components';


describe('', () => {
  const columns: TableColumn[] = [
    {
      title: 'Column-A',
      field: 'firstName',
    },
    {
      title: 'Column-B',
      field: 'lastName',
    },
  ];

  it('should render for empty content', async () => {
    const rendered = await renderContent({
      columns: columns,
      loading: false,
      page: 1,
      pageSize: 5,
      tableData: [],
      totalCount: 0,
      onPageChange: () => {},
      onRowsPerPageChange: () => {},
    });
    columns.forEach(c =>
      expect(rendered.getByText(c.title as string)).toBeInTheDocument(),
    );
    expect(rendered.getByText('No tasks available')).toBeInTheDocument();
    expect(rendered.getByText('5 rows')).toBeInTheDocument();
    expect(rendered.queryAllByText('0-0 of 0').length > 0).toBeTruthy();
  });

  it('should render for valid content', async () => {
    const data = [
      {
        firstName: 'John',
        lastName: 'Doe',
      },
    ];
    const rendered = await renderContent({
      columns: columns,
      loading: false,
      page: 1,
      pageSize: 5,
      tableData: data,
      totalCount: data.length,
      onPageChange: () => {},
      onRowsPerPageChange: () => {},
    });
    columns.forEach(c =>
      expect(rendered.getByText(c.title as string)).toBeInTheDocument(),
    );
    data.forEach(d => {
      expect(rendered.getByText(d.firstName)).toBeInTheDocument();
      expect(rendered.getByText(d.lastName)).toBeInTheDocument();
    });
    expect(rendered.getByText('5 rows')).toBeInTheDocument();
    expect(rendered.queryAllByText('1-1 of 1').length > 0).toBeTruthy();
  });
});

async function renderContent(args: {
  tableData: any[];
  loading: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  columns: TableColumn[];
}) {
  return await renderInTestApp(
    <TestApiProvider apis={[]}>
      <DenseTable
        page={args.page}
        columns={args.columns}
        loading={args.loading}
        pageSize={args.pageSize}
        tableData={args.tableData}
        totalCount={args.totalCount}
        onPageChange={args.onPageChange}
        onRowsPerPageChange={args.onRowsPerPageChange}
      />
    </TestApiProvider>,
  );
}
