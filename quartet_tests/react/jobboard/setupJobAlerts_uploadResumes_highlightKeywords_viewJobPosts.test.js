import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setupJobAlerts_uploadResumes_highlightKeywords_viewJobPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('job seekers can successfully set up alerts for new jobs matching their criteria (from setupJobAlerts_uploadResumes)', async () => {
  fetchMock.post('/api/job/alerts', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Keyword/i), { target: { value: 'React Developer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Alert/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Alert set successfully')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if alert setup fails (from setupJobAlerts_uploadResumes)', async () => {
  fetchMock.post('/api/job/alerts', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Keyword/i), { target: { value: 'React Developer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Alert/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set alert')).toBeInTheDocument();
}, 10000);

test('successful resume upload. (from setupJobAlerts_uploadResumes)', async () => {
  fetchMock.post('/uploadResume', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resume-upload-input'), { target: { files: ['resume.pdf'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Resume Uploaded Successfully')).toBeInTheDocument();
}, 10000);

test('failure resume upload. (from setupJobAlerts_uploadResumes)', async () => {
  fetchMock.post('/uploadResume', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resume-upload-input'), { target: { files: ['resume.pdf'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Upload Resume')).toBeInTheDocument();
}, 10000);

test('highlights keywords in job descriptions during search successfully. (from highlightKeywords_viewJobPosts)', async () => {
  fetchMock.get('/api/jobPosts?search=developer', [{ id: 1, title: 'Frontend Developer', description: 'Great developer' }]);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Great developer')).toBeInTheDocument();
}, 10000);

test('shows an error message when keyword highlighting fails. (from highlightKeywords_viewJobPosts)', async () => {
  fetchMock.get('/api/jobPosts?search=developer', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error highlighting keywords.')).toBeInTheDocument();
}, 10000);

test('allows job seekers to view detailed job posts successfully. (from highlightKeywords_viewJobPosts)', async () => {
  fetchMock.get('/api/jobPosts/123', { id: 123, title: 'Software Engineer' });

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage jobId="123" />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Software Engineer')).toBeInTheDocument();
}, 10000);

test('shows an error when job posts cannot be viewed. (from highlightKeywords_viewJobPosts)', async () => {
  fetchMock.get('/api/jobPosts/123', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage jobId="123" />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading job post.')).toBeInTheDocument();
}, 10000);

