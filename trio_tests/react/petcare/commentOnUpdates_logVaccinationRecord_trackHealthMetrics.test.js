import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './commentOnUpdates_logVaccinationRecord_trackHealthMetrics';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully comments on a community update', async () => {
  fetchMock.post('/api/community/comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('comment-input'), { target: { value: 'Nice update!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment added successfully')).toBeInTheDocument();
}, 10000);

test('Fails to comment on a community update', async () => {
  fetchMock.post('/api/community/comment', { status: 400 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to add comment')).toBeInTheDocument();
}, 10000);

test('Log vaccination record successfully', async () => {
  fetchMock.post('/api/vaccinations', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('vaccine-input'), { target: { value: 'Rabies' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Vaccination record logged')).toBeInTheDocument();
}, 10000);

test('Fail to log vaccination record with error', async () => {
  fetchMock.post('/api/vaccinations', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('vaccine-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/vaccinations').length).toBe(1);
  expect(screen.getByText('Failed to log vaccination record')).toBeInTheDocument(); // Error message
}, 10000);

test('Track health metrics successfully', async () => {
  fetchMock.post('/api/health-metrics', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('weight-input'), { target: { value: '10.2' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-metrics').length).toBe(1);
  expect(screen.getByText('Health metrics recorded successfully')).toBeInTheDocument();
}, 10000);

test('Fail to track health metrics with error', async () => {
  fetchMock.post('/api/health-metrics', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('weight-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-metrics').length).toBe(1);
  expect(screen.getByText('Failed to record health metrics')).toBeInTheDocument(); // Error message
}, 10000);
