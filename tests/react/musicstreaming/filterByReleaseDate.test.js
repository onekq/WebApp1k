import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByReleaseDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully filters songs by release date', async () => {
  fetchMock.get('/api/songs?release_date=2021', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('release-date-filter'), { target: { value: '2021' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('song-list')).toBeInTheDocument();
}, 10000);

test('fails to filter songs by release date because no songs match the filter', async () => {
  fetchMock.get('/api/songs?release_date=2021', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('release-date-filter'), { target: { value: '2021' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No songs found for the selected release date.')).toBeInTheDocument();
}, 10000);

