import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './handleBookingModifications_userPreferences';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Booking should be modified successfully for valid request.', async () => {
  fetchMock.put('/api/booking/modify', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('booking-id'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('modify-booking')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('modification-success')).toBeInTheDocument();
}, 10000);

test('Error in booking modification should show error message.', async () => {
  fetchMock.put('/api/booking/modify', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('booking-id'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('modify-booking')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('modification-error')).toBeInTheDocument();
}, 10000);

test('User preferences should be stored and applied successfully.', async () => {
  fetchMock.post('/api/user/preferences', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('preference-input'), { target: { value: 'preference' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('preference-saved')).toBeInTheDocument();
}, 10000);

test('Error in storing user preferences should show error message.', async () => {
  fetchMock.post('/api/user/preferences', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('preference-input'), { target: { value: 'preference' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('preference-error')).toBeInTheDocument();
}, 10000);