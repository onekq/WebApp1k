import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applicationWithLinkedIn_jobPostComments_jobSeekerProfiles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successful LinkedIn application.', async () => {
  fetchMock.post('/applyLinkedIn', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-linkedin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('LinkedIn Application Successful')).toBeInTheDocument();
}, 10000);

test('failure LinkedIn application.', async () => {
  fetchMock.post('/applyLinkedIn', 400);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-linkedin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Submit LinkedIn Application')).toBeInTheDocument();
}, 10000);

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

test('job seekers can successfully create and update their profiles', async () => {
  fetchMock.post('/api/jobseeker', { success: true });

  await act(async () => { render(<MemoryRouter><JobSeekerProfile /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Save/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if profile update fails', async () => {
  fetchMock.post('/api/jobseeker', 500);

  await act(async () => { render(<MemoryRouter><JobSeekerProfile /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Save/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update profile')).toBeInTheDocument();
}, 10000);
