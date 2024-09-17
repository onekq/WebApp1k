import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './assignTagstoExpenses_trackIncomeByPaymentMethod';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('assigns tags to expenses successfully', async () => {
  fetchMock.post('/api/tag', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Groceries' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-tag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tag added successfully!')).toBeInTheDocument();
}, 10000);

test('fails to assign tags to expenses', async () => {
  fetchMock.post('/api/tag', { success: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('tag-input'), { target: { value: 'Groceries' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-tag-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error adding tag.')).toBeInTheDocument();
}, 10000);

test('successfully tracks income by payment method', async () => {
  fetchMock.get('/income/payment-method/credit-card', { status: 200, body: [{ id: 1, name: 'Salary' }] });

  await act(async () => {
    render(<MemoryRouter><App paymentMethod="credit-card" /></MemoryRouter>);
  });

  expect(fetchMock.calls('/income/payment-method/credit-card')).toHaveLength(1);
  expect(screen.getByText(/salary/i)).toBeInTheDocument();
}, 10000);

test('fails to track income by payment method', async () => {
  fetchMock.get('/income/payment-method/credit-card', { status: 400 });

  await act(async () => {
    render(<MemoryRouter><App paymentMethod="credit-card" /></MemoryRouter>);
  });

  expect(fetchMock.calls('/income/payment-method/credit-card')).toHaveLength(1);
  expect(screen.getByText(/failed to track income by payment method/i)).toBeInTheDocument();
}, 10000);