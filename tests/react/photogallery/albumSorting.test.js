import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './albumSorting';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Album Sorting: success', async () => {
  fetchMock.get('/api/albums?sortBy=date', { body: [{ id: 1, name: 'Album1' }] });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'date' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-button'));
  });

  expect(fetchMock.calls('/api/albums?sortBy=date')).toHaveLength(1);
  expect(screen.getByTestId('album-1')).toBeInTheDocument();
}, 10000);

test('Album Sorting: failure', async () => {
  fetchMock.get('/api/albums?sortBy=date', { throws: new Error('Sort Failed') });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'date' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-button'));
  });

  expect(fetchMock.calls('/api/albums?sortBy=date')).toHaveLength(1);
  expect(screen.getByTestId('sort-failure')).toBeInTheDocument();
}, 10000);

