import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './playSongPreview_removeSongFromQueue_searchAutocomplete';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Playing a preview of a song works.', async () => {
  fetchMock.post('/api/playPreview', 200);

  await act(async () => { render(<MemoryRouter><PreviewComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-preview-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('preview-playing')).toBeInTheDocument();
}, 10000);

test('Playing a preview of a song fails with an error message.', async () => {
  fetchMock.post('/api/playPreview', 500);

  await act(async () => { render(<MemoryRouter><PreviewComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('play-preview-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error playing preview')).toBeInTheDocument();
}, 10000);

test('successfully removes song from playback queue', async () => {
  fetchMock.post('/api/remove-from-queue', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-from-queue')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('removal-success')).toBeInTheDocument();
}, 10000);

test('fails to remove song from playback queue due to server error', async () => {
  fetchMock.post('/api/remove-from-queue', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-from-queue')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to remove song from queue. Please try again.')).toBeInTheDocument();
}, 10000);

test('Search autocomplete suggests correct terms.', async () => {
  fetchMock.get('/search/autocomplete?query=Test', { suggestions: ['TestSong'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Test' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestSong')).toBeInTheDocument();
}, 10000);

test('Shows error message when search autocomplete fails.', async () => {
  fetchMock.get('/search/autocomplete?query=Test', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Test' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);
