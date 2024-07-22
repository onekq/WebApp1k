import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import EmailNotifications from './emailNotifications';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully sends email notifications for ticket updates.', async () => {
  fetchMock.post('/api/sendEmail', 200);

  await act(async () => { render(<MemoryRouter><EmailNotifications /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Notification')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Notification sent')).toBeInTheDocument();
}, 10000);

test('Fails to send email notifications for ticket updates.', async () => {
  fetchMock.post('/api/sendEmail', 500);

  await act(async () => { render(<MemoryRouter><EmailNotifications /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketId'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Notification')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send notification')).toBeInTheDocument();
}, 10000);

