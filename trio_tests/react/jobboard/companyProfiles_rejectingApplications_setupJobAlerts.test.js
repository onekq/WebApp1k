import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './companyProfiles_rejectingApplications_setupJobAlerts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('employers can successfully create and update company profiles', async () => {
  fetchMock.post('/api/company', { success: true });

  await act(async () => { render(<MemoryRouter><CompanyProfile /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'TechCorp' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Save/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
}, 10000);

test('employers see an error message if profile creation fails', async () => {
  fetchMock.post('/api/company', 500);

  await act(async () => { render(<MemoryRouter><CompanyProfile /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'TechCorp' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Save/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update profile')).toBeInTheDocument();
}, 10000);

test('Employer can successfully reject an application.', async () => {
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

test('Rejecting an application fails due to server error.', async () => {
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
