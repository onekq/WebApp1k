import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './groupRegistrations_validateEventEndDate_validateTicketDiscounts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Group registrations are successfully supported', async () => {
  fetchMock.post('/register-group', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/group size/i), { target: { value: '5' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/group registration successful/i)).toBeInTheDocument();
}, 10000);

test('Group registration fails if exceeding max group size', async () => {
  fetchMock.post('/register-group', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/group size/i), { target: { value: '20' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/group size exceeds limit/i)).toBeInTheDocument();
}, 10000);

test('Should successfully submit valid event end date', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><EventForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2023-12-14T10:00' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for end date before start date', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><EventForm /></MemoryRouter>); });
  await act(async () => { 
    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2023-12-15T10:00' } }); 
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2023-12-14T10:00' } });
  });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument();
}, 10000);

test('applies ticket discount successfully', async () => {
  fetchMock.post('/applyDiscount', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discountCode'), { target: { value: 'DISCOUNT50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('applyDiscountButton')); });

  expect(fetchMock.calls('/applyDiscount').length).toEqual(1);
  expect(screen.getByText('Discount applied')).toBeInTheDocument();
}, 10000);

test('fails to apply ticket discount', async () => {
  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discountCode'), { target: { value: 'INVALIDCODE' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('applyDiscountButton')); });

  expect(screen.getByText('Invalid discount code.')).toBeInTheDocument();
}, 10000);
