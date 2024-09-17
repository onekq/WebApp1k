import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventUpdates_validateAgendaUpdates';

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

test('Successfully validates agenda updates.', async () => {
  fetchMock.post('/api/validateAgendaUpdates', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-agenda-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Agenda updated')).toBeInTheDocument();
}, 10000);

test('Fails to validate agenda updates.', async () => {
  fetchMock.post('/api/validateAgendaUpdates', { error: 'Could not update agenda' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-agenda-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Could not update agenda')).toBeInTheDocument();
}, 10000);