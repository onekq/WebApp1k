import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import EventForm from './validateEventEndDate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Should successfully submit valid event end date', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><EventForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2023-12-14T10:00' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for end date before start date', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><EventForm /></MemoryRouter>); });
  await act(async () => { 
    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2023-12-15T10:00' } }); 
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2023-12-14T10:00' } });
  });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/end date must be after start date/i)).toBeInTheDocument();
}, 10000);

