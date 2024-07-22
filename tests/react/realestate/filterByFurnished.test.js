import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import FurnishedFilter from './filterByFurnished';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter by furnished properties successfully', async () => {
  fetchMock.get('/api/furnished-properties', { properties: [{ id: 1, name: "Furnished 1" }] });

  await act(async () => { render(<MemoryRouter><FurnishedFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-furnished-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Furnished 1')).toBeInTheDocument();
}, 10000);

test('Filter by furnished properties fails with error', async () => {
  fetchMock.get('/api/furnished-properties', 500);

  await act(async () => { render(<MemoryRouter><FurnishedFilter /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('filter-furnished-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error filtering furnished properties.')).toBeInTheDocument();
}, 10000);

