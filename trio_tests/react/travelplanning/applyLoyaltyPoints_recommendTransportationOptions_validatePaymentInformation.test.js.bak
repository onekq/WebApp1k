import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyLoyaltyPoints_recommendTransportationOptions_validatePaymentInformation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Loyalty points should be calculated and applied for valid bookings.', async () => {
  fetchMock.post('/api/loyalty', 200);

  await act(async () => { render(<MemoryRouter><LoyaltyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-loyalty')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('loyalty-success')).toBeInTheDocument();
}, 10000);

test('Error in applying loyalty points should show error message.', async () => {
  fetchMock.post('/api/loyalty', 400);

  await act(async () => { render(<MemoryRouter><LoyaltyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-loyalty')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('loyalty-error')).toBeInTheDocument();
}, 10000);

test('should render recommended transportation options at the destination', async () => {
  fetchMock.get('/api/transportation', { transportation: ['Rental Car', 'Metro'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Transportation Options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Rental Car')).toBeInTheDocument();
}, 10000);

test('should show error if fetching transportation options fails', async () => {
  fetchMock.get('/api/transportation', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Enter destination'), { target: { value: 'New York' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Get Transportation Options')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load transportation options')).toBeInTheDocument();
}, 10000);

test('Valid payment information should be processed successfully.', async () => {
  fetchMock.post('/api/payment', 200);

  await act(async () => { render(<MemoryRouter><PaymentComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('card-number'), { target: { value: '1234567890123456' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-payment')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Invalid payment information should show error message.', async () => {
  fetchMock.post('/api/payment', 400);

  await act(async () => { render(<MemoryRouter><PaymentComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('card-number'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-payment')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
