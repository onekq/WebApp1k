import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteDownloadedSong_topCharts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully deletes a downloaded song', async () => {
  fetchMock.delete('/api/delete-song', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('delete-success')).toBeInTheDocument();
}, 10000);

test('fails to delete a downloaded song due to server error', async () => {
  fetchMock.delete('/api/delete-song', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-song')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to delete song. Please try again.')).toBeInTheDocument();
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