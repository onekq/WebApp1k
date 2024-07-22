import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SortPhotosByNameComponent from './sortPhotosByName';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Users can successfully sort photos by name.', async () => {
  fetchMock.get('/api/sort-photos-by-name', { success: true, data: ['photoA', 'photoB'] });

  await act(async () => { render(<MemoryRouter><SortPhotosByNameComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-name-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Photos sorted by name')).toBeInTheDocument();
}, 10000);

test('Shows an error message when sorting photos by name fails.', async () => {
  fetchMock.get('/api/sort-photos-by-name', { success: false });

  await act(async () => { render(<MemoryRouter><SortPhotosByNameComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-name-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to sort photos by name')).toBeInTheDocument();
}, 10000);