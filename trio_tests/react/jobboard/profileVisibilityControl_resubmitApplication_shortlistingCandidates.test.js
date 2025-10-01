import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './profileVisibilityControl_resubmitApplication_shortlistingCandidates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('job seekers can successfully control the visibility of their profiles', async () => {
  fetchMock.post('/api/jobseeker/visibility', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Make Profile Public/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile visibility updated')).toBeInTheDocument();
}, 10000);

test('job seekers see an error message if visibility control fails', async () => {
  fetchMock.post('/api/jobseeker/visibility', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Make Profile Public/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to update profile visibility')).toBeInTheDocument();
}, 10000);

test('successful application resubmission.', async () => {
  fetchMock.post('/resubmitApplication', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('resubmit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application Resubmitted Successfully')).toBeInTheDocument();
}, 10000);

test('failure application resubmission.', async () => {
  fetchMock.post('/resubmitApplication', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('resubmit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Resubmit Application')).toBeInTheDocument();
}, 10000);

test('Employer can successfully shortlist a candidate.', async () => {
  fetchMock.post('/api/shortlist', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <ShortlistCandidate />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Shortlist'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Candidate shortlisted successfully')).toBeInTheDocument();
}, 10000);

test('Shortlisting a candidate fails due to server error.', async () => {
  fetchMock.post('/api/shortlist', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <ShortlistCandidate />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Shortlist'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to shortlist the candidate')).toBeInTheDocument();
}, 10000);
