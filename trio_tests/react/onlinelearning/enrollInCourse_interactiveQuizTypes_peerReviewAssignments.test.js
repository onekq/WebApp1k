import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './enrollInCourse_interactiveQuizTypes_peerReviewAssignments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Users can successfully enroll in a course.', async () => {
  fetchMock.post('/api/enroll', 200);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Course ID/i), { target: { value: '101' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(1);
  expect(screen.getByText(/Enrolled successfully/i)).toBeInTheDocument();
}, 10000);

test('Users cannot enroll in a course if the server returns an error.', async () => {
  fetchMock.post('/api/enroll', 400);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Course ID/i), { target: { value: '101' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(1);
  expect(screen.getByText(/Failed to enroll/i)).toBeInTheDocument();
}, 10000);

test('Success: multiple choice quiz functions correctly', async () => {
  fetchMock.get('/api/multiple-choice-quiz', 200);

  await act(async () => { render(<MemoryRouter><InteractiveQuizTypesComponent /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('start-multiple-choice-quiz')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Multiple choice quiz loaded')).toBeInTheDocument();
}, 10000);

test('Failure: multiple choice quiz fails to load', async () => {
  fetchMock.get('/api/multiple-choice-quiz', 500);

  await act(async () => { render(<MemoryRouter><InteractiveQuizTypesComponent /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('start-multiple-choice-quiz')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading multiple choice quiz')).toBeInTheDocument();
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
