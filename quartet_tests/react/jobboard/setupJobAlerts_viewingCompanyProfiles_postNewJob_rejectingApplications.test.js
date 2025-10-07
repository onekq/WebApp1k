import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './setupJobAlerts_viewingCompanyProfiles_postNewJob_rejectingApplications';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('job seekers can successfully set up alerts for new jobs matching their criteria (from setupJobAlerts_viewingCompanyProfiles)', async () => {
  fetchMock.post('/api/job/alerts', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Keyword/i), { target: { value: 'React Developer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Alert/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Alert set successfully')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if alert setup fails (from setupJobAlerts_viewingCompanyProfiles)', async () => {
  fetchMock.post('/api/job/alerts', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Keyword/i), { target: { value: 'React Developer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Set Alert/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to set alert')).toBeInTheDocument();
}, 10000);

test('job seekers can successfully view company profiles (from setupJobAlerts_viewingCompanyProfiles)', async () => {
  fetchMock.get('/api/company/1', { name: 'TechCorp', bio: 'A tech company' });

  await act(async () => { render(<MemoryRouter><App companyId="1" /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('TechCorp')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if company profile fails to load (from setupJobAlerts_viewingCompanyProfiles)', async () => {
  fetchMock.get('/api/company/1', 404);

  await act(async () => { render(<MemoryRouter><App companyId="1" /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Error loading company profile')).toBeInTheDocument();
}, 10000);

test('Posting a new job successfully (from postNewJob_rejectingApplications)', async () => {
  fetchMock.post('/api/job', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Posting a new job failure due to missing fields (from postNewJob_rejectingApplications)', async () => {
  fetchMock.post('/api/job', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Please fill out all required fields/i)).toBeInTheDocument();
}, 10000);

test('Employer can successfully reject an application. (from postNewJob_rejectingApplications)', async () => {
  fetchMock.post('/api/reject', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <RejectApplication />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Reject'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application rejected successfully')).toBeInTheDocument();
}, 10000);

test('Rejecting an application fails due to server error. (from postNewJob_rejectingApplications)', async () => {
  fetchMock.post('/api/reject', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <RejectApplication />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Reject'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to reject the application')).toBeInTheDocument();
}, 10000);

