import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './applyForJobs_profileVisibilityControl';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successful job application.', async () => {
  fetchMock.post('/apply', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application Successful')).toBeInTheDocument();
}, 10000);

test('failure job application.', async () => {
  fetchMock.post('/apply', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('apply-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Apply')).toBeInTheDocument();
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