import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './enrollInCourse_trackTimeSpentOnCourse_courseDetailRetrieval_courseSearch';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Users can successfully enroll in a course. (from enrollInCourse_trackTimeSpentOnCourse)', async () => {
  fetchMock.post('/api/enroll', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Course ID/i), { target: { value: '101' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(1);
  expect(screen.getByText(/Enrolled successfully/i)).toBeInTheDocument();
}, 10000);

test('Users cannot enroll in a course if the server returns an error. (from enrollInCourse_trackTimeSpentOnCourse)', async () => {
  fetchMock.post('/api/enroll', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Course ID/i), { target: { value: '101' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(1);
  expect(screen.getByText(/Failed to enroll/i)).toBeInTheDocument();
}, 10000);

test('Time spent on course content is recorded successfully. (from enrollInCourse_trackTimeSpentOnCourse)', async () => {
  fetchMock.get('/api/time-spent/101', { timeSpent: '5 hours' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Time Spent/i)); });

  expect(fetchMock.calls('/api/time-spent/101').length).toEqual(1);
  expect(screen.getByText(/Time Spent: 5 hours/i)).toBeInTheDocument();
}, 10000);

test('Time spent on course content tracking fails if the server returns an error. (from enrollInCourse_trackTimeSpentOnCourse)', async () => {
  fetchMock.get('/api/time-spent/101', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Time Spent/i)); });

  expect(fetchMock.calls('/api/time-spent/101').length).toEqual(1);
  expect(screen.getByText(/Failed to track time spent/i)).toBeInTheDocument();
}, 10000);

test('Course Detail Retrieval success: should display course details. (from courseDetailRetrieval_courseSearch)', async () => {
  fetchMock.get('/api/courses/1', { id: 1, title: 'React Course', details: 'Detailed info' });

  await act(async () => { render(<MemoryRouter><App courseId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Detailed info')).toBeInTheDocument();
}, 10000);

test('Course Detail Retrieval failure: should display an error message on failed detail retrieval. (from courseDetailRetrieval_courseSearch)', async () => {
  fetchMock.get('/api/courses/1', 404);

  await act(async () => { render(<MemoryRouter><App courseId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course details cannot be retrieved.')).toBeInTheDocument();
}, 10000);

test('Course Search success: should display search results. (from courseDetailRetrieval_courseSearch)', async () => {
  fetchMock.get('/api/courses?search=React', [{ id: 1, title: 'React Course' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search for courses...'), { target: { value: 'React' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('React Course')).toBeInTheDocument();
}, 10000);

test('Course Search failure: should display an error message if no results found. (from courseDetailRetrieval_courseSearch)', async () => {
  fetchMock.get('/api/courses?search=Unknown', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search for courses...'), { target: { value: 'Unknown' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No courses found.')).toBeInTheDocument();
}, 10000);

