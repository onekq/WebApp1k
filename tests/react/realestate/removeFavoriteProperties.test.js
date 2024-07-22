import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import RemoveFavoriteProperties from './removeFavoriteProperties';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully removes favorite properties', async () => {
  fetchMock.post('/api/favorites/remove', 200);

  await act(async () => { render(<MemoryRouter><RemoveFavoriteProperties /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('remove-confirmation')).toBeInTheDocument();
}, 10000);

test('fails to remove favorite properties and shows error message', async () => {
  fetchMock.post('/api/favorites/remove', 500);

  await act(async () => { render(<MemoryRouter><RemoveFavoriteProperties /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('remove-favorite-btn')); });

  expect(fetchMock.calls()).toHaveLength(1); 
  expect(screen.getByTestId('remove-error')).toBeInTheDocument();
}, 10000);

