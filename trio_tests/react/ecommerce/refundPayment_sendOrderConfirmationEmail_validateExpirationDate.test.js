import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './refundPayment_sendOrderConfirmationEmail_validateExpirationDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('refund payment successfully', async () => {
  fetchMock.post('/api/refund-payment', { success: true });

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refund-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Refund processed successfully')).toBeInTheDocument();
}, 10000);

test('fail to refund payment', async () => {
  fetchMock.post('/api/refund-payment', 500);

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refund-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Refund failed, please try again')).toBeInTheDocument();
}, 10000);

test('Sends order confirmation email successfully', async () => {
  fetchMock.post('/api/sendOrderConfirmationEmail', 200);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Confirmation Email')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Order confirmation email sent successfully')).toBeInTheDocument();
}, 10000);

test('Fails to send order confirmation email', async () => {
  fetchMock.post('/api/sendOrderConfirmationEmail', 500);

  await act(async () => { render(<MemoryRouter><Order /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Confirmation Email')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to send order confirmation email')).toBeInTheDocument();
}, 10000);

test('valid expiration date', async () => {
  fetchMock.post('/api/validate-expiration-date', { valid: true });

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expiration-date-input'), { target: { value: '12/25' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('invalid expiration date', async () => {
  fetchMock.post('/api/validate-expiration-date', 400);

  await act(async () => { render(<MemoryRouter><Payment /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('expiration-date-input'), { target: { value: '13/25' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('validate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid expiration date')).toBeInTheDocument();
}, 10000);
