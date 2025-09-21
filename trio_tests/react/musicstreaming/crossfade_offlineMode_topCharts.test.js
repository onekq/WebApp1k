import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './crossfade_offlineMode_topCharts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Crossfade - success shows crossfade activated message', async () => {
  fetchMock.post('/api/crossfade', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Crossfade')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Crossfade activated')).toBeInTheDocument();
}, 10000);

test('Crossfade - failure shows error message', async () => {
  fetchMock.post('/api/crossfade', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Crossfade')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to activate crossfade')).toBeInTheDocument();
}, 10000);

test('successfully downloads songs for offline playback', async () => {
  fetchMock.post('/api/download', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('download-song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('download-success')).toBeInTheDocument();
}, 10000);

test('fails to download songs for offline playback due to network error', async () => {
  fetchMock.post('/api/download', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('download-song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to download song. Please try again.')).toBeInTheDocument();
}, 10000);

test('Top charts display the top songs correctly.', async () => {
  fetchMock.get('/charts/top', { songs: [{ id: 1, name: 'TopChartSong' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Top Charts')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TopChartSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when top charts fail to display.', async () => {
  fetchMock.get('/charts/top', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Top Charts')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);
