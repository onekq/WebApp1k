import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import EventForm from './validateEventLocation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully submit valid event location', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><EventForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/location/i), { target: { value: '123 Event St' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for missing event location', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><EventForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/location/i), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/location is required/i)).toBeInTheDocument();
}, 10000);

