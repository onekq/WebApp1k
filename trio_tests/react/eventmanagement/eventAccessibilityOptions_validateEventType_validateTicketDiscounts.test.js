import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventAccessibilityOptions_validateEventType_validateTicketDiscounts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Displays event accessibility options', async () => {
  fetchMock.get('/api/event/accessibility', { wheelchairAccess: true, signLanguageInterpreter: true });

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Wheelchair access')).toBeInTheDocument();
  expect(screen.getByText('Sign language interpreter')).toBeInTheDocument();
}, 10000);

test('Displays error message when accessibility options are unavailable', async () => {
  fetchMock.get('/api/event/accessibility', 404);

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Accessibility options are unavailable')).toBeInTheDocument();
}, 10000);

test('Should successfully submit event with valid type', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><EventForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/type/i), { target: { value: 'Conference' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for not selecting event type', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><EventForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/type/i), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/event type is required/i)).toBeInTheDocument();
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
