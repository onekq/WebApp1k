import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './sortHotels';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('sortHotels - sorts hotel search results successfully', async () => {
  fetchMock.get('/api/hotels?sort=price', {
    body: [{ id: 3, name: 'Affordable Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-price'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Affordable Hotel')).toBeInTheDocument();
}, 10000);

test('sortHotels - shows error message on sorting failure', async () => {
  fetchMock.get('/api/hotels?sort=price', {
    body: { message: 'Sorting Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('sort-price'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sorting Error')).toBeInTheDocument();
}, 10000);

