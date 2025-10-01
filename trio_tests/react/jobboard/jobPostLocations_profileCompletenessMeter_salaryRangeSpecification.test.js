import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './jobPostLocations_profileCompletenessMeter_salaryRangeSpecification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Specifying valid locations for job openings successfully', async () => {
  fetchMock.post('/api/job', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'San Francisco, CA' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Specifying locations failure due to invalid location', async () => {
  fetchMock.post('/api/job', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'InvalidLocation' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Invalid location specified/i)).toBeInTheDocument();
}, 10000);

test('completeness meter displays successfully on job seeker profiles', async () => {
  fetchMock.get('/api/jobseeker/completeness', { completeness: 80 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile completeness: 80%')).toBeInTheDocument();
}, 10000);

test('completeness meter fails to display on error', async () => {
  fetchMock.get('/api/jobseeker/completeness', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to load completeness meter')).toBeInTheDocument();
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
