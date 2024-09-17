import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterByPopularity_genreSearch';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully filters songs by popularity', async () => {
  fetchMock.get('/api/songs?popularity=high', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('popularity-filter'), { target: { value: 'high' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('song-list')).toBeInTheDocument();
}, 10000);

test('fails to filter songs by popularity because no songs match the filter', async () => {
  fetchMock.get('/api/songs?popularity=high', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('popularity-filter'), { target: { value: 'high' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-filter')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No popular songs found.')).toBeInTheDocument();
}, 10000);

test('Searching for a genre by name returns accurate results.', async () => {
  fetchMock.get('/genres?name=TestGenre', { genres: [{ id: 1, name: 'TestGenre' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search genres'), { target: { value: 'TestGenre' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestGenre')).toBeInTheDocument();
}, 10000);

test('Shows error message when searching for a genre by name fails.', async () => {
  fetchMock.get('/genres?name=TestGenre', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search genres'), { target: { value: 'TestGenre' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);