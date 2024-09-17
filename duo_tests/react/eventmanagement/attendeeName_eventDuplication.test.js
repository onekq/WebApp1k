import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attendeeName_eventDuplication';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Attendee name is successfully validated and submitted', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Attendee name validation fails if left empty', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(0);
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
}, 10000);

test('Displays success message upon event duplication', async () => {
  fetchMock.post('/api/event/duplicate', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicate-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event duplicated successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to duplicate event', async () => {
  fetchMock.post('/api/event/duplicate', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicate-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to duplicate the event')).toBeInTheDocument();
}, 10000);