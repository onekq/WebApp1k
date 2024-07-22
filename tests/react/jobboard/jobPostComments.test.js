import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import AddJobPostComment from './jobPostComments';

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

