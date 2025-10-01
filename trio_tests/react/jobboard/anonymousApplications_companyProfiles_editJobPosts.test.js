import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './anonymousApplications_companyProfiles_editJobPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successful anonymous application submission.', async () => {
  fetchMock.post('/applyAnonymous', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-anonymous-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Anonymous Application Successful')).toBeInTheDocument();
}, 10000);

test('failure anonymous application submission.', async () => {
  fetchMock.post('/applyAnonymous', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-anonymous-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Submit Anonymous Application')).toBeInTheDocument();
}, 10000);

test('employers can successfully create and update company profiles', async () => {
  fetchMock.post('/api/company', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'TechCorp' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Save/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
}, 10000);

test('employers see an error message if profile creation fails', async () => {
  fetchMock.post('/api/company', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'TechCorp' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Save/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update profile')).toBeInTheDocument();
}, 10000);

test('Editing an existing job post successfully', async () => {
  fetchMock.put('/api/job/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Senior Software Engineer' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Save/i));
  });

  expect(fetchMock.calls('/api/job/1')).toHaveLength(1);
  expect(screen.getByText(/Job updated successfully!/i)).toBeInTheDocument();
}, 10000);

test('Editing an existing job post failure due to network error', async () => {
  fetchMock.put('/api/job/1', 500);

  await act(async () => {
    render(<MemoryRouter><App id="1" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Senior Software Engineer' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Save/i));
  });

  expect(fetchMock.calls('/api/job/1')).toHaveLength(1);
  expect(screen.getByText(/Failed to update job post/i)).toBeInTheDocument();
}, 10000);
