import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventDuplication_eventUpdates_validateEventCategory';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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
