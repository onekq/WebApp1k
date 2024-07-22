import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByArtist';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully filters songs by artist', async () => {
  fetchMock.get('/api/songs?artist=JohnDoe', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('artist-filter'), { target: { value: 'JohnDoe' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('song-list')).toBeInTheDocument();
}, 10000);

test('fails to filter songs by artist because no songs match the filter', async () => {
  fetchMock.get('/api/songs?artist=UnknownArtist', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('artist-filter'), { target: { value: 'UnknownArtist' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No songs found for the selected artist.')).toBeInTheDocument();
}, 10000);

