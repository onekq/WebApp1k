import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import JobPostingComponent from './jobPostValidation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Validating all fields before posting a job successfully', async () => {
  fetchMock.post('/api/job', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><JobPostingComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Develop software' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Validating all fields failure due to empty fields', async () => {
  fetchMock.post('/api/job', 400);

  await act(async () => {
    render(<MemoryRouter><JobPostingComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Please fill out all required fields/i)).toBeInTheDocument();
}, 10000);
