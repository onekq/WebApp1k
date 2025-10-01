import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './bulkEnrollment_certificateGeneration_progressReportGeneration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Bulk enrollment is successful for organizations.', async () => {
  fetchMock.post('/api/bulk-enroll', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Organization ID/i), { target: { value: 'org123' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Bulk Enroll/i)); });

  expect(fetchMock.calls('/api/bulk-enroll').length).toEqual(1);
  expect(screen.getByText(/Bulk enrollment successful/i)).toBeInTheDocument();
}, 10000);

test('Bulk enrollment fails if the server returns an error.', async () => {
  fetchMock.post('/api/bulk-enroll', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Organization ID/i), { target: { value: 'org123' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Bulk Enroll/i)); });

  expect(fetchMock.calls('/api/bulk-enroll').length).toEqual(1);
  expect(screen.getByText(/Failed to enroll users in bulk/i)).toBeInTheDocument();
}, 10000);

test('Certificate is generated upon course completion.', async () => {
  fetchMock.post('/api/course/complete', { certificateUrl: '/certificates/1' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/complete course/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/download certificate/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when certificate generation fails.', async () => {
  fetchMock.post('/api/course/complete', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/complete course/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to generate certificate/i)).toBeInTheDocument();
}, 10000);

test('Progress report can be generated successfully.', async () => {
  fetchMock.get('/api/progress-report', { report: 'Mock Report' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Generate Progress Report/i)); });

  expect(fetchMock.calls('/api/progress-report').length).toEqual(1);
  expect(screen.getByText(/Mock Report/i)).toBeInTheDocument();
}, 10000);

test('Progress report generation fails if the server returns an error.', async () => {
  fetchMock.get('/api/progress-report', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Generate Progress Report/i)); });

  expect(fetchMock.calls('/api/progress-report').length).toEqual(1);
  expect(screen.getByText(/Failed to generate progress report/i)).toBeInTheDocument();
}, 10000);
