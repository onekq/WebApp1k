import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './filterCourses_progressReportGeneration_certificationVerification_courseSearch';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Filter Courses success: should display filtered courses. (from filterCourses_progressReportGeneration)', async () => {
  fetchMock.get('/api/courses?filter=beginner', [{ id: 1, title: 'Beginner Course' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('course-filter'), { target: { value: 'beginner' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Filters')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Beginner Course')).toBeInTheDocument();
}, 10000);

test('Filter Courses failure: should display an error message if no filter results. (from filterCourses_progressReportGeneration)', async () => {
  fetchMock.get('/api/courses?filter=advanced', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('course-filter'), { target: { value: 'advanced' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Apply Filters')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No courses found for this filter.')).toBeInTheDocument();
}, 10000);

test('Progress report can be generated successfully. (from filterCourses_progressReportGeneration)', async () => {
  fetchMock.get('/api/progress-report', { report: 'Mock Report' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Generate Progress Report/i)); });

  expect(fetchMock.calls('/api/progress-report').length).toEqual(1);
  expect(screen.getByText(/Mock Report/i)).toBeInTheDocument();
}, 10000);

test('Progress report generation fails if the server returns an error. (from filterCourses_progressReportGeneration)', async () => {
  fetchMock.get('/api/progress-report', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Generate Progress Report/i)); });

  expect(fetchMock.calls('/api/progress-report').length).toEqual(1);
  expect(screen.getByText(/Failed to generate progress report/i)).toBeInTheDocument();
}, 10000);

test('Certificate is verified successfully. (from certificationVerification_courseSearch)', async () => {
  fetchMock.post('/api/certificates/verify', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/certificate id/i), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/verify/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/certificate is valid/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when certificate verification fails. (from certificationVerification_courseSearch)', async () => {
  fetchMock.post('/api/certificates/verify', { valid: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/certificate id/i), { target: { value: 'invalid' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/verify/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/certificate is invalid/i)).toBeInTheDocument();
}, 10000);

test('Course Search success: should display search results. (from certificationVerification_courseSearch)', async () => {
  fetchMock.get('/api/courses?search=React', [{ id: 1, title: 'React Course' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search for courses...'), { target: { value: 'React' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('React Course')).toBeInTheDocument();
}, 10000);

test('Course Search failure: should display an error message if no results found. (from certificationVerification_courseSearch)', async () => {
  fetchMock.get('/api/courses?search=Unknown', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search for courses...'), { target: { value: 'Unknown' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No courses found.')).toBeInTheDocument();
}, 10000);

