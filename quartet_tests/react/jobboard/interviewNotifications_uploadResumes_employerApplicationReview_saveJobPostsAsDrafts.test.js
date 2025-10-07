import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './interviewNotifications_uploadResumes_employerApplicationReview_saveJobPostsAsDrafts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Candidate is successfully notified about the interview. (from interviewNotifications_uploadResumes)', async () => {
  fetchMock.post('/api/notify', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <InterviewNotification />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Notify'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Candidate notified successfully')).toBeInTheDocument();
}, 10000);

test('Notifying the candidate about the interview fails due to server error. (from interviewNotifications_uploadResumes)', async () => {
  fetchMock.post('/api/notify', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <InterviewNotification />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Notify'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to notify the candidate')).toBeInTheDocument();
}, 10000);

test('successful resume upload. (from interviewNotifications_uploadResumes)', async () => {
  fetchMock.post('/uploadResume', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resume-upload-input'), { target: { files: ['resume.pdf'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Resume Uploaded Successfully')).toBeInTheDocument();
}, 10000);

test('failure resume upload. (from interviewNotifications_uploadResumes)', async () => {
  fetchMock.post('/uploadResume', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resume-upload-input'), { target: { files: ['resume.pdf'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Upload Resume')).toBeInTheDocument();
}, 10000);

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

