import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseScheduling_sortCourses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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