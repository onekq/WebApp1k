import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './employerVerification_jobSeekerProfiles_postNewJob';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('employers can be successfully verified before allowing job postings', async () => {
  fetchMock.post('/api/employer/verify', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Verify Employer/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Employer verified successfully')).toBeInTheDocument();
}, 10000);

test('employers see an error message if verification fails', async () => {
  fetchMock.post('/api/employer/verify', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Verify Employer/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to verify employer')).toBeInTheDocument();
}, 10000);

test('job seekers can successfully create and update their profiles', async () => {
  fetchMock.post('/api/jobseeker', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Save/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if profile update fails', async () => {
  fetchMock.post('/api/jobseeker', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Save/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update profile')).toBeInTheDocument();
}, 10000);

test('Posting a new job successfully', async () => {
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

test('Posting a new job failure due to missing fields', async () => {
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
