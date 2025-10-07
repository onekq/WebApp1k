import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyForJobs_jobPostCategories_interviewNotifications_salaryRangeSpecification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successful job application. (from applyForJobs_jobPostCategories)', async () => {
  fetchMock.post('/apply', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application Successful')).toBeInTheDocument();
}, 10000);

test('failure job application. (from applyForJobs_jobPostCategories)', async () => {
  fetchMock.post('/apply', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Apply')).toBeInTheDocument();
}, 10000);

test('Assigning job posts to predefined categories successfully (from applyForJobs_jobPostCategories)', async () => {
  fetchMock.post('/api/job', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'Engineering' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Assigning job posts failure due to invalid category (from applyForJobs_jobPostCategories)', async () => {
  fetchMock.post('/api/job', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'InvalidCategory' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Invalid category selected/i)).toBeInTheDocument();
}, 10000);

test('Candidate is successfully notified about the interview. (from interviewNotifications_salaryRangeSpecification)', async () => {
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

test('Notifying the candidate about the interview fails due to server error. (from interviewNotifications_salaryRangeSpecification)', async () => {
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

test('employers can successfully specify salary ranges in job posts (from interviewNotifications_salaryRangeSpecification)', async () => {
  fetchMock.post('/api/job', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Salary Range/i), { target: { value: '50k-70k' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Post Job/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Job posted successfully')).toBeInTheDocument();
}, 10000);

test('employers see an error message if specifying salary ranges fails (from interviewNotifications_salaryRangeSpecification)', async () => {
  fetchMock.post('/api/job', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Salary Range/i), { target: { value: '50k-70k' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Post Job/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to post job')).toBeInTheDocument();
}, 10000);

