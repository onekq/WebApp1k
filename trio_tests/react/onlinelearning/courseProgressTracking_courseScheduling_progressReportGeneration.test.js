import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseProgressTracking_courseScheduling_progressReportGeneration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('The system correctly tracks course progress.', async () => {
  fetchMock.get('/api/course-progress/101', { progress: 50 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Progress/i)); });

  expect(fetchMock.calls('/api/course-progress/101').length).toEqual(1);
  expect(screen.getByText(/Progress: 50%/i)).toBeInTheDocument();
}, 10000);

test('Course progress tracking fails with an error response from the server.', async () => {
  fetchMock.get('/api/course-progress/101', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Progress/i)); });

  expect(fetchMock.calls('/api/course-progress/101').length).toEqual(1);
  expect(screen.getByText(/Failed to load progress/i)).toBeInTheDocument();
}, 10000);

test('Course Scheduling success: should display scheduled courses.', async () => {
  fetchMock.post('/api/schedule-course', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Course ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course successfully scheduled.')).toBeInTheDocument();
}, 10000);

test('Course Scheduling failure: should display an error message on schedule failure.', async () => {
  fetchMock.post('/api/schedule-course', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Course ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Schedule')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to schedule course.')).toBeInTheDocument();
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
