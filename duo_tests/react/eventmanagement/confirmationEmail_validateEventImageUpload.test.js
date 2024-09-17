import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './confirmationEmail_validateEventImageUpload';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Confirmation email is successfully sent upon registration', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Confirmation email is not sent if registration fails', async () => {
  fetchMock.post('/register-attendee', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
}, 10000);

test('Should successfully upload a valid event image', async () => {
  fetchMock.post('/events/upload', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  const fileInput = screen.getByLabelText(/upload image/i);
  const file = new File(['image content'], 'event.png', { type: 'image/png' });

  await act(async () => { fireEvent.change(fileInput, { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for invalid event image upload', async () => {
  fetchMock.post('/events/upload', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  const fileInput = screen.getByLabelText(/upload image/i);
  const file = new File(['image content'], 'event.txt', { type: 'text/plain' });

  await act(async () => { fireEvent.change(fileInput, { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/invalid image file/i)).toBeInTheDocument();
}, 10000);