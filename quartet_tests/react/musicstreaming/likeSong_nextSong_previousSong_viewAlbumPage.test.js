import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './likeSong_nextSong_previousSong_viewAlbumPage';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Liking a song fails with an error message. (from likeSong_nextSong)', async () => {
  fetchMock.post('/api/likeSong', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('like-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error liking the song')).toBeInTheDocument();
}, 10000);

test('Next Song - success shows next song started message (from likeSong_nextSong)', async () => {
  fetchMock.post('/api/next-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Next Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Next song started')).toBeInTheDocument();
}, 10000);

test('Next Song - failure shows error message (from likeSong_nextSong)', async () => {
  fetchMock.post('/api/next-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Next Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to skip to next song')).toBeInTheDocument();
}, 10000);

test('Previous Song - success shows previous song started message (from previousSong_viewAlbumPage)', async () => {
  fetchMock.post('/api/previous-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Previous Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Previous song started')).toBeInTheDocument();
}, 10000);

test('Previous Song - failure shows error message (from previousSong_viewAlbumPage)', async () => {
  fetchMock.post('/api/previous-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Previous Song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to go back to previous song')).toBeInTheDocument();
}, 10000);

