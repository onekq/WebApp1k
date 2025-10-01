import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventUpdates_validateEventImageUpload_validateEventLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Displays success message upon successful event updates', async () => {
  fetchMock.post('/api/event/update', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('event-title-input'), { target: { value: 'New Title' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event updated successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to update event', async () => {
  fetchMock.post('/api/event/update', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('event-title-input'), { target: { value: 'New Title' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update the event')).toBeInTheDocument();
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

test('Should successfully submit valid event location', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/location/i), { target: { value: '123 Event St' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for missing event location', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/location/i), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/location is required/i)).toBeInTheDocument();
}, 10000);
