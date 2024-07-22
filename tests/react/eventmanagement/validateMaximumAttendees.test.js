import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import EventForm from './validateMaximumAttendees';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully submit valid maximum attendees count', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><EventForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/maximum attendees/i), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for negative maximum attendees count', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><EventForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/maximum attendees/i), { target: { value: '-1' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/maximum attendees must be a positive number/i)).toBeInTheDocument();
}, 10000);

