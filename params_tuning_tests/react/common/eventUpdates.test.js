import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import EventApp from './eventUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays success message upon successful event updates', async () => {
  fetchMock.post('/api/event/update', { success: true });

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('event-title-input'), { target: { value: 'New Title' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event updated successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to update event', async () => {
  fetchMock.post('/api/event/update', 400);

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('event-title-input'), { target: { value: 'New Title' }}); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update the event')).toBeInTheDocument();
}, 10000);

