import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './employerApp_saveJobPostsAsDrafts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Employer can successfully review applications.', async () => {
  fetchMock.get('/api/applications', { applications: [{ id: 1, name: 'John Doe' }] });

  await act(async () => {
    render(
      <MemoryRouter>
        <ApplicationReview />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
}, 10000);

test('Review application fails due to server error.', async () => {
  fetchMock.get('/api/applications', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <ApplicationReview />
      </MemoryRouter>
    );
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load applications')).toBeInTheDocument();
}, 10000);

test('Saving job posts as drafts successfully', async () => {
  fetchMock.post('/api/job/draft', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Save as Draft/i));
  });

  expect(fetchMock.calls('/api/job/draft')).toHaveLength(1);
  expect(screen.getByText(/Job saved as draft successfully!/i)).toBeInTheDocument();
}, 10000);

test('Saving job posts as drafts failure due to network error', async () => {
  fetchMock.post('/api/job/draft', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Save as Draft/i));
  });

  expect(fetchMock.calls('/api/job/draft')).toHaveLength(1);
  expect(screen.getByText(/Failed to save job as draft/i)).toBeInTheDocument();
}, 10000);