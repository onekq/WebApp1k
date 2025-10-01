import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './jobPostExpiration_postNewJob_salaryRangeSpecification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Automatically expiring job posts after a set period successfully', async () => {
  fetchMock.post('/api/job', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Expiration Date/i), { target: { value: '2023-12-31' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Automatically expiring job posts failure due to invalid date', async () => {
  fetchMock.post('/api/job', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Expiration Date/i), { target: { value: '2023-02-31' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Invalid expiration date/i)).toBeInTheDocument();
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

test('employers can successfully specify salary ranges in job posts', async () => {
  fetchMock.post('/api/job', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Salary Range/i), { target: { value: '50k-70k' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Post Job/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Job posted successfully')).toBeInTheDocument();
}, 10000);

test('employers see an error message if specifying salary ranges fails', async () => {
  fetchMock.post('/api/job', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Salary Range/i), { target: { value: '50k-70k' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Post Job/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to post job')).toBeInTheDocument();
}, 10000);
