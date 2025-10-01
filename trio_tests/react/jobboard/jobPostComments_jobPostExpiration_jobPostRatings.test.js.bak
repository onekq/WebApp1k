import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './jobPostComments_jobPostExpiration_jobPostRatings';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Employer can successfully add a comment to a job post.', async () => {
  fetchMock.post('/api/comments', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <AddJobPostComment />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Add comment'), { target: { value: 'Great candidate!' } });
    fireEvent.click(screen.getByText('Add Comment'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment added successfully')).toBeInTheDocument();
}, 10000);

test('Adding a comment to a job post fails due to server error.', async () => {
  fetchMock.post('/api/comments', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <AddJobPostComment />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Add comment'), { target: { value: 'Great candidate!' } });
    fireEvent.click(screen.getByText('Add Comment'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add comment')).toBeInTheDocument();
}, 10000);

test('Automatically expiring job posts after a set period successfully', async () => {
  fetchMock.post('/api/job', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><JobPostingComponent /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Expiration Date/i), { target: { value: '2023-12-31' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Automatically expiring job posts failure due to invalid date', async () => {
  fetchMock.post('/api/job', 400);

  await act(async () => {
    render(<MemoryRouter><JobPostingComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Expiration Date/i), { target: { value: '2023-02-31' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Invalid expiration date/i)).toBeInTheDocument();
}, 10000);

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
