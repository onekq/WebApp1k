import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './searchAutocomplete';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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