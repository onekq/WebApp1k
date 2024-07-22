import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './albumSearch';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Searching for an album by name returns accurate results.', async () => {
  fetchMock.get('/albums?name=TestAlbum', { albums: [{ id: 1, name: 'TestAlbum' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search albums'), { target: { value: 'TestAlbum' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('TestAlbum')).toBeInTheDocument();
}, 10000);

test('Shows error message when searching for an album by name fails.', async () => {
  fetchMock.get('/albums?name=TestAlbum', { throws: new Error('Network Error') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search albums'), { target: { value: 'TestAlbum' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Network Error')).toBeInTheDocument();
}, 10000);

