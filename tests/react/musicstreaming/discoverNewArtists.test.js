import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './discoverNewArtists';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Discovery feature suggests new artists based on user preferences.', async () => {
  fetchMock.get('/discover/new-artists', { artists: [{ id: 1, name: 'NewArtist' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Discover New Artists')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('NewArtist')).toBeInTheDocument();
}, 10000);

test('Shows error message when discovery feature fails to suggest new artists.', async () => {
  fetchMock.get('/discover/new-artists', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Discover New Artists')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

