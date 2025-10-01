import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './jobAlerts_profileCompletenessMeter_uploadResumes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('allows job seekers to set up alerts for new jobs successfully.', async () => {
  fetchMock.post('/api/jobAlerts', { id: 1, criteria: 'developer' });

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Set Alert'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Job alert set successfully.')).toBeInTheDocument();
}, 10000);

test('shows an error message when setting up alerts fails.', async () => {
  fetchMock.post('/api/jobAlerts', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Set Alert'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error setting job alert.')).toBeInTheDocument();
}, 10000);

test('completeness meter displays successfully on job seeker profiles', async () => {
  fetchMock.get('/api/jobseeker/completeness', { completeness: 80 });

  await act(async () => { render(<MemoryRouter><ProfileCompletenessMeter /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile completeness: 80%')).toBeInTheDocument();
}, 10000);

test('completeness meter fails to display on error', async () => {
  fetchMock.get('/api/jobseeker/completeness', 500);

  await act(async () => { render(<MemoryRouter><ProfileCompletenessMeter /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load completeness meter')).toBeInTheDocument();
}, 10000);

test('successful resume upload.', async () => {
  fetchMock.post('/uploadResume', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resume-upload-input'), { target: { files: ['resume.pdf'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Resume Uploaded Successfully')).toBeInTheDocument();
}, 10000);

test('failure resume upload.', async () => {
  fetchMock.post('/uploadResume', 400);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resume-upload-input'), { target: { files: ['resume.pdf'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Upload Resume')).toBeInTheDocument();
}, 10000);
