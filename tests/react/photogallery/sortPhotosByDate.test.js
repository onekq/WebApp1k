import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SortPhotosByDateComponent from './sortPhotosByDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Users can successfully sort photos by date.', async () => {
  fetchMock.get('/api/sort-photos-by-date', { success: true, data: ['photo1', 'photo2'] });

  await act(async () => { render(<MemoryRouter><SortPhotosByDateComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-date-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Photos sorted by date')).toBeInTheDocument();
}, 10000);

test('Shows an error message when sorting photos by date fails.', async () => {
  fetchMock.get('/api/sort-photos-by-date', { success: false });

  await act(async () => { render(<MemoryRouter><SortPhotosByDateComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('sort-by-date-button')); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText('Failed to sort photos by date')).toBeInTheDocument();
}, 10000);

