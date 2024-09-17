import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterCourses_progressReportGeneration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter Courses success: should display filtered courses.', async () => {
  fetchMock.get('/api/courses?filter=beginner', [{ id: 1, title: 'Beginner Course' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('course-filter'), { target: { value: 'beginner' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Filters')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Beginner Course')).toBeInTheDocument();
}, 10000);

test('Filter Courses failure: should display an error message if no filter results.', async () => {
  fetchMock.get('/api/courses?filter=advanced', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('course-filter'), { target: { value: 'advanced' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Filters')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No courses found for this filter.')).toBeInTheDocument();
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