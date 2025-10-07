import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateTicketDescription_validateTicketDuplication_attendeePhoneNumber_validateTicketDiscounts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('ticket description within limit (from validateTicketDescription_validateTicketDuplication)', async () => {
  fetchMock.post('/ticketDescription', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketDescription'), { target: { value: 'A valid description' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(fetchMock.calls('/ticketDescription').length).toEqual(1);
  expect(screen.getByText('Ticket description set')).toBeInTheDocument();
}, 10000);

test('ticket description exceeds limit (from validateTicketDescription_validateTicketDuplication)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketDescription'), { target: { value: 'A'.repeat(300) } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submitButton')); });

  expect(screen.getByText('Description exceeds character limit.')).toBeInTheDocument();
}, 10000);

test('allows ticket duplication (from validateTicketDescription_validateTicketDuplication)', async () => {
  fetchMock.post('/duplicateTicket', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicateTicketButton')); });

  expect(fetchMock.calls('/duplicateTicket').length).toEqual(1);
  expect(screen.getByText('Ticket duplicated')).toBeInTheDocument();
}, 10000);

test('fails to duplicate ticket (from validateTicketDescription_validateTicketDuplication)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicateTicketButton')); });

  expect(screen.getByText('Unable to duplicate ticket.')).toBeInTheDocument();
}, 10000);

test('Attendee phone number is successfully validated if format is correct (from attendeePhoneNumber_validateTicketDiscounts)', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '123-456-7890' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Attendee phone number validation fails if format is incorrect (from attendeePhoneNumber_validateTicketDiscounts)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(0);
  expect(screen.getByText(/invalid phone number format/i)).toBeInTheDocument();
}, 10000);

test('applies ticket discount successfully (from attendeePhoneNumber_validateTicketDiscounts)', async () => {
  fetchMock.post('/applyDiscount', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discountCode'), { target: { value: 'DISCOUNT50' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('applyDiscountButton')); });

  expect(fetchMock.calls('/applyDiscount').length).toEqual(1);
  expect(screen.getByText('Discount applied')).toBeInTheDocument();
}, 10000);

test('fails to apply ticket discount (from attendeePhoneNumber_validateTicketDiscounts)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('discountCode'), { target: { value: 'INVALIDCODE' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('applyDiscountButton')); });

  expect(screen.getByText('Invalid discount code.')).toBeInTheDocument();
}, 10000);

