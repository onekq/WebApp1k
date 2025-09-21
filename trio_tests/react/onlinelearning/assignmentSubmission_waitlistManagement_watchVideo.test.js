import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './assignmentSubmission_waitlistManagement_watchVideo';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Success: assignment submitted successfully', async () => {
  fetchMock.post('/api/assignment', 200);

  await act(async () => { render(<MemoryRouter><AssignmentSubmissionComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('assignment-text'), { target: { value: 'assignment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Assignment submitted successfully')).toBeInTheDocument();
}, 10000);

test('Failure: assignment submission fails', async () => {
  fetchMock.post('/api/assignment', 500);

  await act(async () => { render(<MemoryRouter><AssignmentSubmissionComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('assignment-text'), { target: { value: 'assignment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Assignment submission failed')).toBeInTheDocument();
}, 10000);

test('Users can be successfully added to the waitlist.', async () => {
  fetchMock.post('/api/waitlist', 200);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Join Waitlist/i)); });

  expect(fetchMock.calls('/api/waitlist').length).toEqual(1);
  expect(screen.getByText(/Added to waitlist successfully/i)).toBeInTheDocument();
}, 10000);

test('Adding users to the waitlist fails with an error.', async () => {
  fetchMock.post('/api/waitlist', 400);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Join Waitlist/i)); });

  expect(fetchMock.calls('/api/waitlist').length).toEqual(1);
  expect(screen.getByText(/Failed to join waitlist/i)).toBeInTheDocument();
}, 10000);

test('Success: video plays successfully', async () => {
  fetchMock.get('/api/video', 200);
  
  await act(async () => { render(<MemoryRouter><WatchVideoComponent /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('play-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('video-player')).toBeInTheDocument();
}, 10000);

test('Failure: video fails to play', async () => {
  fetchMock.get('/api/video', 500);
  
  await act(async () => { render(<MemoryRouter><WatchVideoComponent /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('play-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error playing video')).toBeInTheDocument();
}, 10000);
