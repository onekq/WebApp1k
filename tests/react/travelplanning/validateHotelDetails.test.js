import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './validateHotelDetails';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('validateHotelDetails - validates hotel details successfully before booking', async () => {
  fetchMock.get('/api/hotels/1/details', {
    body: { id: 1, name: 'Checked Hotel' },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('validate-hotel-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Checked Hotel')).toBeInTheDocument();
}, 10000);

test('validateHotelDetails - shows error when validation fails', async () => {
  fetchMock.get('/api/hotels/1/details', {
    body: { message: 'Validation Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('validate-hotel-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Validation Error')).toBeInTheDocument();
}, 10000);

