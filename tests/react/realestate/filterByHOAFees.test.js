import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import HOAFeesFilter from './filterByHOAFees';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter by HOA fees successfully', async () => {
  fetchMock.get('/api/hoa-fees-properties', { properties: [{ id: 1, fee: 100 }] });

  await act(async () => { render(<MemoryRouter><HOAFeesFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hoa-fees-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-by-hoa-fees-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('100')).toBeInTheDocument();
}, 10000);

test('Filter by HOA fees fails with error', async () => {
  fetchMock.get('/api/hoa-fees-properties', 500);

  await act(async () => { render(<MemoryRouter><HOAFeesFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('hoa-fees-input'), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-by-hoa-fees-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering properties by HOA fees.')).toBeInTheDocument();
}, 10000);