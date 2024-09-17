import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseCompletionStatus_peerReviewAssignments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Course completion status is updated successfully.', async () => {
  fetchMock.post('/api/course-complete/101', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Complete Course/i)); });

  expect(fetchMock.calls('/api/course-complete/101').length).toEqual(1);
  expect(screen.getByText(/Course completed successfully/i)).toBeInTheDocument();
}, 10000);

test('Course completion status update fails if the server returns an error.', async () => {
  fetchMock.post('/api/course-complete/101', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Complete Course/i)); });

  expect(fetchMock.calls('/api/course-complete/101').length).toEqual(1);
  expect(screen.getByText(/Failed to complete the course/i)).toBeInTheDocument();
}, 10000);

test('Success: peer review assignment submitted', async () => {
  fetchMock.post('/api/peer-review', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('peer-review-text'), { target: { value: 'review' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Peer review submitted')).toBeInTheDocument();
}, 10000);

test('Failure: peer review assignment submission fails', async () => {
  fetchMock.post('/api/peer-review', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('peer-review-text'), { target: { value: 'review' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Peer review submission failed')).toBeInTheDocument();
}, 10000);