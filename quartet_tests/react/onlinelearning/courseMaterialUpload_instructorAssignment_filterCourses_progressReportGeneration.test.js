import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseMaterialUpload_instructorAssignment_filterCourses_progressReportGeneration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: instructor uploads course material (from courseMaterialUpload_instructorAssignment)', async () => {
  fetchMock.post('/api/upload', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('upload-file'), { target: { files: ['file'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Material uploaded successfully')).toBeInTheDocument();
}, 10000);

test('Failure: course material upload fails (from courseMaterialUpload_instructorAssignment)', async () => {
  fetchMock.post('/api/upload', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('upload-file'), { target: { files: ['file'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Material upload failed')).toBeInTheDocument();
}, 10000);

test('Instructor Assignment success: should display assigned instructor. (from courseMaterialUpload_instructorAssignment)', async () => {
  fetchMock.post('/api/assign-instructor', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Instructor ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Instructor successfully assigned.')).toBeInTheDocument();
}, 10000);

test('Instructor Assignment failure: should display an error message on assignment failure. (from courseMaterialUpload_instructorAssignment)', async () => {
  fetchMock.post('/api/assign-instructor', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Instructor ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to assign instructor.')).toBeInTheDocument();
}, 10000);

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

