import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './previousSong_viewApp';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Viewing an album\'s page shows correct information.', async () => {
  fetchMock.get('/api/album/1', { title: 'Album Title' });

  await act(async () => { render(<MemoryRouter><App albumId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Album Title')).toBeInTheDocument();
}, 10000);

test('Viewing an album\'s page fails with an error message.', async () => {
  fetchMock.get('/api/album/1', 500);

  await act(async () => { render(<MemoryRouter><App albumId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading album information')).toBeInTheDocument();
}, 10000);