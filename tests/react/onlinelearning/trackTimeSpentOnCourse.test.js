import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import LMSComponent from './trackTimeSpentOnCourse';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Time spent on course content is recorded successfully.', async () => {
  fetchMock.get('/api/time-spent/101', { timeSpent: '5 hours' });

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Time Spent/i)); });

  expect(fetchMock.calls('/api/time-spent/101').length).toEqual(1);
  expect(screen.getByText(/Time Spent: 5 hours/i)).toBeInTheDocument();
}, 10000);

test('Time spent on course content tracking fails if the server returns an error.', async () => {
  fetchMock.get('/api/time-spent/101', 500);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Time Spent/i)); });

  expect(fetchMock.calls('/api/time-spent/101').length).toEqual(1);
  expect(screen.getByText(/Failed to track time spent/i)).toBeInTheDocument();
}, 10000);

