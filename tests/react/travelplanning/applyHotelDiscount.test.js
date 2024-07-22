import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './applyHotelDiscount';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('applyHotelDiscount - applies discount code successfully to hotel booking', async () => {
  fetchMock.post('/api/hotels/1/apply-discount', {
    body: { total: 180 },
    status: 200,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('discount-code-input'), { target: { value: 'DISCOUNT10' } });
    fireEvent.click(screen.getByTestId('apply-discount-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('$180')).toBeInTheDocument();
}, 10000);

test('applyHotelDiscount - shows error message when discount code application fails', async () => {
  fetchMock.post('/api/hotels/1/apply-discount', {
    body: { message: 'Invalid Discount Code' },
    status: 400,
  });

  await act(async () => {
    render(<MemoryRouter><YourComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('discount-code-input'), { target: { value: 'DISCOUNT10' } });
    fireEvent.click(screen.getByTestId('apply-discount-button'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid Discount Code')).toBeInTheDocument();
}, 10000);

