import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './attendeeDetailUpdate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Attendee details are successfully updated', async () => {
  fetchMock.put('/update-attendee', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/update/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/update successful/i)).toBeInTheDocument();
}, 10000);

test('Attendee detail update fails if no changes detected', async () => {
  fetchMock.put('/update-attendee', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/update/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/no changes detected/i)).toBeInTheDocument();
}, 10000);

