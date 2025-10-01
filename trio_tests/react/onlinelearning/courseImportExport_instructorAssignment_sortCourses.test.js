import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseImportExport_instructorAssignment_sortCourses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Course Import/Export success: should display success message on course import.', async () => {
  fetchMock.post('/api/import-course', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [new File([''], 'course.json')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Import Course')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course successfully imported.')).toBeInTheDocument();
}, 10000);

test('Course Import/Export failure: should display an error message on course import failure.', async () => {
  fetchMock.post('/api/import-course', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [new File([''], 'course.json')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Import Course')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to import course.')).toBeInTheDocument();
}, 10000);

test('Instructor Assignment success: should display assigned instructor.', async () => {
  fetchMock.post('/api/assign-instructor', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Instructor ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Instructor successfully assigned.')).toBeInTheDocument();
}, 10000);

test('Instructor Assignment failure: should display an error message on assignment failure.', async () => {
  fetchMock.post('/api/assign-instructor', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Instructor ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to assign instructor.')).toBeInTheDocument();
}, 10000);

test('Sort Courses success: should display sorted courses.', async () => {
  fetchMock.get('/api/courses?sort=popularity', [{ id: 1, title: 'Popular Course' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('course-sort'), { target: { value: 'popularity' } }); });
  
  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Popular Course')).toBeInTheDocument();
}, 10000);

test('Sort Courses failure: should display an error message if no sorting results.', async () => {
  fetchMock.get('/api/courses?sort=unknown', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('course-sort'), { target: { value: 'unknown' } }); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No courses found for this sort.')).toBeInTheDocument();
}, 10000);
