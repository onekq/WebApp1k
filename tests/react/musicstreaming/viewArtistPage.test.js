import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ArtistPage from './viewArtistPage';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Viewing an artist\'s page shows correct information.', async () => {
  fetchMock.get('/api/artist/1', { name: 'Artist Name', bio: 'Artist Bio' });

  await act(async () => { render(<MemoryRouter><ArtistPage artistId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Artist Name')).toBeInTheDocument();
}, 10000);

test('Viewing an artist\'s page fails with an error message.', async () => {
  fetchMock.get('/api/artist/1', 500);

  await act(async () => { render(<MemoryRouter><ArtistPage artistId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading artist information')).toBeInTheDocument();
}, 10000);

