import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateFlightDetails_validateUserInput';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('ValidateFlightDetails - validate flight details successfully', async () => {
  fetchMock.post('/api/validate-flight', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Flight Details')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Flight details are valid')).toBeInTheDocument();
}, 10000);

test('ValidateFlightDetails - validate flight details fails with error message', async () => {
  fetchMock.post('/api/validate-flight', { valid: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Validate Flight Details')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Flight details are not valid')).toBeInTheDocument();
}, 10000);

test('User input data should be validated successfully.', async () => {
  fetchMock.post('/api/user/validate', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('input-data'), { target: { value: 'valid-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-input')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('validation-success')).toBeInTheDocument();
}, 10000);

test('Error in user input data validation should show error message.', async () => {
  fetchMock.post('/api/user/validate', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('input-data'), { target: { value: 'invalid-data' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-input')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('validation-error')).toBeInTheDocument();
}, 10000);