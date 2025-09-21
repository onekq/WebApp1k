import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './calculateFlightCost_checkSeatAvailability_validateUserInput';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('CalculateFlightCost - calculate total flight cost successfully', async () => {
  fetchMock.post('/api/calculate-cost', { cost: 250 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Ticket Price'), { target: { value: '200' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Cost')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Total Cost: 250')).toBeInTheDocument();
}, 10000);

test('CalculateFlightCost - calculate total flight cost fails with error message', async () => {
  fetchMock.post('/api/calculate-cost', { throws: new Error('Failed to calculate flight cost') });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Ticket Price'), { target: { value: '200' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Calculate Cost')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to calculate flight cost')).toBeInTheDocument();
}, 10000);

test('CheckSeatAvailability - check seat availability successfully', async () => {
  fetchMock.get('/api/seat-availability', { available: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Check Seat Availability')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seats are available')).toBeInTheDocument();
}, 10000);

test('CheckSeatAvailability - check seat availability fails with error message', async () => {
  fetchMock.get('/api/seat-availability', { available: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Check Seat Availability')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Seats are not available')).toBeInTheDocument();
}, 10000);

test('User input data should be validated successfully.', async () => {
  fetchMock.post('/api/user/validate', 200);

  await act(async () => { render(<MemoryRouter><InputValidationComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('input-data'), { target: { value: 'valid-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-input')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('validation-success')).toBeInTheDocument();
}, 10000);

test('Error in user input data validation should show error message.', async () => {
  fetchMock.post('/api/user/validate', 400);

  await act(async () => { render(<MemoryRouter><InputValidationComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('input-data'), { target: { value: 'invalid-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-input')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('validation-error')).toBeInTheDocument();
}, 10000);
