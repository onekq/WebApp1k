import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './duplicateApplicationDetection_profileVisibilityControl_rateCandidates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successful duplicate application detection.', async () => {
  fetchMock.get('/checkDuplicate/123', { duplicate: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-duplicate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No Duplicate Application')).toBeInTheDocument();
}, 10000);

test('failure duplicate application detection.', async () => {
  fetchMock.get('/checkDuplicate/123', { duplicate: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-duplicate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Duplicate Application Found')).toBeInTheDocument();
}, 10000);

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

test('Employer can successfully rate a candidate.', async () => {
  fetchMock.post('/api/rate', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <RateCandidate />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Rate'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Candidate rated successfully')).toBeInTheDocument();
}, 10000);

test('Rating a candidate fails due to server error.', async () => {
  fetchMock.post('/api/rate', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <RateCandidate />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Rate'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to rate the candidate')).toBeInTheDocument();
}, 10000);
