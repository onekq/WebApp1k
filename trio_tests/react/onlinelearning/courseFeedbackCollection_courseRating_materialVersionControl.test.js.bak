import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseFeedbackCollection_courseRating_materialVersionControl';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Feedback is collected at the end of the course.', async () => {
  fetchMock.post('/api/courses/feedback', { success: true });

  await act(async () => { render(<MemoryRouter><CourseFeedback /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/feedback/i), { target: { value: 'Excellent course!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit feedback/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/feedback submitted/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when feedback submission fails.', async () => {
  fetchMock.post('/api/courses/feedback', 500);

  await act(async () => { render(<MemoryRouter><CourseFeedback /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/feedback/i), { target: { value: 'Not great.' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit feedback/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to submit feedback/i)).toBeInTheDocument();
}, 10000);

test('Users can rate and review courses.', async () => {
  fetchMock.post('/api/courses/rate', { success: true });

  await act(async () => { render(<MemoryRouter><CourseReview /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/rating/i), { target: { value: 5 } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/review/i), { target: { value: 'Great course!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit review/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/review submitted/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when submission fails.', async () => {
  fetchMock.post('/api/courses/rate', 500);

  await act(async () => { render(<MemoryRouter><CourseReview /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/rating/i), { target: { value: 3 } }); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/review/i), { target: { value: 'Okay course.' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit review/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to submit review/i)).toBeInTheDocument();
}, 10000);

test('Material Version Control success: should display version control info.', async () => {
  fetchMock.get('/api/course-materials/1/versions', [{ version: 1, details: 'Initial Version' }]);

  await act(async () => { render(<MemoryRouter><MaterialVersionControl courseId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Initial Version')).toBeInTheDocument();
}, 10000);

test('Material Version Control failure: should display an error message on version retrieval failure.', async () => {
  fetchMock.get('/api/course-materials/1/versions', 404);

  await act(async () => { render(<MemoryRouter><MaterialVersionControl courseId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Version information cannot be retrieved.')).toBeInTheDocument();
}, 10000);
