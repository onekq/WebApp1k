import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateEventCategory_validateSessionReminders';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully submit event with valid category', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Music' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for not selecting event category', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/category/i), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/event category is required/i)).toBeInTheDocument();
}, 10000);

test('Successfully validates session reminders.', async () => {
  fetchMock.post('/api/validateSessionReminders', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-reminders-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reminders set')).toBeInTheDocument();
}, 10000);

test('Fails to validate session reminders.', async () => {
  fetchMock.post('/api/validateSessionReminders', { error: 'Failed to set reminders' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-reminders-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to set reminders')).toBeInTheDocument();
}, 10000);