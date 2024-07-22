import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import JobPostRating from './jobPostRatings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('job seekers can rate job posts successfully', async () => {
  fetchMock.post('/api/job/rate', { success: true });

  await act(async () => { render(<MemoryRouter><JobPostRating /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Rating/i), { target: { value: 4 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Submit Rating/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Rating submitted successfully')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if rating submission fails', async () => {
  fetchMock.post('/api/job/rate', 500);

  await act(async () => { render(<MemoryRouter><JobPostRating /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Rating/i), { target: { value: 4 } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Submit Rating/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to submit rating')).toBeInTheDocument();
}, 10000);

