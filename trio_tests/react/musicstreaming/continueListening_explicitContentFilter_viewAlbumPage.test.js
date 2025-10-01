import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './continueListening_explicitContentFilter_viewAlbumPage';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully resumes playback where user left off', async () => {
  fetchMock.get('/api/continue-listening', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('continue-listening')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('resume-playback')).toBeInTheDocument();
}, 10000);

test('fails to resume playback due to session timeout', async () => {
  fetchMock.get('/api/continue-listening', 401);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('continue-listening')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Session timed out. Please log in again.')).toBeInTheDocument();
}, 10000);

test('successfully filters explicit content', async () => {
  fetchMock.get('/api/songs?explicit=false', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('content-filter'), { target: { value: 'false' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('song-list')).toBeInTheDocument();
}, 10000);

test('fails to filter explicit content because no songs match the filter', async () => {
  fetchMock.get('/api/songs?explicit=false', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('content-filter'), { target: { value: 'false' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No explicit songs found.')).toBeInTheDocument();
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
