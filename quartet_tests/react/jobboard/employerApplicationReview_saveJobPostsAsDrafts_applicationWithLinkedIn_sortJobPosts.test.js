import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './employerApplicationReview_saveJobPostsAsDrafts_applicationWithLinkedIn_sortJobPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Employer can successfully review applications. (from employerApplicationReview_saveJobPostsAsDrafts)', async () => {
  fetchMock.get('/api/applications', { applications: [{ id: 1, name: 'John Doe' }] });

  await act(async () => {
    render(
      <MemoryRouter>
        <ApplicationReview />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
}, 10000);

test('Review application fails due to server error. (from employerApplicationReview_saveJobPostsAsDrafts)', async () => {
  fetchMock.get('/api/applications', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <ApplicationReview />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load applications')).toBeInTheDocument();
}, 10000);

test('Saving job posts as drafts successfully (from employerApplicationReview_saveJobPostsAsDrafts)', async () => {
  fetchMock.post('/api/job/draft', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Save as Draft/i));
  });

  expect(fetchMock.calls('/api/job/draft')).toHaveLength(1);
  expect(screen.getByText(/Job saved as draft successfully!/i)).toBeInTheDocument();
}, 10000);

test('Saving job posts as drafts failure due to network error (from employerApplicationReview_saveJobPostsAsDrafts)', async () => {
  fetchMock.post('/api/job/draft', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Save as Draft/i));
  });

  expect(fetchMock.calls('/api/job/draft')).toHaveLength(1);
  expect(screen.getByText(/Failed to save job as draft/i)).toBeInTheDocument();
}, 10000);

test('successful LinkedIn application. (from applicationWithLinkedIn_sortJobPosts)', async () => {
  fetchMock.post('/applyLinkedIn', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-linkedin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('LinkedIn Application Successful')).toBeInTheDocument();
}, 10000);

test('failure LinkedIn application. (from applicationWithLinkedIn_sortJobPosts)', async () => {
  fetchMock.post('/applyLinkedIn', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-linkedin-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Submit LinkedIn Application')).toBeInTheDocument();
}, 10000);

test('allows job seekers to sort job posts by date successfully. (from applicationWithLinkedIn_sortJobPosts)', async () => {
  fetchMock.get('/api/jobPosts?sort=date', [{ id: 1, title: 'QA Engineer' }]);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: 'date' } });
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('QA Engineer')).toBeInTheDocument();
}, 10000);

test('shows an error message when sorting job posts fails. (from applicationWithLinkedIn_sortJobPosts)', async () => {
  fetchMock.get('/api/jobPosts?sort=date', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: 'date' } });
    fireEvent.click(screen.getByText('Sort'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error sorting job posts.')).toBeInTheDocument();
}, 10000);

