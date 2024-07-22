import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './unlikeSong';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Unliking a song removes it from the user\'s favorites.', async () => {
  fetchMock.post('/api/unlikeSong', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Unliking a song fails with an error message.', async () => {
  fetchMock.post('/api/unlikeSong', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error unliking the song')).toBeInTheDocument();
}, 10000);
