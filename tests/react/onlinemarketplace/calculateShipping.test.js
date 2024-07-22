import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './calculateShipping';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('correctly calculates shipping based on location.', async () => {
  fetchMock.post('/api/shipping', { body: { cost: 15 } });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Shipping')); });

  expect(fetchMock.calls('/api/shipping').length).toEqual(1);
  expect(screen.getByText('Shipping cost: $15')).toBeInTheDocument();
}, 10000);

test('displays error on failing to calculate shipping.', async () => {
  fetchMock.post('/api/shipping', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('location-input'), { target: { value: '54321' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Shipping')); });

  expect(fetchMock.calls('/api/shipping').length).toEqual(1);
  expect(screen.getByText('Failed to calculate shipping')).toBeInTheDocument();
}, 10000);

