import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './calculateHotelCost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('calculateHotelCost - calculates total hotel cost including taxes and fees', async () => {
  fetchMock.get('/api/hotels/1/cost', {
    body: { total: 200 },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-cost-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('$200')).toBeInTheDocument();
}, 10000);

test('calculateHotelCost - shows error message when cost calculation fails', async () => {
  fetchMock.get('/api/hotels/1/cost', {
    body: { message: 'Cost Calculation Error' },
    status: 500,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('calculate-cost-1'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Cost Calculation Error')).toBeInTheDocument();
}, 10000);

