import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './anonymousApplications_applicationStatusTracking';

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

test('successful application status tracking.', async () => {
  fetchMock.get('/status/123', { status: 'In Progress' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('status-check-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-status-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Status: In Progress')).toBeInTheDocument();
}, 10000);

test('failure application status tracking.', async () => {
  fetchMock.get('/status/123', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('status-check-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('check-status-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Status not found')).toBeInTheDocument();
}, 10000);