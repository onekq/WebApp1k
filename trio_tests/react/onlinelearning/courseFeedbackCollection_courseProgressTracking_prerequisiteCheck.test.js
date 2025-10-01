import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseFeedbackCollection_courseProgressTracking_prerequisiteCheck';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Feedback is collected at the end of the course.', async () => {
  fetchMock.post('/api/courses/feedback', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/feedback/i), { target: { value: 'Excellent course!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit feedback/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/feedback submitted/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when feedback submission fails.', async () => {
  fetchMock.post('/api/courses/feedback', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/feedback/i), { target: { value: 'Not great.' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit feedback/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to submit feedback/i)).toBeInTheDocument();
}, 10000);

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

test('Enrollment is allowed after prerequisites are met.', async () => {
  fetchMock.get('/api/check-prerequisites/101', { prerequisitesMet: true });
  fetchMock.post('/api/enroll', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Check Prerequisites/i)); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(1);
  expect(screen.getByText(/Enrolled successfully/i)).toBeInTheDocument();
}, 10000);

test('Enrollment is blocked if prerequisites are not met.', async () => {
  fetchMock.get('/api/check-prerequisites/101', { prerequisitesMet: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Check Prerequisites/i)); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(0);
  expect(screen.getByText(/Cannot enroll, prerequisites not met/i)).toBeInTheDocument();
}, 10000);
