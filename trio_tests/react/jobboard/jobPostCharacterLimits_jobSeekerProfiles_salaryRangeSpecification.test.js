import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './jobPostCharacterLimits_jobSeekerProfiles_salaryRangeSpecification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Validating character limits on job description and title successfully', async () => {
  fetchMock.post('/api/job', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><JobPostingComponent /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A'.repeat(300) } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Validating character limits failure due to exceeding limit', async () => {
  fetchMock.post('/api/job', 400);

  await act(async () => {
    render(<MemoryRouter><JobPostingComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'A'.repeat(1001) } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Description exceeds character limit/i)).toBeInTheDocument();
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

test('employers can successfully specify salary ranges in job posts', async () => {
  fetchMock.post('/api/job', { success: true });

  await act(async () => { render(<MemoryRouter><JobPost /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Salary Range/i), { target: { value: '50k-70k' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Post Job/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Job posted successfully')).toBeInTheDocument();
}, 10000);

test('employers see an error message if specifying salary ranges fails', async () => {
  fetchMock.post('/api/job', 500);

  await act(async () => { render(<MemoryRouter><JobPost /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Salary Range/i), { target: { value: '50k-70k' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Post Job/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to post job')).toBeInTheDocument();
}, 10000);
