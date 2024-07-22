import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './filterHotels';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('filterHotels - filters hotels successfully based on criteria', async () => {
  fetchMock.get('/api/hotels?filters=star_5', {
    body: [{ id: 2, name: 'Luxury Hotel' }],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('filter-star-5'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Luxury Hotel')).toBeInTheDocument();
}, 10000);

test('filterHotels - shows error message when no hotels match the filters', async () => {
  fetchMock.get('/api/hotels?filters=star_5', {
    body: [],
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('filter-star-5'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No hotels available')).toBeInTheDocument();
}, 10000);

