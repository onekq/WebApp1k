import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ComparePage from './compareProducts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Comparing multiple products succeeds.', async () => {
  fetchMock.post('/api/compare', { status: 200, body: [{ id: 1, name: 'Product A' }, { id: 2, name: 'Product B' }] });

  await act(async () => { render(<MemoryRouter><ComparePage /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Compare Products')); });

  expect(fetchMock.calls('/api/compare').length).toBe(1);
  expect(screen.getByText('Product A')).toBeInTheDocument();
  expect(screen.getByText('Product B')).toBeInTheDocument();
}, 10000);

test('Comparing multiple products fails with error message.', async () => {
  fetchMock.post('/api/compare', { status: 500, body: { message: 'Comparison failed' } });

  await act(async () => { render(<MemoryRouter><ComparePage /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Compare Products')); });

  expect(fetchMock.calls('/api/compare').length).toBe(1);
  expect(screen.getByText('Comparison failed')).toBeInTheDocument();
}, 10000);