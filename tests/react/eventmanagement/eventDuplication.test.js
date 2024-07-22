import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import EventApp from './eventDuplication';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays success message upon event duplication', async () => {
  fetchMock.post('/api/event/duplicate', { success: true });

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicate-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Event duplicated successfully')).toBeInTheDocument();
}, 10000);

test('Displays error message upon failing to duplicate event', async () => {
  fetchMock.post('/api/event/duplicate', 400);

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('duplicate-event-btn')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to duplicate the event')).toBeInTheDocument();
}, 10000);

