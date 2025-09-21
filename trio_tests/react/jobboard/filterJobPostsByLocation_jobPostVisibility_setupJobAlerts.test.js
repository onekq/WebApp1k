import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterJobPostsByLocation_jobPostVisibility_setupJobAlerts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('allows job seekers to filter job posts by location successfully.', async () => {
  fetchMock.get('/api/jobPosts?location=New%20York', [{ id: 1, title: 'Project Manager' }]);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'New York' } });
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Project Manager')).toBeInTheDocument();
}, 10000);

test('shows an error message when filtering by location fails.', async () => {
  fetchMock.get('/api/jobPosts?location=New%20York', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'New York' } });
    fireEvent.click(screen.getByText('Filter'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error filtering job posts.')).toBeInTheDocument();
}, 10000);

test('Controlling job post visibility successfully', async () => {
  fetchMock.post('/api/job', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><JobPostingComponent /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Visibility/i), { target: { value: 'Public' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Controlling job post visibility failure due to invalid visibility state', async () => {
  fetchMock.post('/api/job', 400);

  await act(async () => {
    render(<MemoryRouter><JobPostingComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Visibility/i), { target: { value: 'InvalidVisibility' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Invalid visibility option/i)).toBeInTheDocument();
}, 10000);

test('job seekers can successfully set up alerts for new jobs matching their criteria', async () => {
  fetchMock.post('/api/job/alerts', { success: true });

  await act(async () => { render(<MemoryRouter><JobAlerts /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Keyword/i), { target: { value: 'React Developer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Alert/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Alert set successfully')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if alert setup fails', async () => {
  fetchMock.post('/api/job/alerts', 500);

  await act(async () => { render(<MemoryRouter><JobAlerts /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Keyword/i), { target: { value: 'React Developer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Alert/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set alert')).toBeInTheDocument();
}, 10000);
