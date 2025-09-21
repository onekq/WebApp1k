import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseSearch_instructorFeedbackCollection_peerReviewAssignments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Course Search success: should display search results.', async () => {
  fetchMock.get('/api/courses?search=React', [{ id: 1, title: 'React Course' }]);

  await act(async () => { render(<MemoryRouter><CourseSearch /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search for courses...'), { target: { value: 'React' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('React Course')).toBeInTheDocument();
}, 10000);

test('Course Search failure: should display an error message if no results found.', async () => {
  fetchMock.get('/api/courses?search=Unknown', []);

  await act(async () => { render(<MemoryRouter><CourseSearch /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search for courses...'), { target: { value: 'Unknown' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No courses found.')).toBeInTheDocument();
}, 10000);

test('Feedback from instructors about course content is collected.', async () => {
  fetchMock.post('/api/instructors/feedback', { success: true });

  await act(async () => { render(<MemoryRouter><InstructorFeedback /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/content feedback/i), { target: { value: 'Well-structured course!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit feedback/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/feedback submitted/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when instructor feedback submission fails.', async () => {
  fetchMock.post('/api/instructors/feedback', 500);

  await act(async () => { render(<MemoryRouter><InstructorFeedback /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/content feedback/i), { target: { value: 'Could be better.' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit feedback/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to submit feedback/i)).toBeInTheDocument();
}, 10000);

test('Success: peer review assignment submitted', async () => {
  fetchMock.post('/api/peer-review', 200);

  await act(async () => { render(<MemoryRouter><PeerReviewAssignmentsComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('peer-review-text'), { target: { value: 'review' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Peer review submitted')).toBeInTheDocument();
}, 10000);

test('Failure: peer review assignment submission fails', async () => {
  fetchMock.post('/api/peer-review', 500);

  await act(async () => { render(<MemoryRouter><PeerReviewAssignmentsComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('peer-review-text'), { target: { value: 'review' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Peer review submission failed')).toBeInTheDocument();
}, 10000);
