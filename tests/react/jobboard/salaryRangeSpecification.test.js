import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import JobPost from './salaryRangeSpecification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('employers can successfully specify salary ranges in job posts', async () => {
  fetchMock.post('/api/job', { success: true });

  await act(async () => { render(<MemoryRouter><JobPost /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Salary Range/i), { target: { value: '50k-70k' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Post Job/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Job posted successfully')).toBeInTheDocument();
}, 10000);

test('employers see an error message if specifying salary ranges fails', async () => {
  fetchMock.post('/api/job', 500);

  await act(async () => { render(<MemoryRouter><JobPost /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Salary Range/i), { target: { value: '50k-70k' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Post Job/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to post job')).toBeInTheDocument();
}, 10000);

