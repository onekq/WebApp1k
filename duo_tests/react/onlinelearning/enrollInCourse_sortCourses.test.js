import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './enrollInCourse_sortCourses';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Users can successfully enroll in a course.', async () => {
  fetchMock.post('/api/enroll', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Course ID/i), { target: { value: '101' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(1);
  expect(screen.getByText(/Enrolled successfully/i)).toBeInTheDocument();
}, 10000);

test('Users cannot enroll in a course if the server returns an error.', async () => {
  fetchMock.post('/api/enroll', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Course ID/i), { target: { value: '101' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(1);
  expect(screen.getByText(/Failed to enroll/i)).toBeInTheDocument();
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