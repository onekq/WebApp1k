import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sponsorDisplay_validateEventTags_confirmationEmail_validateEventImageUpload';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays sponsors and partners on event pages (from sponsorDisplay_validateEventTags)', async () => {
  fetchMock.get('/api/event/sponsors', { sponsors: ['Sponsor 1', 'Sponsor 2'], partners: ['Partner 1'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Sponsor 1')).toBeInTheDocument();
  expect(screen.getByText('Partner 1')).toBeInTheDocument();
}, 10000);

test('Displays error message when sponsors and partners are unavailable (from sponsorDisplay_validateEventTags)', async () => {
  fetchMock.get('/api/event/sponsors', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Sponsors and partners are unavailable')).toBeInTheDocument();
}, 10000);

test('Should successfully add valid event tags (from sponsorDisplay_validateEventTags)', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'tech, conference' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for invalid event tag characters (from sponsorDisplay_validateEventTags)', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/tags/i), { target: { value: 'tech, con*ference' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/invalid characters in tags/i)).toBeInTheDocument();
}, 10000);

test('Confirmation email is successfully sent upon registration (from confirmationEmail_validateEventImageUpload)', async () => {
  fetchMock.post('/register-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
}, 10000);

test('Confirmation email is not sent if registration fails (from confirmationEmail_validateEventImageUpload)', async () => {
  fetchMock.post('/register-attendee', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
}, 10000);

test('Should successfully upload a valid event image (from confirmationEmail_validateEventImageUpload)', async () => {
  fetchMock.post('/events/upload', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  const fileInput = screen.getByLabelText(/upload image/i);
  const file = new File(['image content'], 'event.png', { type: 'image/png' });

  await act(async () => { fireEvent.change(fileInput, { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for invalid event image upload (from confirmationEmail_validateEventImageUpload)', async () => {
  fetchMock.post('/events/upload', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  const fileInput = screen.getByLabelText(/upload image/i);
  const file = new File(['image content'], 'event.txt', { type: 'text/plain' });

  await act(async () => { fireEvent.change(fileInput, { target: { files: [file] } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/invalid image file/i)).toBeInTheDocument();
}, 10000);

