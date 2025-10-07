import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateFlightDetails_validateUserInput_applyLoyaltyPoints_calculateFlightCost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('ValidateFlightDetails - validate flight details successfully (from validateFlightDetails_validateUserInput)', async () => {
  fetchMock.post('/api/validate-flight', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Flight Details')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Flight details are valid')).toBeInTheDocument();
}, 10000);

test('ValidateFlightDetails - validate flight details fails with error message (from validateFlightDetails_validateUserInput)', async () => {
  fetchMock.post('/api/validate-flight', { valid: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Flight Details')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Flight details are not valid')).toBeInTheDocument();
}, 10000);

test('User input data should be validated successfully. (from validateFlightDetails_validateUserInput)', async () => {
  fetchMock.post('/api/user/validate', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('input-data'), { target: { value: 'valid-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-input')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('validation-success')).toBeInTheDocument();
}, 10000);

test('Error in user input data validation should show error message. (from validateFlightDetails_validateUserInput)', async () => {
  fetchMock.post('/api/user/validate', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('input-data'), { target: { value: 'invalid-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-input')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('validation-error')).toBeInTheDocument();
}, 10000);

test('Loyalty points should be calculated and applied for valid bookings. (from applyLoyaltyPoints_calculateFlightCost)', async () => {
  fetchMock.post('/api/loyalty', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-loyalty')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('loyalty-success')).toBeInTheDocument();
}, 10000);

test('Error in applying loyalty points should show error message. (from applyLoyaltyPoints_calculateFlightCost)', async () => {
  fetchMock.post('/api/loyalty', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-loyalty')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('loyalty-error')).toBeInTheDocument();
}, 10000);

test('CalculateFlightCost - calculate total flight cost successfully (from applyLoyaltyPoints_calculateFlightCost)', async () => {
  fetchMock.post('/api/calculate-cost', { cost: 250 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Ticket Price'), { target: { value: '200' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Cost')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Cost: 250')).toBeInTheDocument();
}, 10000);

test('CalculateFlightCost - calculate total flight cost fails with error message (from applyLoyaltyPoints_calculateFlightCost)', async () => {
  fetchMock.post('/api/calculate-cost', { throws: new Error('Failed to calculate flight cost') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Ticket Price'), { target: { value: '200' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Cost')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to calculate flight cost')).toBeInTheDocument();
}, 10000);

