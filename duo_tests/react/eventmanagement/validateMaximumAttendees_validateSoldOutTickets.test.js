import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateMaximumAttendees_validateSoldOutTickets';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully submit valid maximum attendees count', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/maximum attendees/i), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for negative maximum attendees count', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/maximum attendees/i), { target: { value: '-1' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/maximum attendees must be a positive number/i)).toBeInTheDocument();
}, 10000);

test('marks tickets as sold out', async () => {
  fetchMock.post('/markSoldOut', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('markSoldOutButton')); });

  expect(fetchMock.calls('/markSoldOut').length).toEqual(1);
  expect(screen.getByText('Tickets marked as sold out')).toBeInTheDocument();
}, 10000);

test('fails to mark tickets as sold out', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('markSoldOutButton')); });

  expect(screen.getByText('Unable to mark tickets as sold out.')).toBeInTheDocument();
}, 10000);