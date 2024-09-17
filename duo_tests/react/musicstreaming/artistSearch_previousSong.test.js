import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './artistSearch_previousSong';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Searching for an artist by name returns accurate results.', async () => {
  fetchMock.get('/artists?name=TestArtist', { artists: [{ id: 1, name: 'TestArtist' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search artists'), { target: { value: 'TestArtist' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestArtist')).toBeInTheDocument();
}, 10000);

test('Shows error message when searching for an artist by name fails.', async () => {
  fetchMock.get('/artists?name=TestArtist', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search artists'), { target: { value: 'TestArtist' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

test('Previous Song - success shows previous song started message', async () => {
  fetchMock.post('/api/previous-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Previous Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Previous song started')).toBeInTheDocument();
}, 10000);

test('Previous Song - failure shows error message', async () => {
  fetchMock.post('/api/previous-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Previous Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to go back to previous song')).toBeInTheDocument();
}, 10000);