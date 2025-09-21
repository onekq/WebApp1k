import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './duplicateApplicationDetection_highlightKeywords_profileCompletenessMeter';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successful duplicate application detection.', async () => {
  fetchMock.get('/checkDuplicate/123', { duplicate: false });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-duplicate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No Duplicate Application')).toBeInTheDocument();
}, 10000);

test('failure duplicate application detection.', async () => {
  fetchMock.get('/checkDuplicate/123', { duplicate: true });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-duplicate-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Duplicate Application Found')).toBeInTheDocument();
}, 10000);

test('highlights keywords in job descriptions during search successfully.', async () => {
  fetchMock.get('/api/jobPosts?search=developer', [{ id: 1, title: 'Frontend Developer', description: 'Great developer' }]);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Great developer')).toBeInTheDocument();
}, 10000);

test('shows an error message when keyword highlighting fails.', async () => {
  fetchMock.get('/api/jobPosts?search=developer', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <JobListingPage />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'developer' } });
    fireEvent.click(screen.getByText('Search'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error highlighting keywords.')).toBeInTheDocument();
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
